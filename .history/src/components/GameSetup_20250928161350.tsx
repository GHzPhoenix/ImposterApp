import { useState } from 'react';
import { Users, Settings, Play, Shuffle, Eye, EyeOff } from 'lucide-react';
import { WORD_CATEGORIES, getRandomWord } from '../data/words';
import { GameSettings } from '../types/game';

interface GameSetupProps {
  onStartGame: (playerNames: string[], secretWord?: string) => void;
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
}

export function GameSetup({ onStartGame, settings, onSettingsChange }: GameSetupProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['']);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof WORD_CATEGORIES | 'random'>('random');
  const [customWord, setCustomWord] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showSecretWord, setShowSecretWord] = useState(false);
  const [secretWord, setSecretWord] = useState('');

  const addPlayer = () => {
    if (playerNames.length < settings.maxPlayers) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > settings.minPlayers) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const generateSecretWord = () => {
    const word = selectedCategory === 'random' 
      ? getRandomWord() 
      : getRandomWord(selectedCategory);
    setSecretWord(word);
    setShowSecretWord(true);
  };

  const handleStartGame = () => {
    const validNames = playerNames.filter(name => name.trim() !== '');
    if (validNames.length < settings.minPlayers) {
      alert(`Please add at least ${settings.minPlayers} players`);
      return;
    }

    const finalWord = customWord.trim() || secretWord;
    onStartGame(validNames, finalWord);
  };

  const canStart = playerNames.filter(name => name.trim() !== '').length >= settings.minPlayers;

  return (
    <div className="game-setup">
      <div className="setup-header">
        <h2>🎭 Imposter Game Setup</h2>
        <p>Find the imposter in your group!</p>
      </div>

      <div className="setup-content">
        {/* Players Section */}
        <div className="setup-section">
          <div className="section-header">
            <Users size={24} />
            <h3>Players ({playerNames.filter(name => name.trim() !== '').length})</h3>
          </div>
          
          <div className="players-list">
            {playerNames.map((name, index) => (
              <div key={index} className="player-input">
                <input
                  type="text"
                  placeholder={`Player ${index + 1}`}
                  value={name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  className="player-name-input"
                />
                {playerNames.length > settings.minPlayers && (
                  <button
                    onClick={() => removePlayer(index)}
                    className="remove-player-btn"
                    type="button"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {playerNames.length < settings.maxPlayers && (
            <button onClick={addPlayer} className="add-player-btn">
              <Users size={16} />
              Add Player
            </button>
          )}
        </div>

        {/* Word Selection Section */}
        <div className="setup-section">
          <div className="section-header">
            <Shuffle size={24} />
            <h3>Secret Word</h3>
          </div>

          <div className="word-options">
            <div className="category-selection">
              <label>Category:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value as keyof typeof WORD_CATEGORIES | 'random')}
                className="category-select"
              >
                <option value="random">Random</option>
                {Object.keys(WORD_CATEGORIES).map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="word-generation">
              <button onClick={generateSecretWord} className="generate-word-btn">
                <Shuffle size={16} />
                Generate Word
              </button>
              
              {showSecretWord && (
                <div className="secret-word-display">
                  <span className="secret-word-label">Secret Word:</span>
                  <span className="secret-word">{secretWord}</span>
                  <button
                    onClick={() => setShowSecretWord(!showSecretWord)}
                    className="toggle-visibility-btn"
                  >
                    {showSecretWord ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              )}
            </div>

            <div className="custom-word">
              <label>Or enter custom word:</label>
              <input
                type="text"
                placeholder="Enter your own word..."
                value={customWord}
                onChange={(e) => setCustomWord(e.target.value)}
                className="custom-word-input"
              />
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="setup-section">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="settings-toggle-btn"
          >
            <Settings size={20} />
            Game Settings
          </button>

          {showSettings && (
            <div className="settings-panel">
              <div className="setting-item">
                <label>Max Rounds:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.maxRounds}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    maxRounds: parseInt(e.target.value) || 3
                  })}
                  className="setting-input"
                />
              </div>

              <div className="setting-item">
                <label>Allow Imposter Guess:</label>
                <input
                  type="checkbox"
                  checked={settings.allowImposterGuess}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    allowImposterGuess: e.target.checked
                  })}
                  className="setting-checkbox"
                />
              </div>
            </div>
          )}
        </div>

        {/* Start Game Button */}
        <button
          onClick={handleStartGame}
          disabled={!canStart}
          className="start-game-btn"
        >
          <Play size={20} />
          Start Game
        </button>
      </div>
    </div>
  );
}
