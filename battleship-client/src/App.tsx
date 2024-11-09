import React, { useState } from 'react';
import { SignalRProvider } from './contexts/SignalRContext';
import TeamSelection from './components/TeamSelection';
import GameBoard from './components/GameBoard';
import { Player } from './models';

const App: React.FC = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

    const handleTeamFull = (newPlayers: Player[]) => {
        setPlayers(newPlayers);
        setGameStarted(true);
    };

    const handleShipsPlaced = () => {
        console.log("All ships have been placed.");

    };

    return (
        <SignalRProvider>
            <div style={{ textAlign: 'center' }}>
                <h1>Battleship 2v2 Game</h1>
                {gameStarted ? (
                    <GameBoard
                        players={players}
                        currentPlayerId={currentPlayerId}
                        onShipsPlaced={handleShipsPlaced}
                    />
                ) : (
                    <TeamSelection onTeamFull={handleTeamFull} setCurrentPlayerId={setCurrentPlayerId} />
                )}
            </div>
        </SignalRProvider>
    );
};

export default App;
