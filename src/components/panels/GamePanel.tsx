import React from 'react';
import { Game } from '../../utils/gameLoader';

interface GamePanelProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

const GamePanel: React.FC<GamePanelProps> = ({ games, onSelectGame }) => {
  const handleGameSelect = (game: Game) => {
    console.log('Game selected in GamePanel:', game);
    onSelectGame(game);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Bibliothèque de jeux</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <li key={game.id} className="bg-white bg-opacity-50 rounded-lg p-4 hover:bg-opacity-80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <button onClick={() => handleGameSelect(game)} className="w-full text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{game.name}</h3>
              <p className="text-gray-600">Cliquez pour jouer</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GamePanel;