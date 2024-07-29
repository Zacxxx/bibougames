import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Food extends Position {
  type: 'normal' | 'speed' | 'grow' | 'shrink';
}

interface Enemy extends Position {
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
}

interface Consumable extends Position {
  type: 'shield' | 'clear' | 'slow';
}

const GRID_SIZE = 20;
const SNAKE_SPEED = 100; // ms
const WIN_LENGTH = 30;
const FOOD_SPAWN_INTERVAL = 10000; // 10 seconds
const MAX_ENEMIES = 5;
const MAX_CONSUMABLES = 3;

const AutoSnake: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Food[]>([]);
  const [obstacles, setObstacles] = useState<Position[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [speedBoost, setSpeedBoost] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);

  const gridWidth = useMemo(() => Math.floor(dimensions.width / GRID_SIZE), [dimensions.width]);
  const gridHeight = useMemo(() => Math.floor(dimensions.height / GRID_SIZE), [dimensions.height]);

  const getRandomPosition = useCallback((): Position => ({
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight),
  }), [gridWidth, gridHeight]);

  const spawnFood = useCallback(() => {
    const newFood: Food = {
      ...getRandomPosition(),
      type: ['normal', 'speed', 'grow', 'shrink'][Math.floor(Math.random() * 4)] as Food['type']
    };
    setFood(prevFood => [...prevFood, newFood]);
  }, [getRandomPosition]);

  const resetGame = useCallback(() => {
    const initialSnake = [getRandomPosition()];
    setSnake(initialSnake);
    setFood([]);
    setObstacles(Array.from({ length: 5 }, () => getRandomPosition()));
    setEnemies([]);
    setConsumables([]);
    setGameWon(false);
    setScore(0);
    setSpeedBoost(0);
    setShieldActive(false);

    for (let i = 0; i < 3; i++) {
      spawnFood();
    }
  }, [getRandomPosition, spawnFood]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      resetGame();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resetGame]);

  useEffect(() => {
    const foodSpawnInterval = setInterval(spawnFood, FOOD_SPAWN_INTERVAL);
    return () => clearInterval(foodSpawnInterval);
  }, [spawnFood]);

  const isValidMove = useCallback((pos: Position): boolean => {
    return !obstacles.some(obs => obs.x === pos.x && obs.y === pos.y) &&
           !snake.some(segment => segment.x === pos.x && segment.y === pos.y);
  }, [obstacles, snake]);

  const getNeighbors = useCallback((pos: Position): Position[] => {
    const neighbors: Position[] = [
      { x: (pos.x - 1 + gridWidth) % gridWidth, y: pos.y },
      { x: (pos.x + 1) % gridWidth, y: pos.y },
      { x: pos.x, y: (pos.y - 1 + gridHeight) % gridHeight },
      { x: pos.x, y: (pos.y + 1) % gridHeight },
    ];
    return neighbors.filter(isValidMove);
  }, [gridWidth, gridHeight, isValidMove]);

  const findPath = useCallback((start: Position, goal: Position): Position[] | null => {
    const queue: { pos: Position; path: Position[] }[] = [{ pos: start, path: [] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { pos, path } = queue.shift()!;
      const posKey = `${pos.x},${pos.y}`;

      if (pos.x === goal.x && pos.y === goal.y) {
        return path;
      }

      if (!visited.has(posKey)) {
        visited.add(posKey);
        const neighbors = getNeighbors(pos);
        for (const neighbor of neighbors) {
          queue.push({ pos: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return null;
  }, [getNeighbors]);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      let path: Position[] | null = null;
      let nearestFood: Food | null = null;

      for (const f of food) {
        const currentPath = findPath(head, f);
        if (currentPath && (!path || currentPath.length < path.length)) {
          path = currentPath;
          nearestFood = f;
        }
      }

      if (!path || path.length === 0) {
        const validMoves = getNeighbors(head);
        if (validMoves.length === 0) return prevSnake;
        path = [validMoves[Math.floor(Math.random() * validMoves.length)]];
      }

      const newHead = path[0];
      const newSnake = [newHead, ...prevSnake];

      if (nearestFood && newHead.x === nearestFood.x && newHead.y === nearestFood.y) {
        setFood(prevFood => prevFood.filter(f => f !== nearestFood));
        setScore(prevScore => prevScore + 1);

        switch (nearestFood.type) {
          case 'speed':
            setSpeedBoost(prevBoost => Math.min(prevBoost + 1, 5));
            break;
          case 'grow':
            break;
          case 'shrink':
            if (newSnake.length > 1) newSnake.pop();
            break;
          default:
            newSnake.pop();
        }

        if (newSnake.length >= WIN_LENGTH && Math.random() < 0.1) {
          setGameWon(true);
        }
      } else {
        newSnake.pop();
      }

      const consumableIndex = consumables.findIndex(c => c.x === newHead.x && c.y === newHead.y);
      if (consumableIndex !== -1) {
        const consumable = consumables[consumableIndex];
        setConsumables(prev => prev.filter((_, i) => i !== consumableIndex));
        switch (consumable.type) {
          case 'shield':
            setShieldActive(true);
            setTimeout(() => setShieldActive(false), 5000);
            break;
          case 'clear':
            setObstacles([]);
            setEnemies([]);
            break;
          case 'slow':
            setSpeedBoost(0);
            break;
        }
      }

      return newSnake;
    });
  }, [findPath, food, getNeighbors, consumables]);

  const moveEnemies = useCallback(() => {
    setEnemies(prevEnemies => prevEnemies.map(enemy => {
      const newPos = { ...enemy };
      switch (enemy.direction) {
        case 'UP': newPos.y = (newPos.y - 1 + gridHeight) % gridHeight; break;
        case 'DOWN': newPos.y = (newPos.y + 1) % gridHeight; break;
        case 'LEFT': newPos.x = (newPos.x - 1 + gridWidth) % gridWidth; break;
        case 'RIGHT': newPos.x = (newPos.x + 1) % gridWidth; break;
      }
      if (Math.random() < 0.1) {
        newPos.direction = ['UP', 'DOWN', 'LEFT', 'RIGHT'][Math.floor(Math.random() * 4)] as 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
      }
      return newPos;
    }));
  }, [gridWidth, gridHeight]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      moveSnake();
      moveEnemies();
    }, Math.max(SNAKE_SPEED - speedBoost * 10, 50));
    return () => clearInterval(gameLoop);
  }, [moveSnake, moveEnemies, speedBoost]);

  useEffect(() => {
    const spawnLoop = setInterval(() => {
      if (Math.random() < 0.1 && enemies.length < MAX_ENEMIES) {
        setEnemies(prev => [...prev, {
          ...getRandomPosition(),
          direction: ['UP', 'DOWN', 'LEFT', 'RIGHT'][Math.floor(Math.random() * 4)] as 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
        }]);
      }
      if (Math.random() < 0.05 && consumables.length < MAX_CONSUMABLES) {
        setConsumables(prev => [...prev, {
          ...getRandomPosition(),
          type: ['shield', 'clear', 'slow'][Math.floor(Math.random() * 3)] as 'shield' | 'clear' | 'slow'
        }]);
      }
    }, 2000);
    return () => clearInterval(spawnLoop);
  }, [getRandomPosition, enemies.length, consumables.length]);

  useEffect(() => {
    if (gameWon) {
      const timer = setTimeout(resetGame, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameWon, resetGame]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const clickX = Math.floor(e.clientX / GRID_SIZE);
    const clickY = Math.floor(e.clientY / GRID_SIZE);

    setObstacles(prevObstacles => {
      const existingIndex = prevObstacles.findIndex(obs => obs.x === clickX && obs.y === clickY);
      if (existingIndex !== -1) {
        const newObstacles = [...prevObstacles];
        newObstacles.splice(existingIndex, 1);
        return newObstacles;
      } else {
        return [...prevObstacles, { x: clickX, y: clickY }];
      }
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-100" onClick={handleClick}>
      {snake.map((segment, index) => (
        <div
          key={index}
          className="absolute rounded-full transition-all duration-100 ease-in-out"
          style={{
            left: `${segment.x * GRID_SIZE}px`,
            top: `${segment.y * GRID_SIZE}px`,
            width: `${GRID_SIZE}px`,
            height: `${GRID_SIZE}px`,
            backgroundColor: gameWon
              ? `hsl(${index * 10}, 70%, 50%)`
              : `hsl(200, ${70 + index * 2}%, ${50 + index}%)`,
            boxShadow: shieldActive ? '0 0 10px 5px rgba(0,255,255,0.5)' : '0 0 5px rgba(0,0,0,0.3)',
            zIndex: 1000 - index,
          }}
        />
      ))}
      {food.map((f, index) => (
        <div
          key={index}
          className="absolute rounded-full transition-all duration-150 ease-in-out"
          style={{
            left: `${f.x * GRID_SIZE}px`,
            top: `${f.y * GRID_SIZE}px`,
            width: `${GRID_SIZE}px`,
            height: `${GRID_SIZE}px`,
            backgroundColor: f.type === 'normal' ? 'red' : f.type === 'speed' ? 'yellow' : f.type === 'grow' ? 'green' : 'purple',
            boxShadow: '0 0 8px rgba(0,0,0,0.5)',
            zIndex: 1001,
          }}
        />
      ))}
      {obstacles.map((obs, index) => (
        <div
          key={index}
          className="absolute rounded-sm transition-all duration-150 ease-in-out"
          style={{
            left: `${obs.x * GRID_SIZE}px`,
            top: `${obs.y * GRID_SIZE}px`,
            width: `${GRID_SIZE}px`,
            height: `${GRID_SIZE}px`,
            backgroundColor: 'rgba(0,0,0,0.7)',
            boxShadow: '0 0 3px rgba(0,0,0,0.3)',
            zIndex: 999,
          }}
        />
      ))}
      {enemies.map((enemy, index) => (
        <div
          key={index}
          className="absolute rounded-full transition-all duration-150 ease-in-out"
          style={{
            left: `${enemy.x * GRID_SIZE}px`,
            top: `${enemy.y * GRID_SIZE}px`,
            width: `${GRID_SIZE}px`,
            height: `${GRID_SIZE}px`,
            backgroundColor: 'red',
            boxShadow: '0 0 8px rgba(255,0,0,0.5)',
            zIndex: 1002,
          }}
        />
      ))}
      {consumables.map((consumable, index) => (
        <div
          key={index}
          className="absolute rounded-full transition-all duration-150 ease-in-out"
          style={{
            left: `${consumable.x * GRID_SIZE}px`,
            top: `${consumable.y * GRID_SIZE}px`,
            width: `${GRID_SIZE}px`,
            height: `${GRID_SIZE}px`,
            backgroundColor: consumable.type === 'shield' ? 'cyan' : consumable.type === 'clear' ? 'white' : 'orange',
            boxShadow: '0 0 8px rgba(0,255,255,0.5)',
            zIndex: 1003,
          }}
        />
      ))}
      <div className="absolute top-4 left-4 text-2xl font-bold text-black">
        Score: {score}
      </div>
      {gameWon && (
           <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white bg-black bg-opacity-50 z-1004">
          Snake Wins!
        </div>
      )}
      <div className="absolute top-4 right-4 flex flex-col items-end">
        <div className="text-xl font-semibold text-black mb-2">
          Speed: {speedBoost}
        </div>
        <div className="text-xl font-semibold text-black">
          {shieldActive ? 'Shield Active!' : 'No Shield'}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 text-lg text-black">
        <div>Click to add/remove obstacles</div>
        <div>Food types:</div>
        <div className="flex items-center mt-1">
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <span>Normal</span>
        </div>
        <div className="flex items-center mt-1">
          <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
          <span>Speed Boost</span>
        </div>
        <div className="flex items-center mt-1">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span>Grow</span>
        </div>
        <div className="flex items-center mt-1">
          <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
          <span>Shrink</span>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 text-lg text-black">
        <div>Consumables:</div>
        <div className="flex items-center mt-1">
          <div className="w-4 h-4 rounded-full bg-cyan-500 mr-2"></div>
          <span>Shield</span>
        </div>
        <div className="flex items-center mt-1">
          <div className="w-4 h-4 rounded-full bg-white border border-gray-300 mr-2"></div>
          <span>Clear Obstacles</span>
        </div>
        <div className="flex items-center mt-1">
          <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
          <span>Slow Down</span>
        </div>
      </div>
    </div>
  );
};

export default AutoSnake;