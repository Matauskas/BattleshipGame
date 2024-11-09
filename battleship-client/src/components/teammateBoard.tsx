import React from 'react';
import { Player } from '../models';
import Board from './Board';

interface TeammateBoardProps {
    players: Player[];
    currentPlayerId: string | null;
}

const TeammateBoard: React.FC<TeammateBoardProps> = ({ players, currentPlayerId }) => {
    const currentPlayer = players.find(player => player.id === currentPlayerId);
    const currentTeam = currentPlayer?.team;

    return (
        <div className="teammate-boards">
            {players.map((player) => {
                const isTeammateBoard = player.team === currentTeam && player.id !== currentPlayerId;

                return (
                    isTeammateBoard && (
                        <div key={player.id}>
                            <h3>{player.name}'s Board</h3>
                            <Board
                                board={player.board.grid}
                                isPlayerBoard={false} 
                                onShipsPlaced={undefined}
                                onShoot={undefined} 
                                playerName={player.name}
                                playerId={player.id}
                                gameId="game-1"
                            />
                        </div>
                    )
                );
            })}
        </div>
    );
};

export default TeammateBoard;
