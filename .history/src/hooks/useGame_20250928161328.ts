import { useState, useCallback } from 'react';
import { GameState, Player, Clue, Vote, GameSettings } from '../types/game';
import { getRandomWord } from '../data/words';

const DEFAULT_SETTINGS: GameSettings = {
  maxRounds: 3,
  minPlayers: 3,
  maxPlayers: 10,
  allowImposterGuess: true,
};

export function useGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  const createGame = useCallback((playerNames: string[], secretWord?: string) => {
    if (playerNames.length < settings.minPlayers || playerNames.length > settings.maxPlayers) {
      throw new Error(`Game requires between ${settings.minPlayers} and ${settings.maxPlayers} players`);
    }

    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      role: 'crew' as const,
      isEliminated: false,
    }));

    // Randomly assign one player as imposter
    const imposterIndex = Math.floor(Math.random() * players.length);
    players[imposterIndex].role = 'imposter';

    const newGameState: GameState = {
      id: `game-${Date.now()}`,
      status: 'playing',
      players,
      secretWord: secretWord || getRandomWord(),
      currentRound: 1,
      maxRounds: settings.maxRounds,
      clues: [],
      votes: [],
      imposterGuess: null,
      winner: null,
      eliminatedPlayer: null,
    };

    setGameState(newGameState);
    return newGameState;
  }, [settings]);

  const addClue = useCallback((playerId: string, clueText: string) => {
    if (!gameState || gameState.status !== 'playing') return;

    const player = gameState.players.find(p => p.id === playerId);
    if (!player || player.isEliminated) return;

    const newClue: Clue = {
      id: `clue-${Date.now()}`,
      playerId,
      playerName: player.name,
      text: clueText,
      round: gameState.currentRound,
      timestamp: new Date(),
    };

    setGameState(prev => prev ? {
      ...prev,
      clues: [...prev.clues, newClue],
    } : null);
  }, [gameState]);

  const addVote = useCallback((voterId: string, targetId: string) => {
    if (!gameState || gameState.status !== 'voting') return;

    const newVote: Vote = {
      voterId,
      targetId,
      round: gameState.currentRound,
    };

    setGameState(prev => prev ? {
      ...prev,
      votes: [...prev.votes.filter(v => v.voterId !== voterId), newVote],
    } : null);
  }, [gameState]);

  const nextRound = useCallback(() => {
    if (!gameState) return;

    setGameState(prev => prev ? {
      ...prev,
      currentRound: prev.currentRound + 1,
      status: 'playing',
      votes: [],
    } : null);
  }, [gameState]);

  const startVoting = useCallback(() => {
    if (!gameState) return;

    setGameState(prev => prev ? {
      ...prev,
      status: 'voting',
    } : null);
  }, [gameState]);

  const eliminatePlayer = useCallback((playerId: string) => {
    if (!gameState) return;

    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    setGameState(prev => prev ? {
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? { ...p, isEliminated: true } : p
      ),
      eliminatedPlayer: player,
      status: 'finished',
    } : null);

    // Check win conditions
    checkWinConditions(player);
  }, [gameState]);

  const setImposterGuess = useCallback((guess: string) => {
    if (!gameState) return;

    setGameState(prev => prev ? {
      ...prev,
      imposterGuess: guess,
    } : null);

    // Check if imposter guessed correctly
    if (guess.toLowerCase() === gameState.secretWord.toLowerCase()) {
      setGameState(prev => prev ? {
        ...prev,
        winner: 'imposter',
        status: 'finished',
      } : null);
    }
  }, [gameState]);

  const checkWinConditions = useCallback((eliminatedPlayer: Player) => {
    if (!gameState) return;

    if (eliminatedPlayer.role === 'imposter') {
      // Crew wins if imposter is eliminated
      setGameState(prev => prev ? {
        ...prev,
        winner: 'crew',
      } : null);
    } else {
      // Check if enough crew members are eliminated
      const remainingCrew = gameState.players.filter(p => 
        p.role === 'crew' && !p.isEliminated
      );
      
      if (remainingCrew.length <= 1) {
        setGameState(prev => prev ? {
          ...prev,
          winner: 'imposter',
        } : null);
      }
    }
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(null);
  }, []);

  const getVoteResults = useCallback(() => {
    if (!gameState || gameState.status !== 'voting') return {};

    const voteCounts: Record<string, number> = {};
    gameState.votes.forEach(vote => {
      voteCounts[vote.targetId] = (voteCounts[vote.targetId] || 0) + 1;
    });

    return voteCounts;
  }, [gameState]);

  const getMostVotedPlayer = useCallback(() => {
    const voteResults = getVoteResults();
    if (Object.keys(voteResults).length === 0) return null;

    const maxVotes = Math.max(...Object.values(voteResults));
    const mostVotedId = Object.keys(voteResults).find(id => voteResults[id] === maxVotes);
    
    return gameState?.players.find(p => p.id === mostVotedId) || null;
  }, [gameState, getVoteResults]);

  return {
    gameState,
    settings,
    setSettings,
    createGame,
    addClue,
    addVote,
    nextRound,
    startVoting,
    eliminatePlayer,
    setImposterGuess,
    resetGame,
    getVoteResults,
    getMostVotedPlayer,
  };
}
