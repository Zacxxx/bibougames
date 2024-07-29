import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';

interface ContentBlockProps {
  children: React.ReactNode;
}

const ContentBlock: React.FC<ContentBlockProps> = ({ children }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    if (contentRef.current && gameContainerRef.current) {
      const parentWidth = contentRef.current.offsetWidth;
      const parentHeight = contentRef.current.offsetHeight;
      const gameAspectRatio = 16 / 9; // Supposons que le jeu est en 16:9

      let newScale;
      if (parentWidth / parentHeight > gameAspectRatio) {
        // Le conteneur est plus large que le jeu
        newScale = parentHeight / 720;
      } else {
        // Le conteneur est plus étroit que le jeu
        newScale = parentWidth / 1280;
      }

      setScale(newScale);

      // Ajuster la taille du conteneur du jeu
      gameContainerRef.current.style.width = `${1280 * newScale}px`;
      gameContainerRef.current.style.height = `${720 * newScale}px`;
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      contentRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  useEffect(() => {
    updateScale();
  }, [isExpanded, updateScale]);

  return (
    <div
      ref={contentRef}
      className={`relative bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl transition-all duration-300 ${
        isExpanded ? 'w-[95vw] h-[90vh]' : 'w-[85vw] h-[80vh]'
      } ${isFullScreen ? 'fixed inset-0 z-50 rounded-none' : ''} mx-auto my-4 overflow-hidden`}
    >
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <button
          onClick={toggleExpand}
          className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          title={isExpanded ? "Réduire" : "Agrandir"}
        >
          {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
        <button
          onClick={toggleFullScreen}
          className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          title={isFullScreen ? "Quitter le plein écran" : "Plein écran"}
        >
          {isFullScreen ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
        </button>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <div
          ref={gameContainerRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ContentBlock;