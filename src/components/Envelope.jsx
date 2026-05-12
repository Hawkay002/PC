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
    audioRef.current.play().catch(() => {});
    if (sealTaps < 3) {
      setSealTaps(p => p + 1);
    } else if (step === 0) {
      setSealTaps(4);
      setStep(1);                              // flap opens
      setTimeout(() => setStep(2), 900);       // postcard starts rising
      setTimeout(() => setStep(3), 2000);      // z swap — postcard fully above
      setTimeout(() => setStep(4), 2600);      // interactive
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-4">
      <AnimatePresence>
        {step === 0 && postcardData?.to_name && (
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-lg font-light italic text-muted mb-6">
            For <span className="text-champagne">{postcardData.to_name}</span>
          </motion.p>
        )}
      </AnimatePresence>

      <div className="w-full max-w-lg mx-auto aspect-[3/2] relative perspective-1000">

        {/* ── ENVELOPE BODY with decorative borders ── */}
        <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-envelope">
          {/* Parchment base */}
          <div className="absolute inset-0 bg-[#EAE5DC]" />
          {/* Inner image background — slightly inset */}
          <div className="absolute inset-3 rounded-lg overflow-hidden opacity-30">
            <img
              src={postcardData?.file_id ? `/api/image?id=${postcardData.file_id}` : ''}
              alt=""
              className="w-full h-full object-cover"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          {/* Decorative border — outer rule */}
          <div className="absolute inset-0 rounded-xl border-[3px] border-[#C8A96E]/25 pointer-events-none" />
          {/* Decorative border — inner rule */}
          <div className="absolute inset-[6px] rounded-lg border border-[#C8A96E]/15 pointer-events-none" />
          {/* Corner ornaments */}
          {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-5 h-5 pointer-events-none`}>
              <svg viewBox="0 0 20 20" className="w-full h-full text-[#C8A96E]/30">
                <path d={i === 0 ? 'M0,10 L0,0 L10,0' : i === 1 ? 'M20,10 L20,0 L10,0' : i === 2 ? 'M0,10 L0,20 L10,20' : 'M20,10 L20,20 L10,20'}
                  fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          ))}
        </div>

        {/* ── POSTCARD inside envelope (smaller, inset) ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: step >= 3 ? 50 : 10 }}
          initial={{ scale: 0.82 }}
          animate={{
            scale: 0.82,
            y: step >= 2 ? '-118%' : 0,
          }}
          transition={{ type: 'spring', stiffness: 38, damping: 14 }}
        >
          <div className="w-full">
            <Postcard data={postcardData} isInteractive={step >= 4} forceFlip={false} />
          </div>
        </motion.div>

        {/* ── BOTTOM FLAP ── */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <svg viewBox="0 0 540 360" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,0 L270,215 L540,0 L540,360 L0,360 Z" fill="#F0EBE0" stroke="rgba(200,169,110,0.15)" strokeWidth="1" />
            <path d="M0,360 L270,215 L540,360" fill="none" stroke="rgba(200,169,110,0.1)" strokeWidth="1" />
          </svg>
        </div>

        {/* ── TOP FLAP — z swaps AFTER postcard fully exits ── */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full origin-top"
          style={{ zIndex: step >= 3 ? 0 : 30 }}
          animate={{ rotateX: step >= 1 ? 180 : 0 }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 540 360" preserveAspectRatio="none" className="w-full h-full">
            {/* Flap shape */}
            <path d="M0,0 L270,225 L540,0 Z" fill="#EDE8DC" stroke="rgba(200,169,110,0.2)" strokeWidth="1" />
            {/* Decorative inner rule on flap */}
            <path d="M20,4 L270,210 L520,4" fill="none" stroke="rgba(200,169,110,0.12)" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* ── WAX SEAL ── */}
        <AnimatePresence>
          {step <= 0 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button onClick={handleTapSeal}
                className="relative w-24 h-24 cursor-pointer drop-shadow-xl pointer-events-auto">
                {[1,2,3,4,5].map((num, idx) => (
                  <img key={num} src={`/seal-${num}.webp`} alt="Wax Seal"
                    className={clsx('absolute inset-0 w-full h-full object-contain transition-opacity duration-150',
                      sealTaps === idx ? 'opacity-100' : 'opacity-0')} />
                ))}
                {sealTaps === 0 && (
                  <motion.div animate={{ y: [0,-4,0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="absolute top-[110%] left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap">
                    <span className="bg-panel/90 backdrop-blur text-champagne text-xs font-sans uppercase tracking-[0.15em] px-4 py-1.5 rounded-sm border border-gold/20">
                      Tap to open
                    </span>
                  </motion.div>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tap to flip hint */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-muted font-sans text-xs tracking-[0.15em] uppercase whitespace-nowrap pointer-events-none">
              Tap postcard to flip
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
