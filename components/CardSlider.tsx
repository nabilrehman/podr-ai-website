'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CardSliderProps {
  children: React.ReactNode;
}

export const CardSlider = ({ children }: CardSliderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full">
      <motion.div 
        ref={containerRef}
        className="flex overflow-x-hidden gap-6 relative py-4 px-2"
        drag="x"
        dragConstraints={containerRef}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      >
        {children}
      </motion.div>
      
      {/* Navigation Arrows */}
      <button 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-all border border-gray-100 z-10 hover:scale-110 duration-200"
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        <ChevronLeftIcon className="w-6 h-6 text-purple-600" />
      </button>
      <button 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-all border border-gray-100 z-10 hover:scale-110 duration-200"
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        <ChevronRightIcon className="w-6 h-6 text-purple-600" />
      </button>

      {/* Gradient Shadows */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-[1]" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-[1]" />
    </div>
  );
};