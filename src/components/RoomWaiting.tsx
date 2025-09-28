import { useState } from "react";
import {
  Users,
  Copy,
  Check,
  Play,
  Settings,
  Hash,
  UserPlus,
} from "lucide-react";
import type { Room } from "../types/room";

interface RoomWaitingProps {
  room: Room;
  currentPlayerId: string;
  isHost: boolean;
  onStartGame: (secretWord?: string) => void;
  onLeaveRoom: () => void;
}

export function RoomWaiting({
  room,
  currentPlayerId,
  isHost,
  onStartGame,
  onLeaveRoom,
}: RoomWaitingProps) {
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customWord, setCustomWord] = useState("");

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    onStartGame(customWord.trim() || undefined);
  };

  const canStartGame = room.players.length >= room.settings.minPlayers;

  return (
    <div className="room-waiting">
      <div className="waiting-header">
        <div className="room-info">
          <h2>🎭 Room: {room.code}</h2>
          <p>Waiting for players to join...</p>
        </div>

        <div className="room-actions">
          <button onClick={onLeaveRoom} className="leave-btn">
            Leave Room
          </button>
        </div>
      </div>

      <div className="room-code-section">
        <div className="code-display">
          <Hash size={24} />
          <span className="room-code">{room.code}</span>
          <button
            onClick={copyRoomCode}
            className={`copy-code-btn ${copied ? "copied" : ""}`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="share-text">
          Share this code with friends to join your game!
        </p>
      </div>

      <div className="players-section">
        <div className="players-header">
          <h3>
            Players ({room.players.length}/{room.settings.maxPlayers})
          </h3>
          <div className="player-count">
            <Users size={20} />
            {room.players.length} / {room.settings.maxPlayers}
          </div>
        </div>

        <div className="players-list">
          {room.players.map((player) => (
            <div
              key={player.id}
              className={`player-item ${
                player.id === currentPlayerId ? "current-player" : ""
              } ${player.isHost ? "host" : ""}`}
            >
              <div className="player-info">
                <div className="player-avatar">
                  {player.isHost ? "👑" : "👤"}
                </div>
                <div className="player-details">
                  <span className="player-name">{player.name}</span>
                  {player.isHost && <span className="host-badge">Host</span>}
                  {player.id === currentPlayerId && (
                    <span className="you-badge">You</span>
                  )}
                </div>
              </div>
              <div className="player-status">
                {player.isConnected ? (
                  <div className="status-connected">🟢</div>
                ) : (
                  <div className="status-disconnected">🔴</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {room.players.length < room.settings.maxPlayers && (
          <div className="waiting-for-players">
            <UserPlus size={24} />
            <p>Waiting for more players to join...</p>
          </div>
        )}
      </div>

      {isHost && (
        <div className="host-controls">
          <div className="game-settings">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="settings-btn"
            >
              <Settings size={16} />
              Game Settings
            </button>

            {showSettings && (
              <div className="settings-panel">
                <div className="setting-item">
                  <label>Secret Word (Optional):</label>
                  <input
                    type="text"
                    placeholder="Leave empty for random word..."
                    value={customWord}
                    onChange={(e) => setCustomWord(e.target.value)}
                    className="word-input"
                  />
                </div>
                <div className="setting-info">
                  <p>• Leave empty to generate a random word</p>
                  <p>• Or enter a custom word for this game</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleStartGame}
            disabled={!canStartGame}
            className="start-game-btn"
          >
            <Play size={20} />
            Start Game
            {!canStartGame && (
              <span className="min-players">
                (Need {room.settings.minPlayers} players)
              </span>
            )}
          </button>
        </div>
      )}

      {!isHost && (
        <div className="waiting-message">
          <p>Waiting for the host to start the game...</p>
          <div className="waiting-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      <div className="game-info">
        <div className="info-card">
          <h4>📋 Game Rules</h4>
          <ul>
            <li>Each player gets a role: Crew or Imposter</li>
            <li>Crew members know the secret word</li>
            <li>Imposters must blend in and avoid detection</li>
            <li>Players give clues related to the secret word</li>
            <li>Vote out suspected imposters</li>
            <li>Crew wins if all imposters are found</li>
            <li>Imposters win if they avoid detection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
