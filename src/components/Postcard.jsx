import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

// Line-height map matching each font-size class so lines fill the ruled area exactly
const LINE_HEIGHT = {
  'text-base': 'leading-[24px]',
  'text-xl':   'leading-[24px]',
  'text-2xl':  'leading-[28px]',
  'text-3xl':  'leading-[32px]',
};

export default function Postcard({ data, isInteractive = true, forceFlip = false, onRemoveImage }) {
  const [isFlipped, setIsFlipped] = useState(forceFlip);
  useEffect(() => setIsFlipped(forceFlip), [forceFlip]);

  const fontSize  = data?.font_size || 'text-2xl';
  const lineH     = LINE_HEIGHT[fontSize] || 'leading-[28px]';

  return (
    <div
      className="relative w-full aspect-[3/2] perspective-1000 group cursor-pointer"
      onClick={() => isInteractive && setIsFlipped(f => !f)}
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 60, damping: 15 }}
      >
        {/* ── FRONT ── */}
        <div className="absolute inset-0 bg-[#EEDFCD] bg-paper-texture border border-ink/10 rounded-sm [backface-visibility:hidden] flex overflow-hidden shadow-card group-hover:shadow-envelope transition-shadow duration-500">
          {/* Letterpress header */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 font-serif tracking-[0.35em] text-[9px] sm:text-[10px] text-ink/35 uppercase whitespace-nowrap">
            Postcard
          </div>
          <div className="absolute top-6 left-4 right-4 h-px bg-gradient-to-r from-transparent via-ink/15 to-transparent" />

          {/* Floral side */}
          <div className="w-[45%] flex items-center justify-center p-2 relative overflow-hidden">
            {data?.decoration ? (
              <img src={data.decoration} alt="Decoration"
                className="w-full h-full object-contain mix-blend-multiply scale-[1.3] sm:scale-[1.4] translate-x-3 sm:translate-x-5 pointer-events-none" />
            ) : (
              <div className="w-20 h-20 border border-dashed border-ink/15 rounded-full flex items-center justify-center text-ink/30 text-[10px] text-center p-2">
                Select Flower
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="absolute top-8 bottom-3 left-[45%] w-px bg-ink/10" />

          {/* Right — address + message */}
          <div className="w-[55%] py-4 pr-3 pl-2 flex flex-col relative">
            {/* Stamp */}
            <div className="absolute top-2 right-2 w-10 h-12 sm:w-12 sm:h-14">
              {data?.stamp
                ? <img src={data.stamp} alt="Stamp" className="w-full h-full object-contain drop-shadow-md" />
                : <div className="w-full h-full border border-dashed border-ink/15 flex items-center justify-center"><span className="text-ink/20 text-[8px] font-serif">Stamp</span></div>
              }
            </div>

            {/* To */}
            <div className="font-serif text-ink/70 text-[11px] sm:text-xs pt-1 pr-10">
              <span className="font-bold italic">To </span>
              <span className="font-medium">{data?.to_name || data?.to || 'Recipient'}</span>
            </div>

            {/* Ruled message area — fills all remaining space */}
            <div className={clsx(
              "flex-1 mt-1 overflow-hidden",
              // ruled lines at the line-height interval
              fontSize === 'text-base' ? "bg-[linear-gradient(transparent_23px,#2C2A2918_24px)] bg-[length:100%_24px]"
              : fontSize === 'text-xl'  ? "bg-[linear-gradient(transparent_23px,#2C2A2918_24px)] bg-[length:100%_24px]"
              : fontSize === 'text-2xl' ? "bg-[linear-gradient(transparent_27px,#2C2A2918_28px)] bg-[length:100%_28px]"
              :                           "bg-[linear-gradient(transparent_31px,#2C2A2918_32px)] bg-[length:100%_32px]"
            )}>
              <p className={clsx(
                "font-script text-ink break-words pr-1",
                fontSize,
                lineH,
                // no line-clamp — let it fill all lines naturally
              )}>
                {data?.message || 'Write something lovely here…'}
              </p>
            </div>

            {/* From */}
            <div className="font-serif text-ink/70 text-[11px] sm:text-xs mt-1">
              <span className="font-bold italic">From </span>
              <span className="font-medium">{data?.from_name || data?.from || 'Sender'}</span>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div className="absolute inset-0 bg-[#EEDFCD] bg-paper-texture rounded-sm [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden p-3 flex flex-col shadow-card group-hover:shadow-envelope transition-shadow duration-500">
          {data?.previewUrl || data?.file_id ? (
            <div className="flex-1 w-full relative overflow-hidden rounded-sm border border-ink/10 group/image">
              <figure className={clsx('w-full h-full m-0', data.image_filter)}>
                <img
                  src={data?.previewUrl || `/api/image?id=${data.file_id}`}
                  alt="Postcard attachment"
                  className="w-full h-full object-cover object-center"
                />
              </figure>
              {isInteractive && onRemoveImage && (
                <button
                  onClick={e => { e.stopPropagation(); onRemoveImage(); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity z-10 text-sm font-medium"
                >×</button>
              )}
            </div>
          ) : (
            <div className="flex-1 border border-dashed border-ink/20 rounded-sm bg-white/30 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-sm font-serif italic text-ink/50">Add a photo to the back</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
