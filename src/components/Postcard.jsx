import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function Postcard({ 
  data, 
  isInteractive = true, 
  forceFlip = false,
  onRemoveImage
}) {
  const [isFlipped, setIsFlipped] = useState(forceFlip);

  // Automatically flips the card when the Stepper changes
  useEffect(() => {
    setIsFlipped(forceFlip);
  }, [forceFlip]);

  return (
    <div 
      className="relative w-full aspect-[3/2] perspective-1000 group cursor-pointer"
      onClick={() => isInteractive && setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative transition-shadow duration-500 rounded-lg shadow-card group-hover:shadow-envelope [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 60, damping: 15 }} 
      >
        
        {/* --- FRONT SIDE --- */}
        <div className="absolute inset-0 w-full h-full bg-[#EEDFCD] bg-paper-texture border border-ink/10 rounded-lg [backface-visibility:hidden] flex overflow-hidden">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 font-serif tracking-[0.2em] text-[10px] sm:text-xs text-ink/40 uppercase">
            Postcard
          </div>
          
          <div className="w-[45%] flex items-center justify-center p-2 relative">
             {data?.decoration ? (
               <img 
                 src={data.decoration} 
                 alt="Decoration" 
                 className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm scale-[1.25] sm:scale-[1.35] translate-x-3 sm:translate-x-5 pointer-events-none" 
               />
             ) : (
               <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed border-ink/10 rounded-full flex items-center justify-center text-ink/30 text-xs text-center p-2">Select Flower</div>
             )}
          </div>

          <div className="w-[55%] py-4 pr-4 pl-3 flex flex-col relative">
            <div className="absolute top-3 right-3 w-10 h-12 sm:w-14 sm:h-16 flex items-center justify-center">
               {data?.stamp ? (
                 <img src={data.stamp} alt="Stamp" className="w-full h-full object-contain drop-shadow-md" />
               ) : (
                 <div className="w-full h-full border-2 border-dashed border-ink/10 flex items-center justify-center">
                   <span className="text-ink/20 text-[10px]">Stamp</span>
                 </div>
               )}
            </div>

            <div className="font-serif text-ink/80 text-xs sm:text-sm mt-3 sm:mt-4">
              <p><span className="font-bold">To:</span> {data?.to_name || data?.to || 'Recipient'}</p>
            </div>
            
            <div className="mt-2 flex-1 bg-[linear-gradient(transparent_23px,#2C2A2920_24px)] bg-[length:100%_24px]">
              <p className="font-script text-base leading-[24px] text-ink line-clamp-5 pt-1 pr-2 break-words">
                {data?.message || 'Write something lovely here...'}
              </p>
            </div>
            
            <div className="font-serif text-ink/80 text-xs sm:text-sm mt-1 sm:mt-2">
              <p><span className="font-bold">From:</span> {data?.from_name || data?.from || 'Sender'}</p>
            </div>
          </div>
        </div>

        {/* --- BACK SIDE --- */}
        <div className="absolute inset-0 w-full h-full bg-[#EEDFCD] bg-paper-texture rounded-lg [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-inner p-4 flex flex-col">
          {data?.previewUrl || data?.file_id ? (
            <div className="flex-1 w-full relative overflow-hidden rounded border border-ink/5 group/image">
              
              {/* FIXED: The filter is applied to the <figure> wrapper, exactly as CSSgram requires */}
              <figure className={clsx("w-full h-full m-0", data.image_filter)}>
                <img 
                  src={data?.previewUrl || `/api/image?id=${data.file_id}`} 
                  alt="Postcard attachment"
                  className="w-full h-full object-cover object-center" 
                />
              </figure>

              {/* Discard Button */}
              {isInteractive && onRemoveImage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the card from flipping when clicking the minus button
                    onRemoveImage();
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity z-10 shadow-sm backdrop-blur-sm"
                  title="Remove Image"
                >
                  <span className="font-bold text-xl leading-none mt-[-2px]">-</span>
                </button>
              )}

            </div>
          ) : (
            <div className="flex-1 w-full border-2 border-dashed border-ink/20 rounded bg-white/40 flex flex-col items-center justify-center p-6 text-center">
              <p className="text-sm font-serif italic text-ink/60">Add a photo to the back</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
