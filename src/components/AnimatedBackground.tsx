import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
}

const STAR_COUNT = 200;

const GalaxiaBackground: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [stars, setStars] = useState<Star[]>([]);

  const generateStar = useCallback((): Star => ({
    x: Math.random() * dimensions.width,
    y: Math.random() * dimensions.height,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.5 + 0.1,
    brightness: Math.random() * 0.5 + 0.5,
  }), [dimensions]);

  const initializeGalaxia = useCallback(() => {
    const newStars = Array.from({ length: STAR_COUNT }, generateStar);
    setStars(newStars);
  }, [generateStar]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    initializeGalaxia();
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeGalaxia]);

  const updateGalaxia = useCallback(() => {
    setStars(prevStars =>
      prevStars.map(star => ({
        ...star,
        x: (star.x + star.speed) % dimensions.width,
        y: (star.y - star.speed / 2) % dimensions.height,
      }))
    );
  }, [dimensions]);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(function animate() {
      updateGalaxia();
      requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [updateGalaxia]);

  const starField = useMemo(() => (
    <svg className="absolute inset-0" width={dimensions.width} height={dimensions.height}>
      {stars.map((star, index) => (
        <circle
          key={index}
          cx={star.x}
          cy={star.y}
          r={star.size}
          fill={`rgba(255, 255, 255, ${star.brightness})`}
        />
      ))}
    </svg>
  ), [stars, dimensions]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {starField}
    </div>
  );
};

export default GalaxiaBackground;
