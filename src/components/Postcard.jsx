import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';

export default function Postcard({ 
  data, 
  isInteractive = true, 
  forceFlip = false,
  onImageSelect 
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const currentFlipState = isInteractive ? isFlipped : forceFlip;
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0] && onImageSelect) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className="relative w-full max-w-lg aspect-[3/2] perspective-1000 group cursor-pointer"
      onClick={() => isInteractive && setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative transition-shadow duration-500 rounded-lg shadow-card group-hover:shadow-envelope [transform-style:preserve-3d]"
        animate={{ rotateY: currentFlipState ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 60, damping: 15 }} 
      >
        
        {/* --- FRONT SIDE --- */}
        <div className="absolute inset-0 w-full h-full bg-[#EEDFCD] bg-paper-texture border border-ink/10 rounded-lg [backface-visibility:hidden] flex overflow-hidden">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 font-serif tracking-[0.2em] text-xs text-ink/40 uppercase z-10">
            Postcard
          </div>
          
          {/* FLOWERS FIXED: Removed opacity restrictions so they show full color */}
          <div className="w-1/2 flex items-center justify-center bg-pastel-blue/5 p-2 relative">
             {data?.decoration ? (
               <img src={data.decoration} alt="Decoration" className="w-full h-full object-contain drop-shadow-sm" />
             ) : (
               <div className="w-24 h-24 border-2 border-dashed border-ink/10 rounded-full flex items-center justify-center text-ink/30 text-xs text-center p-2">Select Flower</div>
             )}
          </div>

          <div className="w-1/2 p-6 flex flex-col relative">
            <div className="absolute top-4 right-4 w-12 h-14 shadow-sm flex items-center justify-center bg-white border border-ink/10">
               {data?.stamp ? <img src={data.stamp} alt="Stamp" className="w-full h-full object-cover" /> : <span className="text-ink/20 text-xs">Stamp</span>}
            </div>
            <div className="font-serif text-ink/80 text-sm mt-4">
              <p><span className="font-bold">To:</span> {data?.to_name || data?.to || 'Recipient'}</p>
            </div>
            <div className="mt-4 flex-1 bg-[linear-gradient(transparent_23px,#2C2A2920_24px)] bg-[length:100%_24px]">
              <p className="font-script text-lg leading-[24px] text-ink line-clamp-5 pt-1">
                {data?.message || 'Write something lovely here...'}
              </p>
            </div>
            <div className="font-serif text-ink/80 text-sm text-right mt-2">
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
            <div 
              className="flex-1 w-full border-2 border-dashed border-ink/20 rounded bg-white/40 flex flex-col items-center justify-center gap-6"
              onClick={(e) => e.stopPropagation()} 
            >
              <p className="text-sm font-sans text-ink/60">Add a photo to the back</p>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-white/80 border border-ink/10 hover:bg-white text-ink px-4 py-2 rounded-full transition-colors text-sm font-medium shadow-sm"
                >
                  <Upload className="w-4 h-4" /> Upload
                </button>
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />

                {/* Camera button properly triggers */}
                <button 
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-2 bg-white/80 border border-ink/10 hover:bg-white text-ink px-4 py-2 rounded-full transition-colors text-sm font-medium shadow-sm"
                >
                  <Camera className="w-4 h-4" /> Camera
                </button>
                <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
