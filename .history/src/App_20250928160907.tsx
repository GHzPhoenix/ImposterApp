import { useState } from "react";
import {
  Heart,
  Star,
  Settings,
  User,
  Search,
  Bell,
  Plus,
  ChevronRight,
  Zap,
  Shield,
  Code,
} from "lucide-react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <Zap className="logo-icon" size={32} />
            <h1>Impostor App</h1>
          </div>
          <nav className="nav">
            <button className="nav-button">
              <Search size={20} />
            </button>
            <button className="nav-button">
              <Bell size={20} />
            </button>
            <button className="nav-button">
              <User size={20} />
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="hero-section">
          <div className="hero-content">
            <h2>Welcome to Your Vite + React + TypeScript App</h2>
            <p>Built with modern tools and beautiful Lucide icons</p>

            <div className="features">
              <div className="feature-card">
                <Code className="feature-icon" size={24} />
                <h3>TypeScript</h3>
                <p>Type-safe development</p>
              </div>
              <div className="feature-card">
                <Zap className="feature-icon" size={24} />
                <h3>Vite</h3>
                <p>Lightning fast builds</p>
              </div>
              <div className="feature-card">
                <Shield className="feature-icon" size={24} />
                <h3>React</h3>
                <p>Powerful UI library</p>
              </div>
            </div>
          </div>
        </div>

        <div className="interactive-section">
          <div className="card">
            <h3>Interactive Demo</h3>
            <div className="counter-section">
              <button
                className="counter-button"
                onClick={() => setCount((count) => count + 1)}
              >
                <Plus size={20} />
                Count: {count}
              </button>
            </div>

            <div className="like-section">
              <button
                className={`like-button ${liked ? "liked" : ""}`}
                onClick={() => setLiked(!liked)}
              >
                <Heart size={20} fill={liked ? "currentColor" : "none"} />
                {liked ? "Liked!" : "Like this"}
              </button>
            </div>

            <div className="rating-section">
              <p>Rate this setup:</p>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className="star"
                    fill="currentColor"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-button">
                <Settings size={20} />
                Settings
                <ChevronRight size={16} />
              </button>
              <button className="action-button">
                <User size={20} />
                Profile
                <ChevronRight size={16} />
              </button>
              <button className="action-button">
                <Bell size={20} />
                Notifications
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
