import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import Postcard from './Postcard';

export default function Envelope({ postcardData }) {
  const [sealTaps, setSealTaps] = useState(0); 
  const [step, setStep] = useState(0); 
  const audioRef = useRef(new Audio('/crack.mp3'));

  const handleTapSeal = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => console.log("Audio blocked", e));

    if (sealTaps < 4) {
      setSealTaps(prev => prev + 1);
    } else if (step === 0) {
      setStep(1); 
      setTimeout(() => setStep(2), 600);  
      setTimeout(() => setStep(3), 1400); 
      setTimeout(() => setStep(4), 2200); 
      setTimeout(() => setStep(5), 3200); 
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto aspect-[3/2] relative perspective-1000 mt-32">
      
      {/* 1. The Envelope Back */}
      <div className="absolute inset-0 w-full h-full bg-[#EAE5DC] shadow-envelope rounded-md border border-ink/10" />

      {/* 2. The Postcard */}
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

      {/* 3. The Front Pocket (Perfect SVG Mask) */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
        <svg viewBox="0 0 540 360" className="w-full h-full drop-shadow-sm">
          {/* Draws the bottom pocket masking the sides entirely */}
          <path d="M0,360 L540,360 L540,120 L270,240 L0,120 Z" fill="#F4F1EB" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
        </svg>
      </div>

      {/* 4. The Top Flap */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[200px] origin-top drop-shadow-sm"
        initial={{ rotateX: 0, zIndex: 30 }}
        animate={{ 
          rotateX: step >= 2 ? 180 : 0,
          zIndex: step >= 3 ? 0 : 30 // RAPID Z-INDEX DROP so card clears the flap
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 540 200" className="w-full h-full">
          <path d="M0,0 L270,160 L540,0 Z" fill="#F4F1EB" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
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
            <img src={`/seal-${sealTaps + 1}.webp`} alt="Wax Seal" className="w-24 h-24 object-contain" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
