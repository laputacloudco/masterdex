import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PokemonCard } from '@/lib/types';

interface CardPreviewProps {
  card: PokemonCard;
  children: React.ReactNode;
}

export function CardPreview({ card, children }: CardPreviewProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    const viewportWidth = window.innerWidth;
    const previewWidth = 300;
    const padding = 20;
    
    let finalX = x + padding;
    if (finalX + previewWidth > viewportWidth) {
      finalX = x - previewWidth - padding;
    }
    
    setPosition({ x: finalX, y: y - 200 });
  };

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      className="relative"
    >
      {children}
      
      <AnimatePresence>
        {isHovering && card.largeImageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          >
            <div className="bg-card border-2 border-primary/50 rounded-lg shadow-2xl overflow-hidden">
              <img 
                src={card.largeImageUrl} 
                alt={card.name}
                className="w-[300px] h-auto"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
