import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function Postcard({
  data,
  isInteractive = true,
  forceFlip = false,
  onRemoveImage,
  showShadow = true
}) {
  const [isFlipped, setIsFlipped] = useState(forceFlip);

  useEffect(() => {
    setIsFlipped(forceFlip);
  }, [forceFlip]);

  return (
    <div
      className="relative w-full aspect-[3/2] perspective-1000 group cursor-pointer"
      onClick={() => isInteractive && setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative rounded-sm [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 60, damping: 15 }}
      >
        
        {/* FRONT SIDE */}
        <div className={clsx(
          "absolute inset-0 w-full h-full bg-[#EEDFCD] bg-paper-texture border border-ink/10 rounded-sm [backface-visibility:hidden] flex overflow-hidden transition-shadow duration-500",
          showShadow && "shadow-card group-hover:shadow-envelope"
        )}>
          {/* Letterpress "POSTCARD" header */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 font-serif tracking-[0.35em] text-[9px] sm:text-[10px] text-ink/35 uppercase">
            Postcard
          </div>

          {/* Thin gold rule */}
          <div className="absolute top-6 left-4 right-4 h-px bg-gradient-to-r from-transparent via-ink/15 to-transparent" />

          {/* Floral decoration */}
          <div className="w-[45%] flex items-center justify-center p-2 relative">
            {data?.decoration ? (
              <img
                src={data.decoration}
                alt="Decoration"
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm scale-[1.3] sm:scale-[1.4] translate-x-3 sm:translate-x-5 pointer-events-none"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 border border-dashed border-ink/15 rounded-full flex items-center justify-center text-ink/30 text-xs text-center p-2">
                Select Flower
              </div>
            )}
          </div>

          {/* Divider line */}
          <div className="absolute top-8 bottom-3 left-[45%] w-px bg-ink/10" />

          {/* Right side: address & message */}
          <div className="w-[55%] py-5 pr-4 pl-3 flex flex-col relative">
            {/* Stamp */}
            <div className="absolute top-3 right-2.5 w-10 h-12 sm:w-14 sm:h-16 flex items-center justify-center">
              {data?.stamp ? (
                <img src={data.stamp} alt="Stamp" className="w-full h-full object-contain drop-shadow-md" />
              ) : (
                <div className="w-full h-full border border-dashed border-ink/15 flex items-center justify-center">
                  <span className="text-ink/20 text-[9px] font-serif">Stamp</span>
                </div>
              )}
            </div>

            <div className="font-serif text-ink/70 text-xs sm:text-[13px] mt-3 sm:mt-4 pr-12">
              <p><span className="font-bold italic">To</span> <span className="font-medium">{data?.to_name || data?.to || 'Recipient'}</span></p>
            </div>

            {/* Ruled lines */}
            <div className="mt-2 flex-1 bg-[linear-gradient(transparent_23px,#2C2A2918_24px)] bg-[length:100%_24px]">
              <p className="font-script text-base leading-[24px] text-ink line-clamp-5 pt-1 pr-2 break-words">
                {data?.message || 'Write something lovely here…'}
              </p>
            </div>

            <div className="font-serif text-ink/70 text-xs sm:text-[13px] mt-1">
              <p><span className="font-bold italic">From</span> <span className="font-medium">{data?.from_name || data?.from || 'Sender'}</span></p>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className={clsx(
          "absolute inset-0 w-full h-full bg-[#EEDFCD] bg-paper-texture rounded-sm [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden p-3 flex flex-col transition-shadow duration-500",
          showShadow && "shadow-card group-hover:shadow-envelope"
        )}>
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
                  onClick={(e) => { e.stopPropagation(); onRemoveImage(); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity z-10 shadow-sm backdrop-blur-sm text-sm font-medium"
                  title="Remove Image"
                >
                  ×
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 w-full border border-dashed border-ink/20 rounded-sm bg-white/30 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-sm font-serif italic text-ink/50">Add a photo to the back</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
