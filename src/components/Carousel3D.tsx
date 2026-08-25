'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const items = [
  { id: 1, title: 'Data Profiling', color: 'bg-blue-500' },
  { id: 2, title: 'Data Cleaning', color: 'bg-green-500' },
  { id: 3, title: 'Feature Eng', color: 'bg-purple-500' },
  { id: 4, title: 'Model Selection', color: 'bg-rose-500' },
  { id: 5, title: 'Evaluation', color: 'bg-amber-500' },
];

export default function Carousel3D() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
      <div className="relative w-64 h-80 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
            // Calculate the relative position
            let offset = index - currentIndex;
            if (offset < -Math.floor(items.length / 2)) offset += items.length;
            if (offset > Math.floor(items.length / 2)) offset -= items.length;

            const isCenter = offset === 0;
            const isLeft = offset < 0;
            const isRight = offset > 0;

            const x = offset * 180;
            const z = isCenter ? 0 : -200 - Math.abs(offset) * 50;
            const rotateY = isCenter ? 0 : isLeft ? 35 : -35;
            const opacity = isCenter ? 1 : Math.max(0, 1 - Math.abs(offset) * 0.4);
            const zIndex = items.length - Math.abs(offset);

            return (
              <motion.div
                key={item.id}
                initial={false}
                animate={{
                  x,
                  z,
                  rotateY,
                  opacity,
                  zIndex,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`absolute w-full h-full rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white text-2xl font-bold cursor-pointer ${item.color} backdrop-blur-md bg-opacity-80 border border-white/20`}
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => {
                  if (!isCenter) setCurrentIndex(index);
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                <span className="drop-shadow-lg" style={{ transform: 'translateZ(30px)' }}>{item.title}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 flex gap-4">
        <button onClick={prev} className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition">Prev</button>
        <button onClick={next} className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition">Next</button>
      </div>
    </div>
  );
}
