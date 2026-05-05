import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Postcard from './Postcard';

export default function Envelope({ postcardData }) {
  // States: 'sealed' -> 'opening' -> 'open'
  const [envelopeState, setEnvelopeState] = useState('sealed');

  const handleBreakSeal = () => {
    setEnvelopeState('opening');
    // Automatically transition to open after the flap animation finishes
    setTimeout(() => {
      setEnvelopeState('open');
    }, 800); // Wait 800ms for anticipation
  };

  return (
    <div className="relative flex items-center justify-center w-full max-w-2xl h-[600px] perspective-1000">
      
      {/* 1. The Main Envelope Body (Back layer) */}
      <div className="absolute w-[500px] h-[330px] bg-paper shadow-envelope rounded-md flex items-center justify-center border border-ink/5">
        
        {/* 2. The Postcard (Hidden inside, slides out) */}
        <motion.div
          className="absolute z-10 w-[450px]"
          initial={{ y: 20, scale: 0.95, opacity: 0 }}
          animate={{
            y: envelopeState === 'open' ? -180 : 20,
            scale: envelopeState === 'open' ? 1.05 : 0.95,
            opacity: envelopeState === 'sealed' ? 0 : 1,
            zIndex: envelopeState === 'open' ? 40 : 10,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 40, 
            damping: 12, 
            delay: envelopeState === 'open' ? 0.2 : 0 
          }}
        >
          {/* We pass forceFlip to ensure it stays face down while in the envelope */}
          <Postcard 
            data={postcardData} 
            isInteractive={envelopeState === 'open'} 
            forceFlip={envelopeState !== 'open'} 
          />
        </motion.div>

        {/* 3. The Envelope Flap (Top Layer, folds up) */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1/2 bg-[#F8F5F0] rounded-t-md origin-top border-b border-ink/10 shadow-sm z-30"
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} // Creates the V-shape flap
          initial={{ rotateX: 0 }}
          animate={{ rotateX: envelopeState !== 'sealed' ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* 4. The Wax Seal (Breaks and disappears) */}
        <AnimatePresence>
          {envelopeState === 'sealed' && (
            <motion.button
              onClick={handleBreakSeal}
              className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#8B0000] rounded-full z-40 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
              initial={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.4 }}
            >
              {/* Simple Wax Seal Texture/Icon */}
              <div className="w-12 h-12 border-2 border-white/20 rounded-full flex items-center justify-center text-white/80 font-serif italic">
                S
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* 5. The Envelope Front Pocket (Covers the bottom half of the card) */}
        <div 
          className="absolute bottom-0 left-0 w-full h-2/3 bg-[#F4F1EB] rounded-b-md z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]"
          style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 50% 30%, 0 0)' }}
        />
        
      </div>

      {/* Instructions for the recipient once opened */}
      <AnimatePresence>
        {envelopeState === 'open' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 text-ink/50 font-sans text-sm animate-pulse"
          >
            Click the card to flip it
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
