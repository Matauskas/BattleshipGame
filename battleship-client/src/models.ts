
export interface Cell {
    hasShip: boolean;
    isHit: boolean;
    isMiss: boolean;
}


export interface Coordinate {
    row: number;
    column: number;
}



export interface Board {
    grid: Cell[][]; 
    ships: Ship[];
}


export interface Player {
    id: string; 
    name: string;
    team: string; 
    board: Board; 
    isReady: boolean;
}


export interface Team {
    name: string; 
    players: Player[]; 
}


export interface Game {
    gameId: string; 
    teams: Team[]; 
    state: string; 
    players: { [key: string]: Player }; 
}


export interface EGame {
    gameId: string; 
    teams: Team[]; 
    players: { [key: string]: Player }; 
    state: string; 
    currentTurn: string
    currentPlayerIndex: number
}



export interface Ship {
    name: string;
    length: number; 
    coordinates: Coordinate[]; 
    orientation: 'horizontal' | 'vertical';
    isPlaced: boolean; 
    hitCount: number;
    isSunk: boolean;
}


export interface GameState {
    CurrentTurn: string; 
    CurrentPlayerIndex: number; 
    Players: Player[]; 
    boards: { [playerId: string]: Cell[][] };
}

export interface ShipE {
    coordinates: Coordinate[]; 
    hitCount: number;
}