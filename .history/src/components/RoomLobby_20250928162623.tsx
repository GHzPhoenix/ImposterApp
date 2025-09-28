import { useState } from 'react';
import { Users, Plus, Hash, Copy, Check, Settings, Play } from 'lucide-react';
import type { GameSettings } from '../types/room';

interface RoomLobbyProps {
  onCreateRoom: (hostName: string, settings: GameSettings) => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
}

export function RoomLobby({ onCreateRoom, onJoinRoom }: RoomLobbyProps) {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [hostName, setHostName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    maxRounds: 3,
    minPlayers: 3,
    maxPlayers: 10,
    allowImposterGuess: true,
  });
  const [copied, setCopied] = useState(false);

  const handleCreateRoom = () => {
    if (hostName.trim()) {
      onCreateRoom(hostName.trim(), settings);
    }
  };

  const handleJoinRoom = () => {
    if (playerName.trim() && roomCode.trim()) {
      onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="room-lobby">
      <div className="lobby-header">
        <h2>🎭 Online Imposter Game</h2>
        <p>Play with friends from anywhere!</p>
      </div>

      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === 'create' ? 'active' : ''}`}
          onClick={() => setMode('create')}
        >
          <Plus size={20} />
          Create Room
        </button>
        <button
          className={`mode-btn ${mode === 'join' ? 'active' : ''}`}
          onClick={() => setMode('join')}
        >
          <Hash size={20} />
          Join Room
        </button>
      </div>

      <div className="lobby-content">
        {mode === 'create' ? (
          <div className="create-room">
            <div className="input-section">
              <label>Your Name (Host)</label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="name-input"
                maxLength={20}
              />
            </div>

            <div className="settings-section">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="settings-toggle"
              >
                <Settings size={16} />
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
                      onChange={(e) => setSettings({
                        ...settings,
                        maxRounds: parseInt(e.target.value) || 3
                      })}
                      className="setting-input"
                    />
                  </div>

                  <div className="setting-item">
                    <label>Max Players:</label>
                    <input
                      type="number"
                      min="3"
                      max="20"
                      value={settings.maxPlayers}
                      onChange={(e) => setSettings({
                        ...settings,
                        maxPlayers: parseInt(e.target.value) || 10
                      })}
                      className="setting-input"
                    />
                  </div>

                  <div className="setting-item">
                    <label>Allow Imposter Guess:</label>
                    <input
                      type="checkbox"
                      checked={settings.allowImposterGuess}
                      onChange={(e) => setSettings({
                        ...settings,
                        allowImposterGuess: e.target.checked
                      })}
                      className="setting-checkbox"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={!hostName.trim()}
              className="create-btn"
            >
              <Play size={20} />
              Create Room
            </button>
          </div>
        ) : (
          <div className="join-room">
            <div className="input-section">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="name-input"
                maxLength={20}
              />
            </div>

            <div className="input-section">
              <label>Room Code</label>
              <div className="room-code-input">
                <input
                  type="text"
                  placeholder="Enter room code..."
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="code-input"
                  maxLength={6}
                />
                {roomCode && (
                  <button
                    onClick={copyRoomCode}
                    className="copy-btn"
                    title="Copy room code"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={!playerName.trim() || !roomCode.trim()}
              className="join-btn"
            >
              <Users size={20} />
              Join Room
            </button>
          </div>
        )}
      </div>

      <div className="lobby-info">
        <div className="info-card">
          <h4>🎮 How to Play</h4>
          <ul>
            <li>Create a room and share the code with friends</li>
            <li>Each player gets a role: Crew or Imposter</li>
            <li>Crew members know the secret word</li>
            <li>Imposters must blend in and avoid detection</li>
            <li>Vote out the imposters to win!</li>
          </ul>
        </div>

        <div className="info-card">
          <h4>👥 Player Counts</h4>
          <ul>
            <li>3-4 players: 1 Imposter</li>
            <li>5-6 players: 1 Imposter</li>
            <li>7-8 players: 2 Imposters</li>
            <li>9-10 players: 2 Imposters</li>
            <li>11-12 players: 3 Imposters</li>
            <li>13+ players: 1 per 4 players</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
