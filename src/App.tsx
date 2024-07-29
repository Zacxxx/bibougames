import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MenuBar from './components/MenuBar';
import ContentBlock from './components/ContentBlock';
import FloatingPanel from './components/FloatingPanel';
import AnimatedBackground from './components/AnimatedBackground';
import GamePanel from './components/panels/GamePanel';
import SettingsPanel from './components/panels/SettingsPanel';
import InfoPanel from './components/panels/InfoPanel';
import { loadGames, Game } from './utils/gameLoader';

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  useEffect(() => {
    const loadedGames = loadGames();
    console.log('Loaded games:', loadedGames);
    setGames(loadedGames);
  }, []);

  const handleOpenPanel = (panelName: string) => {
    console.log('Opening panel:', panelName);
    setActivePanel(panelName);
  };

  const handleClosePanel = () => {
    console.log('Closing panel');
    setActivePanel(null);
  };

  const handleSelectGame = (game: Game) => {
    console.log('Selected game:', game);
    setCurrentGame(game);
    setActivePanel(null);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <AnimatedBackground />
        <MenuBar onOpenPanel={handleOpenPanel} />
        <main className="flex-grow flex justify-center items-start p-4 sm:p-6 md:p-8">
          <ContentBlock>
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading game...</div>}>
              {currentGame ? (
                <div className="w-full h-full">
                  <currentGame.component />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  Sélectionnez un jeu pour commencer
                </div>
              )}
            </Suspense>
          </ContentBlock>
        </main>
        <FloatingPanel isOpen={activePanel !== null} onClose={handleClosePanel}>
          {activePanel === 'games' && (
            <GamePanel games={games} onSelectGame={handleSelectGame} />
          )}
          {activePanel === 'settings' && <SettingsPanel />}
          {activePanel === 'info' && <InfoPanel />}
        </FloatingPanel>
      </div>
    </Router>
  );
};

export default App;