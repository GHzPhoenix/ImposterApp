import { useState, useCallback, useEffect } from 'react';
import type { Room, RoomPlayer, RoomMessage, GameSettings } from '../types/room';
import { getRandomWord } from '../data/words';

// Mock room service - in a real app, this would connect to a backend
class MockRoomService {
  private rooms: Map<string, Room> = new Map();
  private listeners: Map<string, ((message: RoomMessage) => void)[]> = new Map();

  createRoom(hostName: string, settings: GameSettings): Room {
    const roomCode = this.generateRoomCode();
    const hostId = `player-${Date.now()}`;
    
    const room: Room = {
      id: `room-${Date.now()}`,
      code: roomCode,
      hostId,
      players: [{
        id: hostId,
        name: hostName,
        isHost: true,
        isConnected: true,
        joinedAt: new Date(),
      }],
      gameState: null,
      settings,
      status: 'waiting',
      createdAt: new Date(),
      maxPlayers: settings.maxPlayers,
    };

    this.rooms.set(room.id, room);
    return room;
  }

  joinRoom(roomCode: string, playerName: string): Room | null {
    const room = Array.from(this.rooms.values()).find(r => r.code === roomCode);
    if (!room || room.players.length >= room.maxPlayers) {
      return null;
    }

    const playerId = `player-${Date.now()}`;
    const newPlayer: RoomPlayer = {
      id: playerId,
      name: playerName,
      isHost: false,
      isConnected: true,
      joinedAt: new Date(),
    };

    room.players.push(newPlayer);
    this.notifyRoom(room.id, {
      type: 'player-joined',
      data: newPlayer,
      timestamp: new Date(),
    });

    return room;
  }

  startGame(roomId: string, secretWord?: string): Room | null {
    const room = this.rooms.get(roomId);
    if (!room || room.players.length < room.settings.minPlayers) {
      return null;
    }

    // Calculate number of imposters
    const numImposters = this.calculateImposterCount(room.players.length);
    
    // Assign roles
    const players = room.players.map(player => ({
      ...player,
      role: 'crew' as 'crew' | 'imposter',
      isEliminated: false,
    }));

    // Randomly assign imposters
    const imposterIndices = new Set<number>();
    while (imposterIndices.size < numImposters) {
      const randomIndex = Math.floor(Math.random() * players.length);
      imposterIndices.add(randomIndex);
    }
    
    imposterIndices.forEach(index => {
      players[index].role = 'imposter';
    });

    room.gameState = {
      id: `game-${Date.now()}`,
      status: 'role-reveal',
      players: players.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role!,
        isEliminated: false,
      })),
      secretWord: secretWord || getRandomWord(),
      currentRound: 1,
      maxRounds: room.settings.maxRounds,
      clues: [],
      votes: [],
      imposterGuess: null,
      winner: null,
      eliminatedPlayer: null,
    };

    room.status = 'role-reveal';
    this.notifyRoom(roomId, {
      type: 'game-started',
      data: room.gameState,
      timestamp: new Date(),
    });

    return room;
  }

  addClue(roomId: string, playerId: string, clueText: string): Room | null {
    const room = this.rooms.get(roomId);
    if (!room?.gameState || room.gameState.status !== 'playing') {
      return null;
    }

    const player = room.gameState.players.find(p => p.id === playerId);
    if (!player || player.isEliminated) {
      return null;
    }

    const newClue = {
      id: `clue-${Date.now()}`,
      playerId,
      playerName: player.name,
      text: clueText,
      round: room.gameState.currentRound,
      timestamp: new Date(),
    };

    room.gameState.clues.push(newClue);
    this.notifyRoom(roomId, {
      type: 'clue-submitted',
      data: newClue,
      timestamp: new Date(),
      playerId,
    });

    return room;
  }

  addVote(roomId: string, voterId: string, targetId: string): Room | null {
    const room = this.rooms.get(roomId);
    if (!room?.gameState || room.gameState.status !== 'voting') {
      return null;
    }

    const newVote = {
      voterId,
      targetId,
      round: room.gameState.currentRound,
    };

    room.gameState.votes = room.gameState.votes.filter(v => v.voterId !== voterId);
    room.gameState.votes.push(newVote);

    this.notifyRoom(roomId, {
      type: 'vote-cast',
      data: newVote,
      timestamp: new Date(),
      playerId: voterId,
    });

    return room;
  }

  subscribeToRoom(roomId: string, callback: (message: RoomMessage) => void): () => void {
    if (!this.listeners.has(roomId)) {
      this.listeners.set(roomId, []);
    }
    this.listeners.get(roomId)!.push(callback);

    return () => {
      const listeners = this.listeners.get(roomId);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private calculateImposterCount(playerCount: number): number {
    if (playerCount <= 4) return 1;
    if (playerCount <= 6) return 1;
    if (playerCount <= 8) return 2;
    if (playerCount <= 10) return 2;
    if (playerCount <= 12) return 3;
    return Math.floor(playerCount / 4);
  }

  private notifyRoom(roomId: string, message: RoomMessage): void {
    const listeners = this.listeners.get(roomId);
    if (listeners) {
      listeners.forEach(callback => callback(message));
    }
  }

  getRoom(roomId: string): Room | null {
    return this.rooms.get(roomId) || null;
  }
}

const roomService = new MockRoomService();

export function useRoom() {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [isHost, setIsHost] = useState(false);

  const createRoom = useCallback((hostName: string, settings: GameSettings) => {
    const room = roomService.createRoom(hostName, settings);
    setCurrentRoom(room);
    setCurrentPlayerId(room.hostId);
    setIsHost(true);
    return room;
  }, []);

  const joinRoom = useCallback((roomCode: string, playerName: string) => {
    const room = roomService.joinRoom(roomCode, playerName);
    if (room) {
      setCurrentRoom(room);
      const player = room.players.find(p => p.name === playerName && !p.isHost);
      if (player) {
        setCurrentPlayerId(player.id);
        setIsHost(false);
      }
    }
    return room;
  }, []);

  const startGame = useCallback((secretWord?: string) => {
    if (!currentRoom || !isHost) return null;
    const updatedRoom = roomService.startGame(currentRoom.id, secretWord);
    if (updatedRoom) {
      setCurrentRoom(updatedRoom);
    }
    return updatedRoom;
  }, [currentRoom, isHost]);

  const addClue = useCallback((clueText: string) => {
    if (!currentRoom || !currentPlayerId) return null;
    const updatedRoom = roomService.addClue(currentRoom.id, currentPlayerId, clueText);
    if (updatedRoom) {
      setCurrentRoom(updatedRoom);
    }
    return updatedRoom;
  }, [currentRoom, currentPlayerId]);

  const addVote = useCallback((targetId: string) => {
    if (!currentRoom || !currentPlayerId) return null;
    const updatedRoom = roomService.addVote(currentRoom.id, currentPlayerId, targetId);
    if (updatedRoom) {
      setCurrentRoom(updatedRoom);
    }
    return updatedRoom;
  }, [currentRoom, currentPlayerId]);

  const leaveRoom = useCallback(() => {
    setCurrentRoom(null);
    setCurrentPlayerId('');
    setIsHost(false);
  }, []);

  // Subscribe to room updates
  useEffect(() => {
    if (!currentRoom) return;

    const unsubscribe = roomService.subscribeToRoom(currentRoom.id, (message) => {
      const updatedRoom = roomService.getRoom(currentRoom.id);
      if (updatedRoom) {
        setCurrentRoom(updatedRoom);
      }
    });

    return unsubscribe;
  }, [currentRoom]);

  return {
    currentRoom,
    currentPlayerId,
    isHost,
    createRoom,
    joinRoom,
    startGame,
    addClue,
    addVote,
    leaveRoom,
  };
}
