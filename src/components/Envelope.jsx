import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import Postcard from './Postcard';

export default function Envelope({ postcardData }) {
  const [envelopeState, setEnvelopeState] = useState('sealed'); // sealed, opening, open
  const [sealTaps, setSealTaps] = useState(0);
  const audioRef = useRef(new Audio('/crack.mp3')); // Place a small crack SFX in your public folder

  const handleTapSeal = () => {
    // Play sound on each tap
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => console.log("Audio play blocked by browser"));

    if (sealTaps < 4) {
      setSealTaps(prev => prev + 1);
    } else {
      // 5th tap breaks it
      setEnvelopeState('opening');
      setTimeout(() => {
        setEnvelopeState('open');
      }, 800);
    }
  };

  return (
    // Resized container for better mobile fit
    <div className="relative flex items-center justify-center w-full max-w-[400px] h-[500px] perspective-1000">
      
      {/* The Envelope Body */}
      <div className="absolute w-[340px] h-[230px] bg-[#F4F1EB] shadow-envelope rounded-md flex items-center justify-center border border-ink/10">
        
        {/* The Postcard */}
        <motion.div
          className="absolute z-10 w-[300px]"
          initial={{ y: 20, scale: 0.95, opacity: 0, rotateZ: 0 }}
          animate={{
            y: envelopeState === 'open' ? -160 : 20,
            scale: envelopeState === 'open' ? 1.05 : 0.95,
            opacity: envelopeState === 'sealed' ? 0 : 1,
            zIndex: envelopeState === 'open' ? 40 : 10,
            rotateZ: envelopeState === 'open' ? 360 : 0 // The Spin Animation
          }}
          transition={{ 
            type: "spring", 
            stiffness: 40, 
            damping: 15, 
            delay: envelopeState === 'open' ? 0.2 : 0 
          }}
        >
          <Postcard 
            data={postcardData} 
            isInteractive={envelopeState === 'open'} 
            forceFlip={envelopeState !== 'open'} 
          />
        </motion.div>

        {/* The Envelope Flap (Fixed SVG for clean lines) */}
        <motion.svg
          className="absolute top-0 left-0 w-full h-[130px] z-30 origin-top drop-shadow-md"
          viewBox="0 0 340 130"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: envelopeState !== 'sealed' ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <path d="M0,0 L170,130 L340,0 Z" fill="#EAE5DC" stroke="rgba(44,42,41,0.05)" />
        </motion.svg>

        {/* The Stamp/Wax Seal */}
        <AnimatePresence>
          {envelopeState === 'sealed' && (
            <motion.button
              onClick={handleTapSeal}
              className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer drop-shadow-xl"
              initial={{ scale: 1, opacity: 1 }}
              // Shake harder with every tap
              animate={{ 
                rotate: sealTaps > 0 ? [-5*sealTaps, 5*sealTaps, -5*sealTaps, 0] : 0,
                scale: 1 + (sealTaps * 0.05) 
              }}
              exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.3 }}
            >
              {/* Replace with your custom stamp image */}
              <div className="relative w-20 h-20">
                <img 
                  src="/seal.png" // Point this to your seal image in public/
                  alt="Seal" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback wax seal if image is missing
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div class="w-16 h-16 bg-red-800 rounded-full border-2 border-white/20 shadow-lg flex items-center justify-center text-white/50 text-xs">Tap x5</div>`;
                  }}
                />
                
                {/* Visual cracks that appear based on taps */}
                {sealTaps > 0 && <div className="absolute inset-0 bg-black/10 rounded-full" style={{ clipPath: `circle(${sealTaps * 15}% at 50% 50%)`}} />}
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* The Front Pocket */}
        <div 
          className="absolute bottom-0 left-0 w-full h-2/3 bg-[#F4F1EB] rounded-b-md z-20 border-t border-white/50"
          style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 50% 30%, 0 0)' }}
        />
        
      </div>
    </div>
  );
}
