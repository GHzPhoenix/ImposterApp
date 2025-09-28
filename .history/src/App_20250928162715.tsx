import { useState } from "react";
import { Zap, RotateCcw, Globe, Users } from "lucide-react";
import { useGame } from "./hooks/useGame";
import { useRoom } from "./hooks/useRoom";
import { GameSetup } from "./components/GameSetup";
import { RoomLobby } from "./components/RoomLobby";
import { RoomWaiting } from "./components/RoomWaiting";
import { RoleReveal } from "./components/RoleReveal";
import { Gameplay } from "./components/Gameplay";
import "./App.css";

function App() {
  const {
    gameState,
    settings,
    setSettings,
    createGame,
    addClue,
    addVote,
    nextRound,
    startGameplay,
    startVoting,
    setImposterGuess,
    resetGame,
  } = useGame();

  const {
    currentRoom,
    currentPlayerId,
    isHost,
    createRoom,
    joinRoom,
    startGame,
    addClue: addRoomClue,
    addVote: addRoomVote,
    leaveRoom,
  } = useRoom();

  const [gameMode, setGameMode] = useState<'local' | 'online'>('local');
  const [localCurrentPlayerId, setLocalCurrentPlayerId] = useState<string>("");

  const handleStartLocalGame = (playerNames: string[], secretWord?: string) => {
    const game = createGame(playerNames, secretWord);
    if (game) {
      // For demo purposes, set the first player as current
      // In a real app, this would be handled by user selection or authentication
      setLocalCurrentPlayerId(game.players[0].id);
    }
  };

  const handleRestartGame = () => {
    resetGame();
    setLocalCurrentPlayerId("");
  };

  const handleCreateRoom = (hostName: string, roomSettings: any) => {
    createRoom(hostName, roomSettings);
  };

  const handleJoinRoom = (roomCode: string, playerName: string) => {
    joinRoom(roomCode, playerName);
  };

  const handleStartRoomGame = (secretWord?: string) => {
    startGame(secretWord);
  };

  const handleLeaveRoom = () => {
    leaveRoom();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <Zap className="logo-icon" size={32} />
            <h1>🎭 Imposter Game</h1>
          </div>
          {gameState && (
            <nav className="nav">
              <button onClick={handleRestartGame} className="nav-button">
                <RotateCcw size={20} />
                New Game
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="main">
        {!gameState ? (
          <GameSetup
            onStartGame={handleStartGame}
            settings={settings}
            onSettingsChange={setSettings}
          />
        ) : gameState.status === 'role-reveal' ? (
          <RoleReveal
            gameState={gameState}
            onStartGame={startGameplay}
          />
        ) : (
          <Gameplay
            gameState={gameState}
            currentPlayerId={currentPlayerId}
            onAddClue={addClue}
            onAddVote={addVote}
            onStartVoting={startVoting}
            onNextRound={nextRound}
            onSetImposterGuess={setImposterGuess}
          />
        )}
      </main>
    </div>
  );
}

export default App;
