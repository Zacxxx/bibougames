import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface Alien {
  x: number;
  y: number;
  type: 'grunt' | 'elite' | 'boss';
  state: 'formation' | 'attacking' | 'returning';
  rotation: number;
}

interface PlayerShip {
  x: number;
  lives: number;
}

interface Bullet {
  x: number;
  y: number;
  isPlayerBullet: boolean;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

interface Explosion {
  x: number;
  y: number;
  size: number;
  duration: number;
}

const ALIEN_SIZE = 40;
const PLAYER_SIZE = 50;
const BULLET_SIZE = 10;
const ALIEN_ROWS = 5;
const ALIENS_PER_ROW = 8;
const FORMATION_TOP = 80;
const FORMATION_SPACING = 60;
const STAR_COUNT = 150;
const INITIAL_LIVES = 3;

const GalaxianBackground: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [playerShip, setPlayerShip] = useState<PlayerShip>({ x: dimensions.width / 2, lives: INITIAL_LIVES });
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const initializeAliens = useCallback(() => {
    const newAliens: Alien[] = [];
    for (let row = 0; row < ALIEN_ROWS; row++) {
      for (let col = 0; col < ALIENS_PER_ROW; col++) {
        newAliens.push({
          x: col * FORMATION_SPACING + (dimensions.width - ALIENS_PER_ROW * FORMATION_SPACING) / 2,
          y: row * FORMATION_SPACING + FORMATION_TOP,
          type: row === 0 ? 'boss' : row <= 2 ? 'elite' : 'grunt',
          state: 'formation',
          rotation: 0,
        });
      }
    }
    setAliens(newAliens);
  }, [dimensions.width]);

  const initializeStars = useCallback(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      newStars.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }
    setStars(newStars);
  }, [dimensions]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    initializeAliens();
    initializeStars();
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeAliens, initializeStars]);

  const moveAliens = useCallback(() => {
    setAliens(prevAliens => prevAliens.map(alien => {
      let newX = alien.x, newY = alien.y, newState = alien.state, newRotation = alien.rotation;
      if (alien.state === 'formation') {
        newX += Math.sin(Date.now() / 1000) * 2;
        newRotation = Math.sin(Date.now() / 500) * 15;
      } else if (alien.state === 'attacking') {
        const targetX = playerShip.x;
        const targetY = dimensions.height - PLAYER_SIZE;
        const dx = targetX - alien.x;
        const dy = targetY - alien.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        newX += (dx / distance) * 5;
        newY += (dy / distance) * 5;
        newRotation += 10;
        newState = newY > dimensions.height ? 'returning' : 'attacking';
      } else { // returning
        const formationX = (alien.x % FORMATION_SPACING) + Math.floor(alien.x / FORMATION_SPACING) * FORMATION_SPACING;
        const formationY = Math.floor(alien.x / ALIENS_PER_ROW) * FORMATION_SPACING + FORMATION_TOP;
        const dx = formationX - alien.x;
        const dy = formationY - alien.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        newX += (dx / distance) * 3;
        newY += (dy / distance) * 3;
        newRotation -= 5;
        newState = distance < 5 ? 'formation' : 'returning';
      }
      return { ...alien, x: newX, y: newY, state: newState, rotation: newRotation };
    }));
  }, [dimensions.height, playerShip.x]);

  const movePlayerShip = useCallback(() => {
    setPlayerShip(prev => ({
      ...prev,
      x: dimensions.width / 2 + Math.sin(Date.now() / 2000) * (dimensions.width / 3)
    }));
  }, [dimensions.width]);

  const updateBullets = useCallback(() => {
    setBullets(prevBullets => {
      const updatedBullets = prevBullets
        .map(bullet => ({
          ...bullet,
          y: bullet.isPlayerBullet ? bullet.y - 15 : bullet.y + 8
        }))
        .filter(bullet => bullet.y > 0 && bullet.y < dimensions.height);

      if (Math.random() < 0.1) {
        const shootingAlien = aliens[Math.floor(Math.random() * aliens.length)];
        updatedBullets.push({
          x: shootingAlien.x,
          y: shootingAlien.y,
          isPlayerBullet: false
        });
      }

      if (Math.random() < 0.2) {
        updatedBullets.push({
          x: playerShip.x,
          y: dimensions.height - PLAYER_SIZE,
          isPlayerBullet: true
        });
      }

      return updatedBullets;
    });
  }, [aliens, dimensions.height, playerShip.x]);

  const updateStars = useCallback(() => {
    setStars(prevStars => prevStars.map(star => ({
      ...star,
      y: (star.y + star.size * 0.5) % dimensions.height,
      opacity: Math.sin(Date.now() / 1000 + star.x) * 0.3 + 0.7
    })));
  }, [dimensions.height]);

  const checkCollisions = useCallback(() => {
    setBullets(prevBullets => {
      const remainingBullets = [...prevBullets];
      setAliens(prevAliens => {
        const remainingAliens = prevAliens.filter(alien => {
          const hitByBullet = remainingBullets.findIndex(bullet =>
            bullet.isPlayerBullet &&
            Math.abs(bullet.x - alien.x) < ALIEN_SIZE / 2 &&
            Math.abs(bullet.y - alien.y) < ALIEN_SIZE / 2
          );
          if (hitByBullet !== -1) {
            remainingBullets.splice(hitByBullet, 1);
            setExplosions(prev => [...prev, { x: alien.x, y: alien.y, size: ALIEN_SIZE, duration: 20 }]);
            return false;
          }
          return true;
        });
        return remainingAliens;
      });

      setPlayerShip(prev => {
        const hitByBullet = remainingBullets.findIndex(bullet =>
          !bullet.isPlayerBullet &&
          Math.abs(bullet.x - prev.x) < PLAYER_SIZE / 2 &&
          Math.abs(bullet.y - (dimensions.height - PLAYER_SIZE / 2)) < PLAYER_SIZE / 2
        );
        if (hitByBullet !== -1) {
          remainingBullets.splice(hitByBullet, 1);
          setExplosions(prevExplosions => [...prevExplosions, { x: prev.x, y: dimensions.height - PLAYER_SIZE / 2, size: PLAYER_SIZE, duration: 30 }]);
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            setGameOver(true);
          }
          return { ...prev, lives: newLives };
        }
        return prev;
      });

      return remainingBullets;
    });
  }, [dimensions.height]);

  const updateExplosions = useCallback(() => {
    setExplosions(prevExplosions =>
      prevExplosions
        .map(explosion => ({ ...explosion, duration: explosion.duration - 1 }))
        .filter(explosion => explosion.duration > 0)
    );
  }, []);

  const gameLoop = useCallback(() => {
    if (gameOver) return;

    moveAliens();
    movePlayerShip();
    updateBullets();
    updateStars();
    checkCollisions();
    updateExplosions();

    if (Math.random() < 0.02) {
      setAliens(prevAliens => {
        const formationAliens = prevAliens.filter(a => a.state === 'formation');
        if (formationAliens.length > 0) {
          const attackingAlienIndex = Math.floor(Math.random() * formationAliens.length);
          const newAliens = [...prevAliens];
          newAliens[attackingAlienIndex] = { ...newAliens[attackingAlienIndex], state: 'attacking' };
          return newAliens;
        }
        return prevAliens;
      });
    }
  }, [moveAliens, movePlayerShip, updateBullets, updateStars, checkCollisions, updateExplosions, gameOver]);

  useEffect(() => {
    const interval = setInterval(gameLoop, 50);
    return () => clearInterval(interval);
  }, [gameLoop]);

  const alienSvg = useMemo(() => ({
    boss: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="50,10 10,90 90,90" fill="#FF4136" stroke="#85144b" strokeWidth="5"/>
        <circle cx="50" cy="50" r="20" fill="#7FDBFF"/>
        <rect x="40" y="70" width="20" height="10" fill="#2ECC40"/>
      </svg>
    ),
    elite: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="50" rx="40" ry="30" fill="#0074D9" stroke="#001f3f" strokeWidth="5"/>
        <circle cx="35" cy="40" r="10" fill="#FFDC00"/>
        <circle cx="65" cy="40" r="10" fill="#FFDC00"/>
        <path d="M30 70 Q50 80 70 70" fill="none" stroke="#AAAAAA" strokeWidth="5"/>
      </svg>
    ),
    grunt: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="20" y="20" width="60" height="60" rx="15" fill="#3D9970" stroke="#2ECC40" strokeWidth="5"/>
        <circle cx="35" cy="40" r="8" fill="#01FF70"/>
        <circle cx="65" cy="40" r="8" fill="#01FF70"/>
        <rect x="35" y="65" width="30" height="5" fill="#01FF70"/>
      </svg>
    )
  }), []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-900 via-indigo-900 to-black overflow-hidden">
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px ${star.size}px rgba(255, 255, 255, 0.7)`,
          }}
        />
      ))}
      {aliens.map((alien, index) => (
        <div
          key={index}
          className="absolute transition-all duration-100 ease-in-out"
          style={{
            left: `${alien.x}px`,
            top: `${alien.y}px`,
            width: `${ALIEN_SIZE}px`,
            height: `${ALIEN_SIZE}px`,
            transform: `rotate(${alien.rotation}deg)`,
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))',
          }}
        >
          {alienSvg[alien.type]}
        </div>
      ))}
      <div
        className="absolute"
        style={{
          left: `${playerShip.x - PLAYER_SIZE / 2}px`,
          bottom: '20px',
          width: `${PLAYER_SIZE}px`,
          height: `${PLAYER_SIZE}px`,
          filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.7))',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,10 20,90 80,90" fill="#F012BE" stroke="#B10DC9" strokeWidth="5"/>
          <circle cx="50" cy="60" r="15" fill="#7FDBFF"/>
        </svg>
      </div>
      {bullets.map((bullet, index) => (
        <div
          key={index}
          className={`absolute rounded-full ${bullet.isPlayerBullet ? 'bg-blue-400' : 'bg-red-400'}`}
          style={{
            left: `${bullet.x}px`,
            top: `${bullet.y}px`,
            width: `${BULLET_SIZE}px`,
            height: `${BULLET_SIZE}px`,
            boxShadow: `0 0 10px 5px ${bullet.isPlayerBullet ? 'rgba(0, 255, 255, 0.7)' : 'rgba(255, 0, 0, 0.7)'}`,
          }}
        />
      ))}
       {explosions.map((explosion, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-yellow-500 opacity-50"
          style={{
            left: `${explosion.x - explosion.size / 2}px`,
            top: `${explosion.y - explosion.size / 2}px`,
            width: `${explosion.size * (1 + (30 - explosion.duration) / 15)}px`,
            height: `${explosion.size * (1 + (30 - explosion.duration) / 15)}px`,
            transform: `scale(${1 + (30 - explosion.duration) / 30})`,
            opacity: explosion.duration / 30,
          }}
        />
      ))}
      <div className="absolute top-4 left-4 flex space-x-2">
        {[...Array(playerShip.lives)].map((_, index) => (
          <div
            key={index}
            className="w-8 h-8"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,10 20,90 80,90" fill="#F012BE" stroke="#B10DC9" strokeWidth="5"/>
            </svg>
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-red-500 mb-4">Game Over</h2>
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => {
                setGameOver(false);
                setPlayerShip({ x: dimensions.width / 2, lives: INITIAL_LIVES });
                initializeAliens();
              }}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalaxianBackground;