import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import clsx from 'clsx'; 

export default function Postcard({ 
  data, 
  isInteractive = true, 
  forceFlip = false,
  onImageSelect // New prop to handle image uploads directly from the back of the card
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const currentFlipState = isInteractive ? isFlipped : forceFlip;
  const fileInputRef = useRef(null);

  // Auto-cropping happens via Tailwind's 'object-cover' utility
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className="relative w-full max-w-lg aspect-[3/2] perspective-1000 group"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="w-full h-full relative transition-shadow duration-500 rounded-lg shadow-card group-hover:shadow-envelope [transform-style:preserve-3d]"
        animate={{ rotateY: currentFlipState ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 60, damping: 15 }} 
      >
        
        {/* --- FRONT SIDE --- */}
        <div 
          className="absolute inset-0 w-full h-full bg-[#FDFBF7] bg-paper-texture border border-ink/10 rounded-lg [backface-visibility:hidden] flex overflow-hidden cursor-pointer"
          onClick={() => isInteractive && setIsFlipped(true)}
        >
          {/* Header Title */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 font-serif tracking-[0.2em] text-xs text-ink/40 uppercase z-10">
            Postcard
          </div>
          
          {/* Left Side: Image Decoration (No dotted line) */}
          <div className="w-1/2 flex items-center justify-center bg-pastel-blue/5 p-8 relative">
             {data?.decoration ? (
               <img src={data.decoration} alt="Decoration" className="w-full h-full object-contain opacity-80 mix-blend-multiply" />
             ) : (
               <div className="w-24 h-24 border-2 border-dashed border-ink/10 rounded-full flex items-center justify-center text-ink/30 text-xs text-center p-2">Select Flower</div>
             )}
          </div>

          {/* Right Side: Message & Details */}
          <div className="w-1/2 p-6 flex flex-col relative">
            <div className="absolute top-4 right-4 w-12 h-14 shadow-sm flex items-center justify-center bg-white border border-ink/10">
               {data?.stamp ? <img src={data.stamp} alt="Stamp" className="w-full h-full object-cover" /> : <span className="text-ink/20 text-xs">Stamp</span>}
            </div>

            <div className="font-serif text-ink/80 text-sm mt-4">
              <p><span className="font-bold">To:</span> {data?.to || 'Recipient'}</p>
            </div>

            {/* Message Area: Adjusted to 5 lines, smaller text */}
            <div className="mt-4 flex-1 bg-[linear-gradient(transparent_23px,#2C2A2920_24px)] bg-[length:100%_24px]">
              <p className="font-script text-lg leading-[24px] text-ink line-clamp-5 pt-1">
                {data?.message || 'Write something lovely here...'}
              </p>
            </div>

            {/* Shifted From to bottom right */}
            <div className="font-serif text-ink/80 text-sm text-right mt-2">
              <p><span className="font-bold">From:</span> {data?.from || 'Sender'}</p>
            </div>
          </div>
        </div>

        {/* --- BACK SIDE (Image & Upload) --- */}
        <div className="absolute inset-0 w-full h-full bg-[#FDFBF7] bg-paper-texture rounded-lg [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden shadow-inner p-4 flex flex-col">
          
          {data?.previewUrl || data?.file_id ? (
            <div 
              className="flex-1 w-full relative overflow-hidden rounded cursor-pointer"
              onClick={() => isInteractive && setIsFlipped(false)}
            >
              <img 
                src={data?.previewUrl || `/api/image?id=${data.file_id}`} 
                alt="Postcard attachment"
                className="w-full h-full object-cover object-center" /* object-cover handles the auto-cropping */
              />
            </div>
          ) : (
            <div className="flex-1 w-full border-2 border-dashed border-ink/20 rounded bg-white/50 flex flex-col items-center justify-center gap-4">
              <p className="text-sm font-sans text-ink/60 mb-2">Add a photo to the back</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-pastel-blue/20 hover:bg-pastel-blue/40 text-ink px-4 py-2 rounded-full transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" /> Upload
                </button>
                {/* For mobile, adding capture="environment" triggers the camera */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-pastel-pink/20 hover:bg-pastel-pink/40 text-ink px-4 py-2 rounded-full transition-colors text-sm font-medium"
                >
                  <Camera className="w-4 h-4" /> Camera
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <button onClick={() => setIsFlipped(false)} className="mt-4 text-xs text-ink/40 underline">Cancel flip</button>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
