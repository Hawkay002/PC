import { motion } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx'; // Utility for merging conditional Tailwind classes safely

export default function Postcard({ 
  data, 
  isInteractive = true, 
  forceFlip = false 
}) {
  // Allow internal toggling if interactive, otherwise controlled by parent (like during the envelope animation)
  const [isFlipped, setIsFlipped] = useState(false);
  const currentFlipState = isInteractive ? isFlipped : forceFlip;

  return (
    // 1. The Perspective Wrapper (creates the 3D space)
    <div 
      className="relative w-full max-w-lg aspect-[3/2] cursor-pointer perspective-1000 group"
      onClick={() => isInteractive && setIsFlipped(!isFlipped)}
      style={{ perspective: '1000px' }}
    >
      {/* 2. The Animated Card Container */}
      <motion.div
        className="w-full h-full relative transition-shadow duration-500 rounded-lg shadow-card group-hover:shadow-envelope [transform-style:preserve-3d]"
        animate={{ rotateY: currentFlipState ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 60, damping: 15 }} // "Smooth 3D card flip animation" from PRD
      >
        
        {/* --- FRONT SIDE (Message) --- */}
        <div className="absolute inset-0 w-full h-full bg-paper bg-paper-texture border border-pastel-yellow/50 rounded-lg [backface-visibility:hidden] flex overflow-hidden">
          
          {/* Left Side: Decoration */}
          <div className="w-1/2 border-r-2 border-dashed border-ink/10 flex items-center justify-center bg-pastel-blue/10">
             {/* Replace with actual decoration logic later */}
             <span className="text-6xl opacity-50">{data?.decoration || '🌸'}</span>
          </div>

          {/* Right Side: Details & Message */}
          <div className="w-1/2 p-6 flex flex-col relative">
            {/* Stamp Area */}
            <div className="absolute top-4 right-4 w-12 h-14 bg-pastel-pink border-2 border-white shadow-sm flex items-center justify-center text-2xl">
              {data?.stamp || '💌'}
            </div>

            {/* To / From */}
            <div className="font-serif text-ink/80 text-sm space-y-1 mt-4">
              <p><span className="font-bold">To:</span> {data?.to || 'Recipient'}</p>
              <p><span className="font-bold">From:</span> {data?.from || 'Sender'}</p>
            </div>

            {/* Message Area (Lined paper effect) */}
            <div className="mt-6 flex-1 bg-[linear-gradient(transparent_27px,#2C2A2920_28px)] bg-[length:100%_28px]">
              <p className="font-script text-2xl leading-[28px] text-ink pt-1">
                {data?.message || 'Write something lovely here...'}
              </p>
            </div>
          </div>
        </div>

        {/* --- BACK SIDE (Image) --- */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-lg [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-inner p-3 flex flex-col">
          
          {/* The Proxy Image Tag */}
          <div className="flex-1 w-full bg-gray-100 rounded relative overflow-hidden">
            {data?.file_id ? (
              <img 
                // Calling the proxy route we just built!
                src={`/api/image?id=${data.file_id}`} 
                alt="Postcard attachment"
                className={clsx(
                  "w-full h-full object-cover object-center",
                  data?.imageFilter === 'bw' && "grayscale"
                )}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink/40 font-serif">
                No image attached
              </div>
            )}
          </div>
          
          {/* Optional Image Caption */}
          {data?.caption && (
            <p className="text-center font-sans text-xs mt-3 text-ink/60 tracking-widest uppercase">
              {data.caption}
            </p>
          )}
        </div>

      </motion.div>
    </div>
  );
}
