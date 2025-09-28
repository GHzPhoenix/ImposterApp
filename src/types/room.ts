export interface Room {
  id: string;
  code: string;
  hostId: string;
  players: RoomPlayer[];
  gameState: GameState | null;
  settings: GameSettings;
  status: 'waiting' | 'role-reveal' | 'playing' | 'voting' | 'finished';
  createdAt: Date;
  maxPlayers: number;
}

export interface RoomPlayer {
  id: string;
  name: string;
  isHost: boolean;
  isConnected: boolean;
  role?: 'imposter' | 'crew';
  isEliminated?: boolean;
  joinedAt: Date;
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

export interface GameSettings {
  maxRounds: number;
  minPlayers: number;
  maxPlayers: number;
  allowImposterGuess: boolean;
}

export interface RoomMessage {
  type: 'player-joined' | 'player-left' | 'game-update' | 'clue-submitted' | 'vote-cast' | 'game-started' | 'game-ended';
  data: any;
  timestamp: Date;
  playerId?: string;
}
