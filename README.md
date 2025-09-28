# 🎭 Imposter Game

A modern, feature-rich implementation of the popular Imposter game with both local and online multiplayer support. Built with React, TypeScript, and Vite for a smooth, responsive gaming experience.

![Imposter Game](https://img.shields.io/badge/Game-Imposter%20Game-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.0-purple)

## 🎮 Game Overview

The Imposter Game is a social deduction game where players must identify the "imposter" among them. Crew members know a secret word and give clues related to it, while imposters must blend in without knowing the word.

### 🎯 How to Play

1. **Setup**: Add players and choose a secret word
2. **Role Assignment**: Each player gets a role (Crew or Imposter)
3. **Clue Phase**: Players give clues related to the secret word
4. **Voting**: Players vote on who they think is the imposter
5. **Results**: Crew wins if imposters are found, Imposters win if they avoid detection

## ✨ Features

### 🎭 Core Game Features
- **Smart Imposter Distribution**: Multiple imposters for larger groups
  - 3-4 players: 1 Imposter
  - 5-6 players: 1 Imposter
  - 7-8 players: 2 Imposters
  - 9-10 players: 2 Imposters
  - 11-12 players: 3 Imposters
  - 13+ players: 1 per 4 players

- **Individual Role Reveal**: Each player sees their role privately
- **Secret Word Management**: Crew members see the word, imposters don't
- **Dynamic Win Conditions**: Balanced gameplay for any group size

### 🌐 Online Multiplayer
- **Room System**: Create/join games with 6-character codes
- **Real-time Updates**: Live player list and game state
- **Host Controls**: Game settings, custom words, player management
- **Connection Status**: See who's online/offline

### 🎨 Modern UI/UX
- **Dual Game Modes**: Local (pass device) and Online (remote play)
- **Beautiful Design**: Glassmorphism effects and smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Accessibility**: Keyboard navigation and screen reader support

### 🛠 Technical Features
- **TypeScript**: Full type safety and better development experience
- **Modern React**: Hooks, functional components, and best practices
- **Vite**: Lightning-fast development and builds
- **Lucide Icons**: Beautiful, consistent iconography
- **Mock Backend**: Ready for real WebSocket integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GHzPhoenix/ImposterApp.git
   cd ImposterApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🎮 Game Modes

### 🏠 Local Mode
Perfect for playing with friends in the same room:
- Add players manually
- Pass device between players
- Full control over game flow
- No internet required

### 🌐 Online Mode
Play with friends remotely:
- Create a room and share the code
- Friends join with the room code
- Real-time multiplayer experience
- Host controls game settings

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── GameSetup.tsx   # Local game setup
│   ├── Gameplay.tsx    # Main game interface
│   ├── RoleReveal.tsx  # Individual role viewing
│   ├── RoomLobby.tsx   # Online room creation/joining
│   └── RoomWaiting.tsx # Room management
├── hooks/              # Custom React hooks
│   ├── useGame.ts      # Local game state management
│   └── useRoom.ts      # Online multiplayer system
├── types/              # TypeScript definitions
│   ├── game.ts         # Game-related types
│   └── room.ts         # Room/multiplayer types
├── data/               # Game data
│   └── words.ts        # Word categories and data
├── App.tsx             # Main application component
├── App.css             # Global styles
└── main.tsx            # Application entry point
```

## 🎯 Game Rules

### For Crew Members
- You know the secret word
- Give clues related to the secret word
- Look for players giving vague or unrelated clues
- Vote for who you think is the imposter

### For Imposters
- You don't know the secret word
- Give vague clues that don't reveal your ignorance
- Try to blend in with other players
- If voted out, you get one chance to guess the secret word

### Win Conditions
- **Crew Wins**: All imposters are eliminated
- **Imposters Win**: Crew count ≤ remaining imposter count

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Tech Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons
- **CSS3** - Modern styling with animations

### Adding New Features

1. **New Components**: Add to `src/components/`
2. **Game Logic**: Extend `src/hooks/useGame.ts`
3. **Types**: Add to `src/types/`
4. **Styling**: Update `src/App.css`

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload `dist` folder to Netlify
3. Configure redirects for SPA routing

### Other Platforms
The built files in `dist` can be deployed to any static hosting service.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Ideas for Contributions
- Add more word categories
- Implement real WebSocket backend
- Add sound effects and music
- Create mobile app version
- Add game statistics and analytics
- Implement custom themes

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the popular Imposter game trend
- Built with modern web technologies
- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/GHzPhoenix/ImposterApp/issues) page
2. Create a new issue with detailed information
3. Join the discussion in [Discussions](https://github.com/GHzPhoenix/ImposterApp/discussions)

## 🎉 Have Fun!

Enjoy playing the Imposter Game with your friends! Whether you're playing locally or online, this game is sure to bring laughter and excitement to your group.

---

**Made with ❤️ by [GHzPhoenix](https://github.com/GHzPhoenix)**