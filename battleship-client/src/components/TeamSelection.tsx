import React, { useEffect, useState, useContext } from 'react';
import { SignalRContext } from '../contexts/SignalRContext';
import { Game, Team, Player } from '../models';
import { v4 as uuidv4 } from 'uuid';

interface TeamSelectionProps {
    onTeamFull: (players: Player[]) => void;
    setCurrentPlayerId: (playerId: string) => void; 
}

const TeamSelection: React.FC<TeamSelectionProps> = ({ onTeamFull, setCurrentPlayerId }) => {
    const signalRContext = useContext(SignalRContext);
    const [game, setGame] = useState<Game | null>(null);
    const [waitingMessage, setWaitingMessage] = useState<string>('Join a team to start!');
    const [teamPlayers, setTeamPlayers] = useState<{ [key: string]: Player[] }>({ Red: [], Blue: [] });
    const [playerName, setPlayerName] = useState<string>('');
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [gameId, setGameId] = useState<string>('game-1');

    useEffect(() => {
        if (signalRContext?.connection) {
            const connection = signalRContext.connection;

            connection.on("UpdateTeams", (updatedTeams: Team[]) => {
                const updatedPlayers: { [key: string]: Player[] } = { Red: [], Blue: [] };

                updatedTeams.forEach(team => {
                    updatedPlayers[team.name] = team.players;
                });

                setTeamPlayers(updatedPlayers);
                checkIfTeamsFull(updatedPlayers);
            });

            connection.on("GameStarted", (startedGame: Game) => {
                if (startedGame.gameId === gameId) {
                    setGame(startedGame);
                }
            });

            return () => {
                connection.off("UpdateTeams");
                connection.off("GameStarted");
            };
        }
    }, [signalRContext, onTeamFull]);

    const checkIfTeamsFull = (updatedPlayers: { [key: string]: Player[] }) => {
        if (updatedPlayers.Red.length === 2 && updatedPlayers.Blue.length === 2) {
            const playerList = [...updatedPlayers.Red, ...updatedPlayers.Blue];
            onTeamFull(playerList);
        }
    };

    const joinTeam = (team: string) => {
        if (signalRContext?.connection && playerName.trim()) {
            const playerId = uuidv4();
            const gameId = "game-1";

            signalRContext.connection.invoke("JoinTeam", gameId, team, playerName, playerId)
                .then(() => {
                    setSelectedTeam(team);
                    setPlayerId(playerId);
                    setCurrentPlayerId(playerId); // Set the player ID for the App component
                })
                .catch(err => setError("Failed to join the team. Please try again."));
        }
    };

    const isGameInProgress = game ? game.state === "InProgress" : false;

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>2v2 Battleship Game</h1>

            {!isGameInProgress && !selectedTeam ? (
                <div>
                    <h2>Select a Team</h2>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        style={{ margin: "10px", padding: "10px" }}
                        aria-label="Player Name"
                    />
                    <div>
                        <TeamButton 
                            team="Red" 
                            playersCount={teamPlayers.Red.length} 
                            isLoading={loading} 
                            onClick={joinTeam} 
                        />
                        <TeamButton 
                            team="Blue" 
                            playersCount={teamPlayers.Blue.length} 
                            isLoading={loading} 
                            onClick={joinTeam} 
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            ) : (
                <TeamStatus 
                    waitingMessage={waitingMessage} 
                    teamPlayers={teamPlayers} 
                    isGameInProgress={isGameInProgress} 
                    playerId={playerId} // Pass player ID to status
                />
            )}
        </div>
    );
};

interface TeamButtonProps {
    team: string;
    playersCount: number;
    isLoading: boolean;
    onClick: (team: string) => void;
}

const TeamButton: React.FC<TeamButtonProps> = ({ team, playersCount, isLoading, onClick }) => (
    <button
        onClick={() => onClick(team)}
        style={{ margin: "10px", padding: "10px" }}
        disabled={playersCount >= 2 || isLoading}
        aria-label={`Join Team ${team}`}
    >
        {isLoading ? "Joining..." : `Join Team ${team}`} {playersCount >= 2 ? "(Full)" : ""}
    </button>
);

interface TeamStatusProps {
    waitingMessage: string;
    teamPlayers: { [key: string]: Player[] };
    isGameInProgress: boolean;
    playerId: string | null;
}

const TeamStatus: React.FC<TeamStatusProps> = ({ waitingMessage, teamPlayers, isGameInProgress, playerId }) => (
    <div>
        <h2>{waitingMessage}</h2>
        {playerId && <p>Your Player ID: {playerId}</p>}
        <div>
            <h3>Team Red ({teamPlayers.Red.length} / 2)</h3>
            <ul>
                {teamPlayers.Red.map(player => (
                    <li key={player.id}>{player.name} (ID: {player.id})</li>
                ))}
            </ul>
        </div>
        <div>
            <h3>Team Blue ({teamPlayers.Blue.length} / 2)</h3>
            <ul>
                {teamPlayers.Blue.map(player => (
                    <li key={player.id}>{player.name} (ID: {player.id})</li>
                ))}
            </ul>
        </div>
        {isGameInProgress && (
            <p>The game has started! Get ready to play.</p>
        )}
    </div>
);

export default TeamSelection;
