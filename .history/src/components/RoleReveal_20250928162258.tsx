import { useState } from 'react';
import { Eye, Users, ArrowRight } from 'lucide-react';
import type { GameState } from '../types/game';

interface RoleRevealProps {
  gameState: GameState;
  onStartGame: () => void;
}

export function RoleReveal({ gameState, onStartGame }: RoleRevealProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showRole, setShowRole] = useState(false);

  const currentPlayer = gameState.players[currentPlayerIndex];
  const isLastPlayer = currentPlayerIndex === gameState.players.length - 1;

  const handleNextPlayer = () => {
    setCompletedPlayers(prev => new Set([...prev, currentPlayerIndex]));
    setShowRole(false);
    
    if (isLastPlayer) {
      // All players have seen their roles, start the game
      onStartGame();
    } else {
      setCurrentPlayerIndex(prev => prev + 1);
    }
  };

  const handleShowRole = () => {
    setShowRole(true);
  };

  const handleSkipToGame = () => {
    onStartGame();
  };

  return (
    <div className="role-reveal">
      <div className="role-reveal-header">
        <h2>🎭 Role Assignment</h2>
        <p>Each player will see their role individually</p>
      </div>

      <div className="role-reveal-content">
        <div className="player-info">
          <div className="current-player-card">
            <div className="player-avatar">
              <Users size={48} />
            </div>
            <h3>{currentPlayer.name}</h3>
            <p>Player {currentPlayerIndex + 1} of {gameState.players.length}</p>
          </div>

          <div className="role-section">
            {!showRole ? (
              <div className="role-prompt">
                <h4>Ready to see your role?</h4>
                <p>Click the button below to reveal your role for this game.</p>
                <button onClick={handleShowRole} className="reveal-role-btn">
                  <Eye size={20} />
                  Reveal My Role
                </button>
              </div>
            ) : (
              <div className="role-display">
                {currentPlayer.role === 'imposter' ? (
                  <div className="imposter-role">
                    <div className="role-icon imposter-icon">👹</div>
                    <h4>You are the IMPOSTER!</h4>
                    <p>Your goal is to avoid detection and guess the secret word if caught.</p>
                    <div className="imposter-instructions">
                      <h5>Instructions:</h5>
                      <ul>
                        <li>Give vague clues that don't reveal you don't know the word</li>
                        <li>Try to blend in with other players</li>
                        <li>If voted out, you'll get one chance to guess the secret word</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="crew-role">
                    <div className="role-icon crew-icon">👥</div>
                    <h4>You are CREW!</h4>
                    <p>Your goal is to find the imposter and protect the secret word.</p>
                    <div className="secret-word-reveal">
                      <h5>The secret word is:</h5>
                      <div className="secret-word-display">
                        <span className="secret-word">{gameState.secretWord}</span>
                      </div>
                    </div>
                    <div className="crew-instructions">
                      <h5>Instructions:</h5>
                      <ul>
                        <li>Give clues related to the secret word</li>
                        <li>Look for players giving vague or unrelated clues</li>
                        <li>Vote for who you think is the imposter</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {showRole && (
            <div className="role-actions">
              <button onClick={handleNextPlayer} className="next-player-btn">
                {isLastPlayer ? 'Start Game' : 'Next Player'}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentPlayerIndex + 1) / gameState.players.length) * 100}%` }}
            />
          </div>
          <p>Progress: {currentPlayerIndex + 1} / {gameState.players.length} players</p>
        </div>

        <div className="skip-section">
          <button onClick={handleSkipToGame} className="skip-btn">
            Skip Role Reveal & Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
