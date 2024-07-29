// src/utils/gameLoader.ts

import { lazy } from 'react';

export interface Game {
  id: string;
  name: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
}

// Cette fonction va charger dynamiquement tous les jeux du dossier /src/games
export function loadGames(): Game[] {
  const gameModules = import.meta.glob('/src/games/*.tsx');

  return Object.entries(gameModules).map(([path, importFunc]) => {
    const gameName = path.split('/').pop()?.replace('.tsx', '') || '';
    return {
      id: gameName.toLowerCase(),
      name: gameName.replace(/([A-Z])/g, ' $1').trim(), // Ajoute des espaces avant les majuscules
      component: lazy(importFunc as any),
    };
  });
}