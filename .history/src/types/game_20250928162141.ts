export interface Player {
  id: string;
  name: string;
  role: 'imposter' | 'crew';
  isEliminated: boolean;
}

export interface Clue {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  round: number;
  timestamp: Date;
}

export interface Vote {
  voterId: string;
  targetId: string;
  round: number;
}

export interface GameState {
  id: string;
  status: 'setup' | 'role-reveal' | 'playing' | 'voting' | 'finished';
  players: Player[];
  secretWord: string;
  currentRound: number;
  maxRounds: number;
  clues: Clue[];
  votes: Vote[];
  imposterGuess: string | null;
  winner: 'crew' | 'imposter' | null;
  eliminatedPlayer: Player | null;
}

export interface GameSettings {
  maxRounds: number;
  minPlayers: number;
  maxPlayers: number;
  allowImposterGuess: boolean;
}
