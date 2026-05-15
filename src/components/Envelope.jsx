import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import clsx from 'clsx';
import Postcard from './Postcard';

// ─── Botanical SVG pattern tile (60×60) ──────────────────────────────────────
function BotanicalDefs({ id }) {
  return (
    <defs>
      <pattern id={id} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        {/* Cream base */}
        <rect width="60" height="60" fill="#EDE5D0" />

        {/* ── Central 8-petal flower ── */}
        <ellipse cx="30" cy="22.5" rx="2.8" ry="5.5" fill="#C4826A" opacity="0.78" />
        <ellipse cx="30" cy="37.5" rx="2.8" ry="5.5" fill="#C4826A" opacity="0.78" />
        <ellipse cx="22.5" cy="30" rx="5.5" ry="2.8" fill="#C4826A" opacity="0.78" />
        <ellipse cx="37.5" cy="30" rx="5.5" ry="2.8" fill="#C4826A" opacity="0.78" />
        <ellipse cx="25" cy="25" rx="2.2" ry="4.5" transform="rotate(-45 25 25)" fill="#B86B50" opacity="0.6" />
        <ellipse cx="35" cy="25" rx="2.2" ry="4.5" transform="rotate(45 35 25)" fill="#B86B50" opacity="0.6" />
        <ellipse cx="25" cy="35" rx="2.2" ry="4.5" transform="rotate(45 25 35)" fill="#B86B50" opacity="0.6" />
        <ellipse cx="35" cy="35" rx="2.2" ry="4.5" transform="rotate(-45 35 35)" fill="#B86B50" opacity="0.6" />
        <circle cx="30" cy="30" r="4" fill="#C8A96E" opacity="0.95" />
        <circle cx="30" cy="30" r="2.2" fill="#EDE5D0" />
        <circle cx="30" cy="30" r="1" fill="#C8A96E" opacity="0.7" />

        {/* ── Corner leaf sprigs ── */}
        <path d="M3 6 Q6.5 2 9 7 Q4 10 3 6Z" fill="#6E9A5F" opacity="0.6" />
        <path d="M6 3 Q10 6 7 9.5 Q3 7 6 3Z" fill="#7FAD6E" opacity="0.45" />
        <path d="M57 6 Q53.5 2 51 7 Q56 10 57 6Z" fill="#6E9A5F" opacity="0.6" />
        <path d="M54 3 Q50 6 53 9.5 Q57 7 54 3Z" fill="#7FAD6E" opacity="0.45" />
        <path d="M3 54 Q6.5 58 9 53 Q4 50 3 54Z" fill="#6E9A5F" opacity="0.6" />
        <path d="M6 57 Q10 54 7 50.5 Q3 53 6 57Z" fill="#7FAD6E" opacity="0.45" />
        <path d="M57 54 Q53.5 58 51 53 Q56 50 57 54Z" fill="#6E9A5F" opacity="0.6" />
        <path d="M54 57 Q50 54 53 50.5 Q57 53 54 57Z" fill="#7FAD6E" opacity="0.45" />

        {/* ── Small buds at edge midpoints ── */}
        <ellipse cx="30" cy="4" rx="2" ry="2.8" fill="#D4956A" opacity="0.55" />
        <circle cx="30" cy="4" r="1" fill="#C8A96E" opacity="0.6" />
        <ellipse cx="30" cy="56" rx="2" ry="2.8" fill="#D4956A" opacity="0.55" />
        <circle cx="30" cy="56" r="1" fill="#C8A96E" opacity="0.6" />
        <ellipse cx="4" cy="30" rx="2.8" ry="2" fill="#D4956A" opacity="0.55" />
        <circle cx="4" cy="30" r="1" fill="#C8A96E" opacity="0.6" />
        <ellipse cx="56" cy="30" rx="2.8" ry="2" fill="#D4956A" opacity="0.55" />
        <circle cx="56" cy="30" r="1" fill="#C8A96E" opacity="0.6" />

        {/* ── Gold dot accents ── */}
        <circle cx="15" cy="15" r="1.4" fill="#C8A96E" opacity="0.38" />
        <circle cx="45" cy="15" r="1.4" fill="#C8A96E" opacity="0.38" />
        <circle cx="15" cy="45" r="1.4" fill="#C8A96E" opacity="0.38" />
        <circle cx="45" cy="45" r="1.4" fill="#C8A96E" opacity="0.38" />
      </pattern>
    </defs>
  );
}

const GOLD = '#C8A96E';
const GOLD2 = '#E4CC8A';

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
      {/* Recipient label */}
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

        {/* ── ENVELOPE BODY — botanical inside lining ── */}
        <div className="absolute inset-0 w-full h-full shadow-envelope rounded-sm overflow-hidden">
          <div className="absolute inset-0 bg-[#EAE5DC]" />
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 540 360"
            preserveAspectRatio="none"
          >
            <BotanicalDefs id="bodyPat" />
            <rect width="540" height="360" fill="url(#bodyPat)" opacity="0.88" />
            {/* Ghost fold lines visible behind postcard */}
            <line x1="0" y1="0" x2="270" y2="220" stroke={GOLD} strokeWidth="1.2" opacity="0.35" />
            <line x1="540" y1="0" x2="270" y2="220" stroke={GOLD} strokeWidth="1.2" opacity="0.35" />
          </svg>
          {/* Perimeter gold inset ring */}
          <div
            className="absolute inset-0 pointer-events-none rounded-sm"
            style={{ boxShadow: `inset 0 0 0 1.5px rgba(200,169,110,0.4), inset 0 0 0 3.5px rgba(200,169,110,0.12)` }}
          />
        </div>

        {/* ── POSTCARD INSIDE ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ y: 0 }}
          animate={{
            y: step === 3 ? '-110%' : 0,
            zIndex: step >= 4 ? 50 : 10,
            scale: 0.96,
          }}
          transition={{ type: 'spring', stiffness: 40, damping: 14 }}
        >
          <div className="w-full relative">
            <Postcard data={postcardData} isInteractive={step >= 4} forceFlip={false} showShadow={false} />
          </div>
        </motion.div>

        {/* ── BOTTOM FLAP — outside face with gold borders ── */}
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none drop-shadow-sm">
          <svg viewBox="0 0 540 360" preserveAspectRatio="none" className="w-full h-full rounded-b-sm overflow-hidden">
            <BotanicalDefs id="btmPat" />

            {/* Cream exterior face */}
            <path d="M0,0 L270,220 L540,0 L540,360 L0,360 Z" fill="#F0EBE1" />
            {/* Very light pattern ghost on outside */}
            <path d="M0,0 L270,220 L540,0 L540,360 L0,360 Z" fill="url(#btmPat)" opacity="0.12" />

            {/* ── V seam gold border — double line ── */}
            <path d="M2,0 L270,218 L538,0" fill="none" stroke={GOLD2} strokeWidth="0.8" opacity="0.55" />
            <path d="M0,0 L270,220 L540,0" fill="none" stroke={GOLD} strokeWidth="2.2" opacity="0.85" />

            {/* Inner parallel accent */}
            <path d="M14,0 L270,208 L526,0" fill="none" stroke={GOLD} strokeWidth="0.7" opacity="0.3" />

            {/* Bottom V seam */}
            <path d="M0,360 L270,222 L540,360" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.28" />

            {/* Perimeter gold rectangle */}
            <rect x="1.5" y="1.5" width="537" height="357" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.3" rx="1" />
          </svg>
        </div>

        {/* ── TOP FLAP — outside + inside botanical revealed on open ── */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full origin-top drop-shadow-md"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ rotateX: 0, zIndex: 30 }}
          animate={{
            rotateX: step >= 2 ? 180 : 0,
            zIndex: step >= 3 ? 5 : 30,
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* OUTSIDE face of top flap */}
          <svg
            viewBox="0 0 540 360"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full rounded-t-sm"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <BotanicalDefs id="flapOutPat" />

            {/* Cream triangle */}
            <path d="M0,0 L270,230 L540,0 Z" fill="#F0EBE1" />
            {/* Very faint pattern on outside */}
            <path d="M0,0 L270,230 L540,0 Z" fill="url(#flapOutPat)" opacity="0.10" />

            {/* ── Gold diagonal borders — double line ── */}
            {/* Left edge highlight then main */}
            <path d="M2,0 L270,228" fill="none" stroke={GOLD2} strokeWidth="0.9" opacity="0.6" />
            <path d="M0,0 L270,230" fill="none" stroke={GOLD} strokeWidth="2.8" opacity="0.88" />
            {/* Right edge */}
            <path d="M538,0 L270,228" fill="none" stroke={GOLD2} strokeWidth="0.9" opacity="0.6" />
            <path d="M540,0 L270,230" fill="none" stroke={GOLD} strokeWidth="2.8" opacity="0.88" />

            {/* Inner parallel inset lines */}
            <path d="M16,0 L270,216" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.28" />
            <path d="M524,0 L270,216" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.28" />

            {/* Top edge gold line */}
            <line x1="0" y1="1" x2="540" y2="1" stroke={GOLD} strokeWidth="1.8" opacity="0.45" />
            {/* Second inset top line */}
            <line x1="0" y1="5" x2="540" y2="5" stroke={GOLD} strokeWidth="0.6" opacity="0.22" />
          </svg>

          {/* INSIDE face — full botanical lining revealed when flap opens */}
          <svg
            viewBox="0 0 540 360"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }}
          >
            <BotanicalDefs id="flapInPat" />

            {/* Full botanical pattern on inside */}
            <path d="M0,0 L270,230 L540,0 Z" fill="url(#flapInPat)" />
            {/* Slightly deeper tint to feel "interior" */}
            <path d="M0,0 L270,230 L540,0 Z" fill="rgba(180,130,90,0.07)" />

            {/* Gold border on inside face */}
            <path d="M0,0 L270,230" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.7" />
            <path d="M540,0 L270,230" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.7" />
            <line x1="0" y1="1" x2="540" y2="1" stroke={GOLD} strokeWidth="1.2" opacity="0.45" />
          </svg>
        </motion.div>

        {/* ── WAX SEAL ── */}
        <AnimatePresence>
          {step <= 1 && (
            <motion.div
              className="absolute inset-0 z-40"
              animate={step === 1 ? { y: 200, opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: step === 1 ? 0.6 : 0.2 }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button
                  onClick={handleTapSeal}
                  className="relative w-24 h-24 cursor-pointer drop-shadow-xl pointer-events-auto group"
                >
                  {[1, 2, 3, 4, 5].map((num, index) => (
                    <img
                      key={num}
                      src={`/waxseal-${num}.webp`}
                      alt="Wax Seal"
                      className={clsx(
                        'absolute inset-0 w-full h-full object-contain transition-opacity duration-150',
                        sealTaps === index ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  ))}
                </button>
              </div>

              {sealTaps === 0 && (
                <div className="absolute left-1/2 top-[calc(50%+4.5rem)] -translate-x-1/2">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  >
                    <span className="bg-panel/90 backdrop-blur text-champagne text-xs font-sans uppercase tracking-[0.15em] px-4 py-1.5 rounded-sm border border-gold/20 whitespace-nowrap">
                      Tap on the seal to break it open (4×)
                    </span>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* "Tap to flip" hint */}
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
