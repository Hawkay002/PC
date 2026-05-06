import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import clsx from 'clsx';
import Postcard from './Postcard';

export default function Envelope({ postcardData }) {
  const [sealTaps, setSealTaps] = useState(0); 
  const [step, setStep] = useState(0); 
  const audioRef = useRef(new Audio('/crack.mp3'));

  const handleTapSeal = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => console.log("Audio blocked", e));

    if (sealTaps < 3) {
      setSealTaps(prev => prev + 1);
    } else if (step === 0) {
      // 4th Tap: Show broken seal (index 4) immediately, then sequence
      setSealTaps(4); 
      setStep(1); // Seal falls
      setTimeout(() => setStep(2), 600);  // Flap opens
      setTimeout(() => setStep(3), 1400); // Card up
      setTimeout(() => setStep(4), 2200); // Spin
      setTimeout(() => setStep(5), 3200); // Rests
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto aspect-[3/2] relative perspective-1000 mt-32">
      
      {/* 1. Envelope Back */}
      <div className="absolute inset-0 w-full h-full bg-[#EAE5DC] shadow-envelope rounded-md border border-ink/10" />

      {/* 2. Postcard */}
      <motion.div
        className="absolute inset-2" 
        initial={{ y: 0, zIndex: 10, rotateZ: 0 }}
        animate={{
          y: step >= 3 && step <= 4 ? '-110%' : 0,
          rotateZ: step === 4 ? 360 : 0,
          zIndex: step >= 5 ? 50 : 10,
          scale: step >= 5 ? 1.05 : 1
        }}
        transition={{ type: "spring", stiffness: 40, damping: 14 }}
      >
        <Postcard data={postcardData} isInteractive={step === 5} forceFlip={step < 5} />
      </motion.div>

      {/* 3. Front Pocket */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none drop-shadow-sm">
        <svg viewBox="0 0 540 360" className="w-full h-full">
          <path d="M0,0 L270,220 L540,0 L540,360 L0,360 Z" fill="#F4F1EB" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
          <path d="M0,360 L270,220 L540,360" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="2" />
        </svg>
      </div>

      {/* 4. Top Flap */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full origin-top drop-shadow-md"
        initial={{ rotateX: 0, zIndex: 30 }}
        animate={{ 
          rotateX: step >= 2 ? 180 : 0,
          zIndex: step >= 3 ? 0 : 30
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 540 360" className="w-full h-full">
          <path d="M0,0 L270,230 L540,0 Z" fill="#F4F1EB" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
        </svg>
      </motion.div>

      {/* 5. Preloaded WebP Seal (Perfectly Centered via Flexbox) */}
      <AnimatePresence>
        {step <= 1 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
            animate={step === 1 ? { y: 200, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: step === 1 ? 0.6 : 0.2 }}
          >
            <button
              onClick={handleTapSeal}
              className="relative w-24 h-24 cursor-pointer drop-shadow-xl pointer-events-auto"
            >
              {[1, 2, 3, 4, 5].map((num, index) => (
                <img 
                  key={num}
                  src={`/seal-${num}.webp`} 
                  alt="Wax Seal" 
                  className={clsx(
                    "absolute inset-0 w-full h-full object-contain transition-opacity duration-150",
                    sealTaps === index ? "opacity-100" : "opacity-0"
                  )}
                />
              ))}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
