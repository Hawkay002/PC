import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import Postcard from './Postcard';

export default function Envelope({ postcardData }) {
  const [sealTaps, setSealTaps] = useState(0); 
  // step 0: sealed, 1: seal falls, 2: flap opens, 3: card slides out, 4: card spins, 5: rests on top
  const [step, setStep] = useState(0); 
  
  const audioRef = useRef(new Audio('/crack.mp3'));

  const handleTapSeal = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => console.log("Audio blocked", e));

    if (sealTaps < 4) {
      setSealTaps(prev => prev + 1);
    } else if (step === 0) {
      // The Orchestration Sequence
      setStep(1); // Seal falls
      setTimeout(() => setStep(2), 600);  // Flap opens
      setTimeout(() => setStep(3), 1400); // Card slides UP out of envelope
      setTimeout(() => setStep(4), 2200); // Card SPINS (while out)
      setTimeout(() => setStep(5), 3200); // Card rests ON envelope
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto aspect-[3/2] relative perspective-1000 mt-32">
      
      {/* 1. The Envelope Back */}
      <div className="absolute inset-0 bg-[#EAE5DC] shadow-envelope rounded-b-md border border-ink/10" />

      {/* 2. The Postcard */}
      <motion.div
        className="absolute inset-2" // Slightly smaller than envelope to fit inside
        initial={{ y: 0, zIndex: 10, rotateZ: 0 }}
        animate={{
          y: step >= 3 && step <= 4 ? '-110%' : 0,
          rotateZ: step === 4 ? 360 : 0,
          zIndex: step >= 5 ? 50 : 10,
          scale: step >= 5 ? 1.05 : 1
        }}
        transition={{ type: "spring", stiffness: 40, damping: 14 }}
      >
        <Postcard 
          data={postcardData} 
          isInteractive={step === 5} 
          forceFlip={step < 5} 
        />
      </motion.div>

      {/* 3. The Front Pocket */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[75%] bg-[#F4F1EB] rounded-b-md z-20 border-t border-white/50"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 50% 25%, 0 0)' }}
      />

      {/* 4. The Symmetrical Flap */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[65%] z-30 origin-top drop-shadow-sm"
        initial={{ rotateX: 0 }}
        animate={{ rotateX: step >= 2 ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 L50,100 L100,0 Z" fill="#F4F1EB" stroke="rgba(0,0,0,0.05)" strokeWidth="0.2"/>
        </svg>
      </motion.div>

      {/* 5. The WebP Seal */}
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

    </div>
  );
}
