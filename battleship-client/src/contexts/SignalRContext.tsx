import React, { createContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { Player, Game,GameState } from '../models';

interface SignalRContextType {
    connection: signalR.HubConnection | null;
    players: Player[];
    isGameStarted: boolean;
    game: Game | null; 
    gameState: GameState | null; 
    setPlayerReady: (gameId: string, playerId: string) => Promise<void>;
    updatePlayers: (newPlayers: Player[]) => void;
}

export const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
    const [gameState, setGameState] = useState<GameState | null>(null); 
    const [game, setGame] = useState<Game | null>(null); 
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5209/gameHub")
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        newConnection.start()
            .then(() => console.log("Connected to SignalR"))
            .catch(err => console.error("Connection failed: ", err));

        // Listen for player ready updates
        newConnection.on("PlayerReady", (playerId: string) => {
            setPlayers(prevPlayers => 
                prevPlayers.map(player => 
                    player.id === playerId ? { ...player, isReady: true } : player
                )
            );
        });

        // Listen for the game started event
        newConnection.on("GameStarted", (state: GameState,game: Game) => {
            console.log("Game has started!");
            setIsGameStarted(true);
            setGameState(state); // Update the game state
            setGame(game);
        });

        // Listen for updates to the game state
        newConnection.on("UpdateGameState", (game: Game) => {
            console.log("Game state updated:", game);
            setGame(game);
        });

        return () => {
            newConnection.stop();
        };
    }, []);

    const setPlayerReady = async (gameId: string, playerId: string) => {
        if (connection) {
            await connection.invoke("SetPlayerReady", gameId, playerId);
        }
    };

    const updatePlayers = (newPlayers: Player[]) => {
        setPlayers(newPlayers);
    };

    return (
        <SignalRContext.Provider value={{ connection, players, isGameStarted, gameState, setPlayerReady, updatePlayers , game }}>
            {children}
        </SignalRContext.Provider>
    );
};
