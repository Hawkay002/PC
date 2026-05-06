import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import Postcard from './Postcard';

export default function Envelope({ postcardData }) {
  const [sealTaps, setSealTaps] = useState(0); // 0 to 4
  const [step, setStep] = useState(0); // 0: sealed, 1: seal falls, 2: flap opens, 3: card up, 4: card rests
  
  const audioRef = useRef(new Audio('/crack.mp3')); // Place crack.mp3 in public folder

  const handleTapSeal = () => {
    // Play sound
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => console.log("Audio blocked", e));

    if (sealTaps < 4) {
      setSealTaps(prev => prev + 1);
    } else if (step === 0) {
      // 5th tap sequence
      setStep(1); // Seal falls
      setTimeout(() => setStep(2), 600); // Flap opens
      setTimeout(() => setStep(3), 1400); // Card slides UP out of envelope
      setTimeout(() => setStep(4), 2200); // Card rests ON envelope
    }
  };

  return (
    // Sized to perfectly match max-w-lg (512px) card width
    <div className="relative flex items-center justify-center w-full max-w-xl h-[600px] perspective-1000">
      
      {/* The Envelope Body - No rounded top corners */}
      <div className="absolute w-[540px] h-[360px] bg-[#F4F1EB] shadow-envelope flex items-center justify-center border border-ink/10 rounded-b-md">
        
        {/* The Postcard */}
        <motion.div
          className="absolute w-[512px]" // Exact max-w-lg
          initial={{ y: 20, zIndex: 10 }}
          animate={{
            y: step < 3 ? 20 : (step === 3 ? -250 : 0),
            zIndex: step === 4 ? 40 : 10,
            rotateZ: step === 3 ? [0, -5, 5, 0] : 0, // Slight wiggle as it pulls out
          }}
          transition={{ type: "spring", stiffness: 40, damping: 12 }}
        >
          <Postcard 
            data={postcardData} 
            isInteractive={step === 4} 
            forceFlip={step < 4} 
          />
        </motion.div>

        {/* The Flap - Straight lines, no curves */}
        <motion.svg
          className="absolute top-0 left-0 w-full h-[180px] z-30 origin-top drop-shadow-sm"
          viewBox="0 0 540 180"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: step >= 2 ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <path d="M0,0 L270,180 L540,0 Z" fill="#EAE5DC" stroke="rgba(44,42,41,0.05)" />
        </motion.svg>

        {/* The WebP Seal */}
        <AnimatePresence>
          {step <= 1 && (
            <motion.button
              onClick={handleTapSeal}
              className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer drop-shadow-xl"
              animate={step === 1 ? { y: 200, opacity: 0 } : { scale: 1 + (sealTaps * 0.05) }}
              transition={{ duration: step === 1 ? 0.6 : 0.2 }}
            >
              <img 
                src={`/seal-${sealTaps + 1}.webp`} 
                alt="Wax Seal" 
                className="w-24 h-24 object-contain"
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* The Front Pocket */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[240px] bg-[#F4F1EB] rounded-b-md z-20 border-t border-white/50"
          style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 50% 20%, 0 0)' }}
        />
        
      </div>
    </div>
  );
}
