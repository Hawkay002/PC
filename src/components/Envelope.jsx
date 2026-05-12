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
    audioRef.current.play().catch(e => console.log('Audio blocked', e));

    if (sealTaps < 3) {
      setSealTaps(prev => prev + 1);
    } else if (step === 0) {
      setSealTaps(4);
      setStep(1);
      setTimeout(() => setStep(2), 600);
      setTimeout(() => setStep(3), 1400);
      setTimeout(() => setStep(4), 2200);
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-4">
      {/* Recipient label above envelope */}
      <AnimatePresence>
        {step === 0 && postcardData?.to_name && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-lg font-light italic text-muted mb-6"
          >
            For <span className="text-champagne">{postcardData.to_name}</span>
          </motion.p>
        )}
      </AnimatePresence>

      <div className="w-full max-w-lg mx-auto aspect-[3/2] relative perspective-1000">
        {/* Envelope body */}
        <div className="absolute inset-0 w-full h-full bg-[#EAE5DC] shadow-envelope rounded-sm border border-ink/10" />

        {/* Postcard inside */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ y: 0 }}
          animate={{
            y: step === 3 ? '-110%' : 0,
            zIndex: step >= 4 ? 50 : 10,
            scale: 0.96
          }}
          transition={{ type: 'spring', stiffness: 40, damping: 14 }}
        >
          {/* Removed shadow-card from this wrapper to prevent double shadowing */}
          <div className="w-full relative">
            <Postcard 
              data={postcardData} 
              isInteractive={step >= 4} 
              forceFlip={false} 
              showShadow={false} 
            />
          </div>
        </motion.div>

        {/* Envelope bottom flap */}
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none drop-shadow-sm">
          <svg viewBox="0 0 540 360" preserveAspectRatio="none" className="w-full h-full rounded-b-sm overflow-hidden">
            <path d="M0,0 L270,220 L540,0 L540,360 L0,360 Z" fill="#F4F1EB" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
            <path d="M0,360 L270,220 L540,360" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="2" />
          </svg>
        </div>

        {/* Envelope top flap */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full origin-top drop-shadow-md"
          initial={{ rotateX: 0, zIndex: 30 }}
          animate={{
            rotateX: step >= 2 ? 180 : 0,
            zIndex: step >= 3 ? 5 : 30 // Now uses 5 instead of 0 to sit smoothly between layers
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 540 360" preserveAspectRatio="none" className="w-full h-full rounded-t-sm">
            <path d="M0,0 L270,230 L540,0 Z" fill="#F4F1EB" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Wax seal */}
        <AnimatePresence>
          {step <= 1 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
              animate={step === 1 ? { y: 200, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: step === 1 ? 0.6 : 0.2 }}
            >
              <button
                onClick={handleTapSeal}
                className="relative w-24 h-24 cursor-pointer drop-shadow-xl pointer-events-auto group"
              >
                {[1, 2, 3, 4, 5].map((num, index) => (
                  <img
                    key={num}
                    src={`/seal-${num}.webp`}
                    alt="Wax Seal"
                    className={clsx(
                      'absolute inset-0 w-full h-full object-contain transition-opacity duration-150',
                      sealTaps === index ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                ))}
                {sealTaps === 0 && (
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="absolute top-[110%] left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap"
                  >
                    <span className="bg-panel/90 backdrop-blur text-champagne text-xs font-sans uppercase tracking-[0.15em] px-4 py-1.5 rounded-sm border border-gold/20">
                      Tap to open
                    </span>
                  </motion.div>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* "Tap to flip" hint after opening */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-muted font-sans text-xs tracking-[0.15em] uppercase whitespace-nowrap pointer-events-none"
            >
              Tap postcard to flip
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
