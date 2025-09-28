import { useState } from 'react';
import { 
  MessageSquare, 
  Vote, 
  Users, 
  Clock, 
  Eye, 
  EyeOff, 
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import type { GameState } from '../types/game';

interface GameplayProps {
  gameState: GameState;
  currentPlayerId: string;
  onAddClue: (playerId: string, clue: string) => void;
  onAddVote: (voterId: string, targetId: string) => void;
  onStartVoting: () => void;
  onNextRound: () => void;
  onSetImposterGuess: (guess: string) => void;
}

export function Gameplay({
  gameState,
  currentPlayerId,
  onAddClue,
  onAddVote,
  onStartVoting,
  onNextRound,
  onSetImposterGuess
}: GameplayProps) {
  const [newClue, setNewClue] = useState('');
  const [imposterGuess, setImposterGuess] = useState('');
  const [showSecretWord, setShowSecretWord] = useState(false);

  const currentPlayer = gameState.players.find(p => p.id === currentPlayerId);
  const activePlayers = gameState.players.filter(p => !p.isEliminated);
  const currentRoundClues = gameState.clues.filter(c => c.round === gameState.currentRound);
  const currentRoundVotes = gameState.votes.filter(v => v.round === gameState.currentRound);

  const handleSubmitClue = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClue.trim() && currentPlayer) {
      onAddClue(currentPlayer.id, newClue.trim());
      setNewClue('');
    }
  };

  const handleVote = (targetId: string) => {
    if (currentPlayer) {
      onAddVote(currentPlayer.id, targetId);
    }
  };

  const handleImposterGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (imposterGuess.trim()) {
      onSetImposterGuess(imposterGuess.trim());
      setImposterGuess('');
    }
  };

  const canStartVoting = currentRoundClues.length >= activePlayers.length;
  const allPlayersVoted = currentRoundVotes.length >= activePlayers.length;

  return (
    <div className="gameplay">
      <div className="game-header">
        <div className="game-info">
          <h2>🎭 Imposter Game</h2>
          <div className="game-stats">
            <div className="stat">
              <Clock size={16} />
              Round {gameState.currentRound} / {gameState.maxRounds}
            </div>
            <div className="stat">
              <Users size={16} />
              {activePlayers.length} players
            </div>
            <div className="stat">
              <MessageSquare size={16} />
              {currentRoundClues.length} clues
            </div>
          </div>
        </div>

        <div className="secret-word-section">
          <button
            onClick={() => setShowSecretWord(!showSecretWord)}
            className="secret-word-toggle"
          >
            {showSecretWord ? <EyeOff size={16} /> : <Eye size={16} />}
            {showSecretWord ? 'Hide' : 'Show'} Secret Word
          </button>
          {showSecretWord && (
            <div className="secret-word-display">
              <span className="secret-word">{gameState.secretWord}</span>
            </div>
          )}
        </div>
      </div>

      <div className="game-content">
        {/* Player Status */}
        <div className="players-section">
          <h3>Players</h3>
          <div className="players-grid">
            {gameState.players.map(player => (
              <div
                key={player.id}
                className={`player-card ${player.isEliminated ? 'eliminated' : ''} ${
                  player.id === currentPlayerId ? 'current-player' : ''
                }`}
              >
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                  {player.isEliminated && <XCircle size={16} className="eliminated-icon" />}
                  {player.id === currentPlayerId && <CheckCircle size={16} className="current-icon" />}
                </div>
                {currentPlayer?.role === 'imposter' && player.role === 'imposter' && (
                  <div className="role-indicator imposter">👹</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Clues Section */}
        <div className="clues-section">
          <h3>Clues - Round {gameState.currentRound}</h3>
          
          {gameState.status === 'playing' && currentPlayer && !currentPlayer.isEliminated && (
            <form onSubmit={handleSubmitClue} className="clue-form">
              <input
                type="text"
                placeholder="Enter your clue..."
                value={newClue}
                onChange={(e) => setNewClue(e.target.value)}
                className="clue-input"
                maxLength={50}
              />
              <button type="submit" className="submit-clue-btn">
                Submit Clue
              </button>
            </form>
          )}

          <div className="clues-list">
            {currentRoundClues.map(clue => (
              <div key={clue.id} className="clue-item">
                <div className="clue-header">
                  <span className="clue-player">{clue.playerName}</span>
                  <span className="clue-time">
                    {clue.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="clue-text">"{clue.text}"</div>
              </div>
            ))}
          </div>

          {gameState.status === 'playing' && canStartVoting && (
            <button onClick={onStartVoting} className="start-voting-btn">
              <Vote size={16} />
              Start Voting
            </button>
          )}
        </div>

        {/* Voting Section */}
        {gameState.status === 'voting' && (
          <div className="voting-section">
            <h3>Vote for the Imposter</h3>
            
            {currentPlayer && !currentPlayer.isEliminated && (
              <div className="voting-options">
                {activePlayers
                  .filter(player => player.id !== currentPlayer.id)
                  .map(player => (
                    <button
                      key={player.id}
                      onClick={() => handleVote(player.id)}
                      className={`vote-btn ${
                        currentRoundVotes.find(v => v.voterId === currentPlayer.id)?.targetId === player.id
                          ? 'selected'
                          : ''
                      }`}
                    >
                      {player.name}
                    </button>
                  ))}
              </div>
            )}

            <div className="vote-results">
              {currentRoundVotes.map(vote => {
                const voter = gameState.players.find(p => p.id === vote.voterId);
                const target = gameState.players.find(p => p.id === vote.targetId);
                return (
                  <div key={`${vote.voterId}-${vote.targetId}`} className="vote-result">
                    {voter?.name} voted for {target?.name}
                  </div>
                );
              })}
            </div>

            {allPlayersVoted && (
              <div className="voting-actions">
                <button onClick={onNextRound} className="next-round-btn">
                  Next Round
                </button>
              </div>
            )}
          </div>
        )}

        {/* Imposter Guess Section */}
        {gameState.eliminatedPlayer?.role === 'imposter' && gameState.imposterGuess === null && (
          <div className="imposter-guess-section">
            <h3>🎭 Imposter, guess the secret word!</h3>
            <form onSubmit={handleImposterGuess} className="guess-form">
              <input
                type="text"
                placeholder="What do you think the secret word is?"
                value={imposterGuess}
                onChange={(e) => setImposterGuess(e.target.value)}
                className="guess-input"
              />
              <button type="submit" className="submit-guess-btn">
                Submit Guess
              </button>
            </form>
          </div>
        )}

        {/* Game Result */}
        {gameState.status === 'finished' && (
          <div className="game-result">
            <h3>🎉 Game Over!</h3>
            <div className={`result-message ${gameState.winner}`}>
              {gameState.winner === 'crew' ? (
                <>
                  <CheckCircle size={24} />
                  Crew Wins! The imposter was found.
                </>
              ) : (
                <>
                  <AlertTriangle size={24} />
                  Imposter Wins! They avoided detection.
                </>
              )}
            </div>
            
            {gameState.imposterGuess && (
              <div className="imposter-guess-result">
                <p>Imposter's guess: "{gameState.imposterGuess}"</p>
                <p>Secret word: "{gameState.secretWord}"</p>
                <p className={gameState.imposterGuess.toLowerCase() === gameState.secretWord.toLowerCase() ? 'correct' : 'incorrect'}>
                  {gameState.imposterGuess.toLowerCase() === gameState.secretWord.toLowerCase() ? 'Correct!' : 'Incorrect!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
