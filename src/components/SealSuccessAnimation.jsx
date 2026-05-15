import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// ─── Reuse the same botanical pattern from Envelope ──────────────────────────
function BotanicalDefs({ id }) {
  return (
    <defs>
      <pattern id={id} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <rect width="60" height="60" fill="#EDE5D0" />
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
        <path d="M3 6 Q6.5 2 9 7 Q4 10 3 6Z" fill="#6E9A5F" opacity="0.6" />
        <path d="M6 3 Q10 6 7 9.5 Q3 7 6 3Z" fill="#7FAD6E" opacity="0.45" />
        <path d="M57 6 Q53.5 2 51 7 Q56 10 57 6Z" fill="#6E9A5F" opacity="0.6" />
        <path d="M54 3 Q50 6 53 9.5 Q57 7 54 3Z" fill="#7FAD6E" opacity="0.45" />
        <path d="M3 54 Q6.5 58 9 53 Q4 50 3 54Z" fill="#6E9A5F" opacity="0.6" />
        <path d="M6 57 Q10 54 7 50.5 Q3 53 6 57Z" fill="#7FAD6E" opacity="0.45" />
        <path d="M57 54 Q53.5 58 51 53 Q56 50 57 54Z" fill="#6E9A5F" opacity="0.6" />
        <path d="M54 57 Q50 54 53 50.5 Q57 53 54 57Z" fill="#7FAD6E" opacity="0.45" />
        <ellipse cx="30" cy="4" rx="2" ry="2.8" fill="#D4956A" opacity="0.55" />
        <circle cx="30" cy="4" r="1" fill="#C8A96E" opacity="0.6" />
        <ellipse cx="30" cy="56" rx="2" ry="2.8" fill="#D4956A" opacity="0.55" />
        <circle cx="30" cy="56" r="1" fill="#C8A96E" opacity="0.6" />
        <ellipse cx="4" cy="30" rx="2.8" ry="2" fill="#D4956A" opacity="0.55" />
        <circle cx="4" cy="30" r="1" fill="#C8A96E" opacity="0.6" />
        <ellipse cx="56" cy="30" rx="2.8" ry="2" fill="#D4956A" opacity="0.55" />
        <circle cx="56" cy="30" r="1" fill="#C8A96E" opacity="0.6" />
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

// ─── Sealed mini-envelope SVG ─────────────────────────────────────────────────
function SealedEnvelope() {
  return (
    <svg viewBox="0 0 540 360" className="w-full h-full drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
      <BotanicalDefs id="successPat" />
      <BotanicalDefs id="flapPat" />

      {/* Body */}
      <rect width="540" height="360" rx="4" fill="#EAE5DC" />
      <rect width="540" height="360" rx="4" fill="url(#successPat)" opacity="0.85" />

      {/* Ghost fold lines (inside) */}
      <line x1="0" y1="0" x2="270" y2="220" stroke={GOLD} strokeWidth="1.5" opacity="0.3" />
      <line x1="540" y1="0" x2="270" y2="220" stroke={GOLD} strokeWidth="1.5" opacity="0.3" />

      {/* Bottom flap — outside face */}
      <path d="M0,0 L270,220 L540,0 L540,360 L0,360 Z" fill="#F0EBE1" />
      <path d="M0,0 L270,220 L540,0 L540,360 L0,360 Z" fill="url(#successPat)" opacity="0.10" />

      {/* Bottom V seam gold */}
      <path d="M2,0 L270,218 L538,0" fill="none" stroke={GOLD2} strokeWidth="0.8" opacity="0.55" />
      <path d="M0,0 L270,220 L540,0" fill="none" stroke={GOLD} strokeWidth="2.5" opacity="0.88" />
      <path d="M14,0 L270,208 L526,0" fill="none" stroke={GOLD} strokeWidth="0.7" opacity="0.3" />
      <path d="M0,360 L270,222 L540,360" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.25" />

      {/* Top flap — closed, outside face */}
      <path d="M0,0 L270,230 L540,0 Z" fill="#F0EBE1" />
      <path d="M0,0 L270,230 L540,0 Z" fill="url(#flapPat)" opacity="0.09" />

      {/* Top flap gold borders */}
      <path d="M2,0 L270,228"   fill="none" stroke={GOLD2} strokeWidth="0.9" opacity="0.6" />
      <path d="M0,0 L270,230"   fill="none" stroke={GOLD}  strokeWidth="2.8" opacity="0.88" />
      <path d="M538,0 L270,228" fill="none" stroke={GOLD2} strokeWidth="0.9" opacity="0.6" />
      <path d="M540,0 L270,230" fill="none" stroke={GOLD}  strokeWidth="2.8" opacity="0.88" />
      <path d="M16,0 L270,216"  fill="none" stroke={GOLD}  strokeWidth="0.8" opacity="0.28" />
      <path d="M524,0 L270,216" fill="none" stroke={GOLD}  strokeWidth="0.8" opacity="0.28" />
      <line x1="0" y1="1" x2="540" y2="1" stroke={GOLD} strokeWidth="2" opacity="0.45" />
      <line x1="0" y1="5" x2="540" y2="5" stroke={GOLD} strokeWidth="0.6" opacity="0.22" />

      {/* Perimeter frame */}
      <rect x="1.5" y="1.5" width="537" height="357" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.3" rx="3" />
    </svg>
  );
}

// ─── Falling petal shapes ─────────────────────────────────────────────────────
const PETAL_SHAPES = [
  // terracotta petal
  <ellipse key="p1" cx="0" cy="0" rx="6" ry="12" fill="#C4826A" opacity="0.85" />,
  // sage leaf
  <path key="p2" d="M0,-10 Q8,0 0,10 Q-8,0 0,-10Z" fill="#6E9A5F" opacity="0.75" />,
  // gold dot
  <circle key="p3" cx="0" cy="0" r="4" fill="#C8A96E" opacity="0.9" />,
  // dusty rose petal
  <ellipse key="p4" cx="0" cy="0" rx="5" ry="10" fill="#D4956A" opacity="0.8" />,
  // small leaf
  <path key="p5" d="M0,-7 Q5,0 0,7 Q-5,0 0,-7Z" fill="#7FAD6E" opacity="0.7" />,
  // light gold flake
  <ellipse key="p6" cx="0" cy="0" rx="3" ry="7" fill="#E4CC8A" opacity="0.9" />,
];

function Petal({ x, delay, duration, shape, rotation }) {
  return (
    <motion.g
      initial={{ y: -60, x, opacity: 0, rotate: rotation }}
      animate={{
        y: [null, window.innerHeight + 80],
        x: [null, x + (Math.random() - 0.5) * 160],
        opacity: [0, 1, 1, 0],
        rotate: [rotation, rotation + (Math.random() > 0.5 ? 360 : -360)],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeIn',
        times: [0, 0.1, 0.85, 1],
      }}
    >
      {shape}
    </motion.g>
  );
}

// ─── Gold sparkle burst ───────────────────────────────────────────────────────
function Sparkles({ active }) {
  const sparks = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const dist = 60 + Math.random() * 50;
    return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, delay: Math.random() * 0.3 };
  });

  return (
    <AnimatePresence>
      {active && sparks.map((s, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#E4CC8A] pointer-events-none"
          style={{ left: '50%', top: '50%', translateX: '-50%', translateY: '-50%' }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: s.dx, y: s.dy, opacity: 0, scale: 0 }}
          transition={{ duration: 0.7, delay: s.delay, ease: 'easeOut' }}
        />
      ))}
    </AnimatePresence>
  );
}

// ─── Wax seal stamp animation ─────────────────────────────────────────────────
function WaxSealStamp({ sealSrc, onStamped }) {
  const [phase, setPhase] = useState('idle'); // idle → descending → stamped

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('descending'), 300);
    const t2 = setTimeout(() => { setPhase('stamped'); onStamped?.(); }, 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      {/* The stamper arm coming down */}
      <motion.div
        className="absolute flex flex-col items-center"
        initial={{ y: -120, opacity: 0 }}
        animate={
          phase === 'idle'        ? { y: -120, opacity: 0 } :
          phase === 'descending'  ? { y: 0,    opacity: 1 } :
                                    { y: -120, opacity: 0 }
        }
        transition={{
          duration: phase === 'descending' ? 0.45 : 0.35,
          ease: phase === 'descending' ? [0.2, 0, 0.8, 1] : 'easeIn',
        }}
      >
        {/* Handle */}
        <div className="w-3 h-14 rounded-t-full bg-gradient-to-b from-[#5C3A1E] to-[#3B2010] shadow-lg mb-0" />
        {/* Pad */}
        <div className="w-10 h-4 rounded-sm bg-gradient-to-b from-[#8B2222] to-[#6B1818] shadow-md" />
      </motion.div>

      {/* Seal image — fades in with a scale-pop once stamped */}
      <motion.img
        src={sealSrc}
        alt="Wax Seal"
        className="w-24 h-24 object-contain drop-shadow-2xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={phase === 'stamped' ? { scale: [0, 1.25, 1], opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: 'backOut' }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
// Props:
//   postcardData  — same shape as used in Envelope/Postcard
//   shareUrl      — the URL to copy/share
//   onDone        — callback when user clicks "Go to dashboard" or similar
export default function SealSuccessAnimation({ postcardData, shareUrl, onDone }) {
  const [phase, setPhase]           = useState('envelope-in');  // envelope-in → stamping → sparkling → text-in → done
  const [sparkActive, setSparkActive] = useState(false);
  const [copied, setCopied]          = useState(false);

  // Sequence driver
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('stamping'),  700);
    const t2 = setTimeout(() => { setPhase('sparkling'); setSparkActive(true); }, 1800);
    const t3 = setTimeout(() => setSparkActive(false), 2600);
    const t4 = setTimeout(() => setPhase('text-in'),   2200);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  // Generate petals once
  const [petals] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
      delay: 0.4 + Math.random() * 1.8,
      duration: 2.8 + Math.random() * 2,
      shape: PETAL_SHAPES[i % PETAL_SHAPES.length],
      rotation: Math.random() * 360,
    }))
  );

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-obsidian overflow-hidden">

      {/* ── Falling petals (full screen SVG layer) ── */}
      <AnimatePresence>
        {phase !== 'envelope-in' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {petals.map(p => (
              <Petal key={p.id} {...p} />
            ))}
          </svg>
        )}
      </AnimatePresence>

      {/* ── Ambient radial glow behind envelope ── */}
      <motion.div
        className="absolute w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(200,169,110,0.08) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: phase !== 'envelope-in' ? 1 : 0, scale: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* ── Envelope + seal container ── */}
      <motion.div
        className="relative w-full max-w-md mx-4 aspect-[3/2]"
        initial={{ y: 60, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 55, damping: 14, delay: 0.1 }}
      >
        <SealedEnvelope />

        {/* Seal stamp animation */}
        <WaxSealStamp
          sealSrc="/seal-4.webp"
          onStamped={() => {}}
        />

        {/* Sparkle burst from seal centre */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Sparkles active={sparkActive} />
        </div>

        {/* Gold shimmer sweep across envelope after seal */}
        <AnimatePresence>
          {phase === 'sparkling' && (
            <motion.div
              className="absolute inset-0 rounded-sm pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(228,204,138,0.18) 50%, transparent 70%)',
                backgroundSize: '250% 100%',
              }}
              initial={{ backgroundPosition: '200% 0' }}
              animate={{ backgroundPosition: '-50% 0' }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Success text + actions ── */}
      <AnimatePresence>
        {phase === 'text-in' && (
          <motion.div
            className="flex flex-col items-center mt-10 gap-6 px-6 text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            {/* Headline */}
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C8A96E] mb-2">
                ✦ Sealed with care ✦
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-[#EDE4D4] leading-tight">
                Your card is ready
              </h2>
              {postcardData?.to_name && (
                <p className="font-serif italic text-[#C8A96E]/80 mt-1 text-base">
                  for <span className="text-[#C8A96E]">{postcardData.to_name}</span>
                </p>
              )}
            </div>

            {/* Actions row */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              {/* Copy link */}
              {shareUrl && (
                <motion.button
                  onClick={handleCopy}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-sm border border-[#C8A96E]/35 text-[#C8A96E] font-sans text-xs tracking-[0.15em] uppercase hover:border-[#C8A96E]/70 hover:bg-[#C8A96E]/5 transition-all duration-200"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy link
                    </>
                  )}
                </motion.button>
              )}

              {/* Done / dashboard */}
              <motion.button
                onClick={onDone}
                whileTap={{ scale: 0.96 }}
                className="flex-1 px-5 py-3 rounded-sm bg-[#C8A96E] text-[#1A1610] font-sans text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#D4B87A] transition-colors duration-200 shadow-lg shadow-[#C8A96E]/20"
              >
                View dashboard
              </motion.button>
            </div>

            {/* Subtle divider line */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C8A96E]/30 to-transparent mt-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
