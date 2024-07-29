import React, { useEffect, useRef, useState } from 'react';

const EnhancedStreetFighterGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [winner, setWinner] = useState<'player1' | 'player2' | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game constants
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;
    const GROUND_Y = 350;

    // Load images
    const backgroundImage = new Image();
    backgroundImage.src = 'https://example.com/background.png'; // Replace with actual background image URL

    const player1Sprite = new Image();
    player1Sprite.src = 'https://example.com/player1-sprite.png'; // Replace with actual player 1 sprite URL

    const player2Sprite = new Image();
    player2Sprite.src = 'https://example.com/player2-sprite.png'; // Replace with actual player 2 sprite URL

    // Load sounds
    const hitSound = new Audio('https://example.com/hit-sound.mp3'); // Replace with actual hit sound URL
    const jumpSound = new Audio('https://example.com/jump-sound.mp3'); // Replace with actual jump sound URL

    // Player class
    class Fighter {
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      jumpStrength: number;
      health: number;
      energy: number;
      isJumping: boolean;
      yVelocity: number;
      isAttacking: boolean;
      attackCooldown: number;
      sprite: HTMLImageElement;
      facingRight: boolean;
      currentFrame: number;
      framesToNextSprite: number;
      specialAttackAvailable: boolean;

      constructor(x: number, y: number, sprite: HTMLImageElement, facingRight: boolean) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 150;
        this.speed = 5;
        this.jumpStrength = 15;
        this.health = 100;
        this.energy = 0;
        this.isJumping = false;
        this.yVelocity = 0;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.sprite = sprite;
        this.facingRight = facingRight;
        this.currentFrame = 0;
        this.framesToNextSprite = 5;
        this.specialAttackAvailable = false;
      }

      move(direction: 'left' | 'right') {
        if (direction === 'left') {
          this.x -= this.speed;
          this.facingRight = false;
        } else {
          this.x += this.speed;
          this.facingRight = true;
        }
        this.x = Math.max(0, Math.min(this.x, CANVAS_WIDTH - this.width));
      }

      jump() {
        if (!this.isJumping) {
          this.isJumping = true;
          this.yVelocity = -this.jumpStrength;
          jumpSound.play();
        }
      }

      attack() {
        if (this.attackCooldown === 0) {
          this.isAttacking = true;
          this.attackCooldown = 30;
          hitSound.play();
        }
      }

      specialAttack() {
        if (this.specialAttackAvailable && this.energy >= 50) {
          this.isAttacking = true;
          this.attackCooldown = 60;
          this.energy -= 50;
          // Add special attack effect here
        }
      }

      update() {
        if (this.isJumping) {
          this.y += this.yVelocity;
          this.yVelocity += 0.8; // Gravity

          if (this.y > GROUND_Y - this.height) {
            this.y = GROUND_Y - this.height;
            this.isJumping = false;
            this.yVelocity = 0;
          }
        }

        if (this.attackCooldown > 0) {
          this.attackCooldown--;
        } else {
          this.isAttacking = false;
        }

        // Update sprite animation
        if (--this.framesToNextSprite <= 0) {
          this.currentFrame = (this.currentFrame + 1) % 4; // Assuming 4 frames per animation
          this.framesToNextSprite = 5;
        }

        // Increase energy over time
        if (this.energy < 100) {
          this.energy += 0.1;
        }

        this.specialAttackAvailable = this.energy >= 50;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        if (!this.facingRight) {
          ctx.scale(-1, 1);
          ctx.translate(-CANVAS_WIDTH, 0);
        }
        ctx.drawImage(
          this.sprite,
          this.currentFrame * 80, // Assuming each frame is 80px wide
          this.isAttacking ? 150 : 0, // Use different row for attack animation
          80,
          150,
          this.facingRight ? this.x : CANVAS_WIDTH - this.x - this.width,
          this.y,
          this.width,
          this.height
        );
        ctx.restore();

        // Draw health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 20, this.width, 10);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y - 20, this.width * (this.health / 100), 10);

        // Draw energy bar
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y - 35, this.width * (this.energy / 100), 10);
      }
    }

    const player1 = new Fighter(100, GROUND_Y - 150, player1Sprite, true);
    const player2 = new Fighter(CANVAS_WIDTH - 180, GROUND_Y - 150, player2Sprite, false);

    // Game state
    const keysPressed: { [key: string]: boolean } = {};

    // Event listeners
    window.addEventListener('keydown', (e) => {
      keysPressed[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      keysPressed[e.code] = false;
    });

    // Particle system for hit effects
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 60 + 300}, 100%, 50%)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let particles: Particle[] = [];

    function createHitEffect(x: number, y: number) {
      for (let i = 0; i < 10; i++) {
        particles.push(new Particle(x, y));
      }
    }

    // Game loop
    function gameLoop() {
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw background
      ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Update players
      if (keysPressed['KeyA']) player1.move('left');
      if (keysPressed['KeyD']) player1.move('right');
      if (keysPressed['KeyW']) player1.jump();
      if (keysPressed['Space']) player1.attack();
      if (keysPressed['KeyQ']) player1.specialAttack();

      if (keysPressed['ArrowLeft']) player2.move('left');
      if (keysPressed['ArrowRight']) player2.move('right');
      if (keysPressed['ArrowUp']) player2.jump();
      if (keysPressed['Enter']) player2.attack();
      if (keysPressed['ShiftRight']) player2.specialAttack();

      player1.update();
      player2.update();

      // Check for hits
      if (player1.isAttacking && Math.abs(player1.x - player2.x) < 100) {
        player2.health -= 5;
        createHitEffect(player2.x + player2.width / 2, player2.y + player2.height / 2);
      }
      if (player2.isAttacking && Math.abs(player2.x - player1.x) < 100) {
        player1.health -= 5;
        createHitEffect(player1.x + player1.width / 2, player1.y + player1.height / 2);
      }

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.update();
        particle.draw(ctx);
        if (particle.size <= 0.1) {
          particles.splice(index, 1);
        }
      });

      // Draw players
      player1.draw(ctx);
      player2.draw(ctx);

      // Check for game over
      if (player1.health <= 0 || player2.health <= 0) {
        setGameState('gameOver');
        setWinner(player1.health <= 0 ? 'player2' : 'player1');
        return;
      }

      // Request next frame
      requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    if (gameState === 'playing') {
      gameLoop();
    }

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', (e) => {
        keysPressed[e.code] = true;
      });
      window.removeEventListener('keyup', (e) => {
        keysPressed[e.code] = false;
      });
    };
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
  };

  const restartGame = () => {
    setGameState('menu');
    setWinner(null);
  };

  if (gameState === 'menu') {
    return (
      <div className="game-menu">
        <h1>Street Fighter Clone</h1>
        <button onClick={startGame}>Start Game</button>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="game-over">
        <h1>{winner === 'player1' ? 'Player 1' : 'Player 2'} Wins!</h1>
        <button onClick={restartGame}>Play Again</button>
      </div>
    );
  }

  return <canvas ref={canvasRef} width={800} height={400} />;
};

export default EnhancedStreetFighterGame;