import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Postcard({ 
  data, 
  isInteractive = true, 
  forceFlip = false
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const currentFlipState = isInteractive ? isFlipped : forceFlip;

  return (
    <div 
      className="relative w-full aspect-[3/2] perspective-1000 group cursor-pointer"
      onClick={() => isInteractive && setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative transition-shadow duration-500 rounded-lg shadow-card group-hover:shadow-envelope [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: currentFlipState ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 60, damping: 15 }} 
      >
        
        {/* --- FRONT SIDE --- */}
        <div className="absolute inset-0 w-full h-full bg-[#EEDFCD] bg-paper-texture border border-ink/10 rounded-lg [backface-visibility:hidden] flex overflow-hidden">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 font-serif tracking-[0.2em] text-[10px] sm:text-xs text-ink/40 uppercase z-20">
            Postcard
          </div>
          
          {/* ADDED z-10: Forces the flower container to stack above the message area */}
          <div className="w-[45%] flex items-center justify-center bg-pastel-blue/5 p-2 relative z-10">
             {data?.decoration ? (
               /* ADDED scale and translate-x: Makes the flower physically larger and pushes it to the right over the message space */
               <img 
                 src={data.decoration} 
                 alt="Decoration" 
                 className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm scale-[1.25] sm:scale-[1.35] translate-x-3 sm:translate-x-5 pointer-events-none" 
               />
             ) : (
               <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed border-ink/10 rounded-full flex items-center justify-center text-ink/30 text-xs text-center p-2">Select Flower</div>
             )}
          </div>

          {/* Message Area (w-[55%]) remains structurally the same underneath */}
          <div className="w-[55%] py-4 pr-4 pl-3 flex flex-col relative z-0">
            <div className="absolute top-3 right-3 w-10 h-12 sm:w-14 sm:h-16 flex items-center justify-center z-10">
               {data?.stamp ? (
                 <img src={data.stamp} alt="Stamp" className="w-full h-full object-contain drop-shadow-md" />
               ) : (
                 <div className="w-full h-full border-2 border-dashed border-ink/10 flex items-center justify-center">
                   <span className="text-ink/20 text-[10px]">Stamp</span>
                 </div>
               )}
            </div>

            <div className="font-serif text-ink/80 text-xs sm:text-sm mt-3 sm:mt-4 relative z-20">
              <p><span className="font-bold">To:</span> {data?.to_name || data?.to || 'Recipient'}</p>
            </div>
            
            <div className="mt-2 flex-1 bg-[linear-gradient(transparent_23px,#2C2A2920_24px)] bg-[length:100%_24px]">
              <p className="font-script text-base leading-[24px] text-ink line-clamp-5 pt-1 pr-2 break-words relative z-20">
                {data?.message || 'Write something lovely here...'}
              </p>
            </div>
            
            <div className="font-serif text-ink/80 text-xs sm:text-sm mt-1 sm:mt-2 relative z-20">
              <p><span className="font-bold">From:</span> {data?.from_name || data?.from || 'Sender'}</p>
            </div>
          </div>
        </div>

        {/* --- BACK SIDE --- */}
        <div className="absolute inset-0 w-full h-full bg-[#EEDFCD] bg-paper-texture rounded-lg [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-inner p-4 flex flex-col">
          {data?.previewUrl || data?.file_id ? (
            <div className="flex-1 w-full relative overflow-hidden rounded border border-ink/5">
              <img 
                src={data?.previewUrl || `/api/image?id=${data.file_id}`} 
                alt="Postcard attachment"
                className="w-full h-full object-cover object-center" 
              />
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
