import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TortueRunEmojiDeluxe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [gameSpeed, setGameSpeed] = useState(1);
  const [weather, setWeather] = useState<'sunny' | 'rainy' | 'stormy'>('sunny');

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const { width, height } = canvas.getBoundingClientRect();
        setCanvasSize({ width, height });
        canvas.width = width;
        canvas.height = height;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Game objects
  const turtle = useRef({ x: 50, y: 0, width: 40, height: 40, jumpStrength: 15, yVelocity: 0, isJumping: false, isInvincible: false });
  const [obstacles, setObstacles] = useState<any[]>([]);
  const [bonuses, setBonuses] = useState<any[]>([]);
  const [decorations, setDecorations] = useState<any[]>([]);

  const emoji = {
    turtle: '🐢',
    turtleShell: '🛡️',
    tree: '🌴',
    rock: '🗿',
    crab: '🦀',
    fish: '🐠',
    octopus: '🐙',
    star: '⭐',
    rainbow: '🌈',
    cloud: '☁️',
    sun: '☀️',
    rain: '🌧️',
    lightning: '⚡',
    palmTree: '🌴',
    wave: '🌊',
    island: '🏝️',
    heart: '❤️',
  };

  const handleJump = useCallback(() => {
    if (!turtle.current.isJumping) {
      turtle.current.isJumping = true;
      turtle.current.yVelocity = -turtle.current.jumpStrength;
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      handleJump();
    }
  }, [handleJump]);

  const handleMouseDown = useCallback(() => {
    handleJump();
  }, [handleJump]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleKeyDown, handleMouseDown]);

  const updateGame = useCallback(() => {
    const { height } = canvasSize;
    const groundY = height - turtle.current.height - 10;

    // Update turtle
    if (turtle.current.isJumping) {
      turtle.current.y += turtle.current.yVelocity;
      turtle.current.yVelocity += 0.8;

      if (turtle.current.y > groundY) {
        turtle.current.y = groundY;
        turtle.current.isJumping = false;
        turtle.current.yVelocity = 0;
      }
    } else {
      turtle.current.y = groundY;
    }

    // Update game speed more gradually
    const newGameSpeed = 1 + Math.floor(score / 10000) * 0.1;
    setGameSpeed(newGameSpeed);

    // Update and filter obstacles
    setObstacles(prev => prev.filter(o => o.x > -o.width).map(o => ({ ...o, x: o.x - o.speed * gameSpeed })));

    // Update and filter bonuses
    setBonuses(prev => prev.filter(b => b.x > -b.width).map(b => ({ ...b, x: b.x - b.speed * gameSpeed })));

    // Update decorations
    setDecorations(prev => {
      const updated = prev.map(d => ({ ...d, x: d.x - 0.5 * gameSpeed }));
      if (updated.length < 5 && Math.random() < 0.01) {
        updated.push({
          emoji: [emoji.palmTree, emoji.island, emoji.wave][Math.floor(Math.random() * 3)],
          x: canvasSize.width,
          y: Math.random() * (groundY - 50),
        });
      }
      return updated.filter(d => d.x > -50);
    });

    // Spawn new obstacles with gradually increasing frequency
    const obstacleSpawnChance = 0.002 + (level * 0.0002);
    if (Math.random() < obstacleSpawnChance) {
      const obstacleTypes = [
        { type: 'tree', emoji: emoji.tree, width: 30, height: 60 },
        { type: 'rock', emoji: emoji.rock, width: 40, height: 40 },
        { type: 'crab', emoji: emoji.crab, width: 30, height: 30 },
        { type: 'fish', emoji: emoji.fish, width: 30, height: 30 },
        { type: 'octopus', emoji: emoji.octopus, width: 40, height: 40 },
      ];
      const newObstacle = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      setObstacles(prev => [...prev, { ...newObstacle, x: canvasSize.width, y: groundY - newObstacle.height + 10, speed: 0.5 + (level * 0.05) }]);
    }

    // Spawn new bonuses with gradually increasing frequency
    const bonusSpawnChance = 0.0005 + (level * 0.00005);
    if (Math.random() < bonusSpawnChance) {
      const bonusTypes = [
        { type: 'star', emoji: emoji.star, effect: 'score' },
        { type: 'rainbow', emoji: emoji.rainbow, effect: 'invincibility' },
      ];
      const newBonus = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
      setBonuses(prev => [...prev, { ...newBonus, x: canvasSize.width, y: Math.random() * (groundY - 50), width: 30, height: 30, speed: 0.5 + (level * 0.05) }]);
    }

    // Check collisions
    if (!turtle.current.isInvincible) {
      obstacles.forEach(obstacle => {
        if (
          turtle.current.x < obstacle.x + obstacle.width &&
          turtle.current.x + turtle.current.width > obstacle.x &&
          turtle.current.y < obstacle.y + obstacle.height &&
          turtle.current.y + turtle.current.height > obstacle.y
        ) {
          setGameState('gameOver');
        }
      });
    }

    // Check bonus collection
    setBonuses(prev => prev.filter(bonus => {
      if (
        turtle.current.x < bonus.x + bonus.width &&
        turtle.current.x + turtle.current.width > bonus.x &&
        turtle.current.y < bonus.y + bonus.height &&
        turtle.current.y + turtle.current.height > bonus.y
      ) {
        if (bonus.effect === 'score') {
          setScore(s => s + 50);
        } else if (bonus.effect === 'invincibility') {
          turtle.current.isInvincible = true;
          setTimeout(() => {
            turtle.current.isInvincible = false;
          }, 5000);
        }
        return false;
      }
      return true;
    }));

    // Update score
    setScore(s => s + 0.1);

    // Update level more gradually
    if (score > level * 10000) {
      setLevel(l => Math.min(l + 1, 10));
      // Change weather randomly
      setWeather(['sunny', 'rainy', 'stormy'][Math.floor(Math.random() * 3)] as 'sunny' | 'rainy' | 'stormy');
    }
  }, [canvasSize, level, score, obstacles, bonuses, gameSpeed, emoji]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      updateGame();
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

        // Draw background
        ctx.fillStyle = weather === 'sunny' ? '#87CEEB' : weather === 'rainy' ? '#708090' : '#4A5D6E';
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.fillStyle = '#F4A460';
        ctx.fillRect(0, canvasSize.height - 50, canvasSize.width, 50);

        // Draw weather effects
        if (weather === 'sunny') {
          ctx.font = '40px serif';
          ctx.fillText(emoji.sun, 20, 60);
        } else if (weather === 'rainy') {
          for (let i = 0; i < 10; i++) {
            ctx.font = '20px serif';
            ctx.fillText(emoji.rain, Math.random() * canvasSize.width, Math.random() * canvasSize.height);
          }
        } else if (weather === 'stormy') {
          for (let i = 0; i < 5; i++) {
            ctx.font = '30px serif';
            ctx.fillText(emoji.lightning, Math.random() * canvasSize.width, Math.random() * canvasSize.height);
          }
        }

        // Draw decorations
        decorations.forEach(d => {
          ctx.font = '40px serif';
          ctx.fillText(d.emoji, d.x, d.y);
        });

        // Draw turtle
        ctx.font = `${turtle.current.height}px serif`;
        ctx.fillText(turtle.current.isInvincible ? emoji.turtleShell : emoji.turtle, turtle.current.x, turtle.current.y + turtle.current.height);

        // Draw obstacles
        obstacles.forEach(o => {
          ctx.font = `${o.height}px serif`;
          ctx.fillText(o.emoji, o.x, o.y + o.height);
        });

        // Draw bonuses
        bonuses.forEach(b => {
          ctx.font = `${b.height}px serif`;
          ctx.fillText(b.emoji, b.x, b.y + b.height);
        });

        // Draw score, level, and speed
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`${emoji.star} Score: ${Math.floor(score)}`, 10, 30);
        ctx.fillText(`${emoji.rainbow} Level: ${level}`, canvasSize.width - 180, 30);
        ctx.fillText(`${emoji.lightning} Speed: ${gameSpeed.toFixed(2)}x`, canvasSize.width - 180, 60);
      }
      requestAnimationFrame(gameLoop);
    };

    const gameLoopId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopId);
  }, [gameState, updateGame, canvasSize, score, level, gameSpeed, weather, emoji]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setGameSpeed(1);
    setObstacles([]);
    setBonuses([]);
    setDecorations([]);
    setWeather('sunny');
    turtle.current = { ...turtle.current, x: 50, y: canvasSize.height - 50, isJumping: false, yVelocity: 0, isInvincible: false };
    setGameState('playing');
  };

  const restartGame = () => setGameState('menu');

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      <AnimatePresence>
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
            }}
          >
            <h1>{emoji.turtle} Tortue Run {emoji.turtle}</h1>
            <p>Aide la tortue à traverser l'océan !</p>
            <p>Appuyez sur la barre d'espace ou cliquez pour sauter</p>
            <button onClick={startGame}>Commencer {emoji.rainbow}</button>
          </motion.div>
        )}
        {gameState === 'gameOver' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
            }}
          >
            <h1>Partie Terminée {emoji.crab}</h1>
            <p>{emoji.star} Score: {Math.floor(score)}</p>
            <p>{emoji.rainbow} Niveau: {level}</p>
            <p>{emoji.lightning} Vitesse finale: {gameSpeed.toFixed(2)}x</p>
            {level === 10 && score > 10000 && (
              <p>{emoji.heart} Félicitations ! La tortue a traversé l'océan ! {emoji.heart}</p>
            )}
            <button onClick={restartGame}>Rejouer {emoji.rainbow}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TortueRunEmojiDeluxe;