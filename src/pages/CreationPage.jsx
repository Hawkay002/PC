import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2, Copy } from 'lucide-react';
import clsx from 'clsx';
import Postcard from '../components/Postcard';
import { createPostcard } from '../lib/supabase';

// --- Assets Configuration ---
const FLOWERS = [
  { id: 'anemone', name: 'Japanese Anemone', img: '/flowers/anemone.png' },
  { id: 'lily', name: 'Oriental Lily', img: '/flowers/lily.png' },
  { id: 'sunflower', name: 'Sunflower', img: '/flowers/sunflower.png' },
  { id: 'marigold', name: 'French Marigold', img: '/flowers/marigold.png' },
  { id: 'magnolia', name: 'Magnolia Grandiflora', img: '/flowers/magnolia.png' },
  { id: 'hibiscus', name: 'Scarlet Hibiscus', img: '/flowers/hibiscus.png' },
  { id: 'daffodil', name: 'Daffodil', img: '/flowers/daffodil.png' },
  { id: 'dicentra', name: 'Dicentra', img: '/flowers/dicentra.png' },
  { id: 'wisteria', name: 'Wisteria', img: '/flowers/wisteria.png' },
  { id: 'peony', name: 'Peony', img: '/flowers/peony.png' },
  { id: 'carnation', name: 'Carnation', img: '/flowers/carnation.png' },
  { id: 'iris', name: 'Bearded Iris', img: '/flowers/iris.png' },
  { id: 'orchid', name: 'Orchid', img: '/flowers/orchid.png' },
  { id: 'bird', name: 'Bird of Paradise', img: '/flowers/bird-of-paradise.png' },
  { id: 'poppy', name: 'Red Poppy', img: '/flowers/poppy.png' },
  { id: 'cosmos', name: 'Purple Cosmos', img: '/flowers/cosmos.png' }
];

const STAMPS = [
  { id: 'stamp1', name: 'Classic Airmail', img: '/stamps/stamp1.png' },
  { id: 'stamp2', name: 'Vintage Rose', img: '/stamps/stamp2.png' },
  { id: 'stamp3', name: 'Gold Leaf', img: '/stamps/stamp3.png' },
  { id: 'stamp4', name: 'Blue Ocean', img: '/stamps/stamp4.png' }
];

export default function CreationPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSealingAnim, setShowSealingAnim] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  // 7-Step Sequence State for the Packing Animation
  const [packStep, setPackStep] = useState(0); 

  // Postcard State
  const [formData, setFormData] = useState({
    to: '',
    from: '',
    message: '',
    font: 'script',
    decoration: FLOWERS[0].img, 
    stamp: STAMPS[0].img,       
  });
  
  // Image State
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please click the card to flip it and add a photo!");
    if (!formData.message) return alert("Please write a message!");
    
    setIsSubmitting(true);
    try {
      // 1. Compress Image
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1200, useWebWorker: true };
      const compressedFile = await imageCompression(imageFile, options);
      
      // 2. Convert to Base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => resolve(reader.result);
      });

      // 3. Upload to Telegram Proxy
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });
      
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error);

      // 4. Save to Supabase
      const postcardId = await createPostcard({ ...formData, file_id: uploadData.file_id });

      // 5. Save locally for Dashboard
      const savedCards = JSON.parse(localStorage.getItem('my_postcards') || '[]');
      savedCards.push({ id: postcardId, to: formData.to, date: new Date().toISOString() });
      localStorage.setItem('my_postcards', JSON.stringify(savedCards));

      // 6. Trigger Orchestration Overlay Sequence
      setGeneratedLink(`${window.location.origin}/card/${postcardId}`);
      setShowSealingAnim(true);
      
      // Sequence the steps
      setTimeout(() => setPackStep(1), 100);    // Card centers
      setTimeout(() => setPackStep(2), 1000);   // Envelope drops down
      setTimeout(() => setPackStep(3), 1800);   // Flap opens
      setTimeout(() => setPackStep(4), 2600);   // Card slides up
      setTimeout(() => setPackStep(5), 3400);   // Card slides down into envelope
      setTimeout(() => setPackStep(6), 4200);   // Flap closes
      setTimeout(() => setPackStep(7), 5000);   // Link UI appears

    } catch (error) {
      console.error(error);
      alert("Failed to send postcard: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8 items-start min-h-screen relative">
        
        {/* --- LEFT: The Live 3D Preview (Sticky) --- */}
        <div className="w-full lg:w-[45%] lg:sticky lg:top-12 self-start flex flex-col items-center pt-4 z-10">
          <Postcard 
            data={{ ...formData, previewUrl }} 
            onImageSelect={(file) => {
              setPreviewUrl(URL.createObjectURL(file));
              setImageFile(file);
            }}
          />
          {!imageFile && (
            <p className="mt-8 text-sm text-pastel-blue font-semibold animate-pulse text-center">
              Click the card to flip it and add your photo!
            </p>
          )}
        </div>

        {/* --- RIGHT: The Scrollable Controls --- */}
        <div className="w-full lg:w-[55%] bg-white rounded-xl shadow-sm border border-ink/5 p-6 lg:p-8 relative z-0">
          <h1 className="font-serif text-3xl font-bold mb-8 text-ink">Craft your postcard</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Text Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-ink/60 mb-2">To</label>
                <input 
                  type="text" required maxLength={30} placeholder="Recipient Name"
                  className="w-full bg-pastel-blue/5 border border-ink/10 rounded-md p-3 focus:outline-none focus:border-pastel-blue transition-colors text-ink"
                  value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-ink/60 mb-2">From</label>
                <input 
                  type="text" required maxLength={30} placeholder="Your Name"
                  className="w-full bg-pastel-blue/5 border border-ink/10 rounded-md p-3 focus:outline-none focus:border-pastel-blue transition-colors text-ink"
                  value={formData.from} onChange={e => setFormData({...formData, from: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-ink/60 mb-2">Message</label>
              <textarea 
                required rows={5} maxLength={200} placeholder="Write something lovely..."
                className="w-full bg-pastel-blue/5 border border-ink/10 rounded-md p-3 focus:outline-none focus:border-pastel-blue font-script text-2xl resize-none transition-colors text-ink"
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
              />
            </div>

            {/* Stamp Selector */}
            <div className="border-t border-ink/5 pt-6">
              <label className="block text-xs font-semibold uppercase text-ink/60 mb-4">Select Stamp</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STAMPS.map((stamp) => (
                  <button
                    key={stamp.id}
                    type="button"
                    onClick={() => setFormData({...formData, stamp: stamp.img})}
                    className={clsx(
                      "flex flex-col items-center p-2 rounded-lg border-2 transition-all",
                      formData.stamp === stamp.img ? "border-pastel-blue bg-pastel-blue/5 shadow-sm" : "border-transparent hover:bg-gray-50"
                    )}
                  >
                    <div className="w-10 h-12 bg-gray-100 shadow-sm border border-white mb-2 overflow-hidden">
                      <img src={stamp.img} alt={stamp.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] text-center leading-tight text-ink/70 font-medium">{stamp.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Decoration Selector */}
            <div className="border-t border-ink/5 pt-6">
              <label className="block text-xs font-semibold uppercase text-ink/60 mb-4">Select Flower Decoration</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {FLOWERS.map((flower) => (
                  <button
                    key={flower.id}
                    type="button"
                    onClick={() => setFormData({...formData, decoration: flower.img})}
                    className={clsx(
                      "flex flex-col items-center p-3 rounded-lg border-2 transition-all",
                      formData.decoration === flower.img ? "border-pastel-pink bg-pastel-pink/10 shadow-sm" : "border-transparent hover:bg-gray-50"
                    )}
                  >
                    <img src={flower.img} alt={flower.name} className="w-12 h-12 object-contain mb-2 drop-shadow-sm" />
                    <span className="text-[10px] text-center leading-tight text-ink/70 font-medium">{flower.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-ink/5 pt-8 pb-4">
              <button 
                type="submit" 
                disabled={isSubmitting || !imageFile}
                className="w-full bg-ink text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-ink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                {isSubmitting ? 'Sealing envelope...' : 'Send Postcard'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- THE FULL SCREEN ORCHESTRATION ANIMATION OVERLAY --- */}
      <AnimatePresence>
        {showSealingAnim && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDFBF7] p-4 overflow-hidden"
          >
            {/* The Orchestration Stage */}
            <div className="relative flex items-center justify-center w-full max-w-xl h-[600px] perspective-1000">
              
              {/* 1. Envelope Body (Starts off screen top) */}
              <motion.div 
                className="absolute w-[540px] h-[360px] bg-[#F4F1EB] shadow-envelope flex items-center justify-center border border-ink/10 rounded-b-md"
                initial={{ y: '-100vh', zIndex: 0 }}
                animate={{ y: packStep >= 2 ? 0 : '-100vh' }}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
              >
                {/* Envelope Flap */}
                <motion.svg
                  className="absolute top-0 left-0 w-full h-[180px] z-30 origin-top drop-shadow-sm"
                  viewBox="0 0 540 180"
                  animate={{ rotateX: (packStep >= 3 && packStep < 6) ? 180 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <path d="M0,0 L270,180 L540,0 Z" fill="#EAE5DC" stroke="rgba(44,42,41,0.05)" />
                </motion.svg>

                {/* The Front Pocket */}
                <div 
                  className="absolute bottom-0 left-0 w-full h-[240px] bg-[#F4F1EB] rounded-b-md z-20 border-t border-white/50"
                  style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 50% 20%, 0 0)' }}
                />
              </motion.div>

              {/* 2. The Postcard */}
              <motion.div
                className="absolute w-[512px]"
                initial={{ scale: 0.8, opacity: 0, zIndex: 10 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: packStep === 4 ? -250 : (packStep >= 5 ? 20 : 0),
                  // Drop Z-index so it slides INSIDE the front pocket at step 5
                  zIndex: packStep >= 5 ? 10 : 40 
                }}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
              >
                <Postcard data={{ ...formData, previewUrl }} isInteractive={false} forceFlip={false} />
              </motion.div>

            </div>

            {/* 3. The Final Link UI (Fades in at step 7) */}
            <AnimatePresence>
              {packStep === 7 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-12 bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-md w-full border border-ink/5"
                >
                  <h2 className="font-serif text-3xl font-bold mb-2 text-ink">Signed & Sealed!</h2>
                  <p className="text-ink/60 mb-6 font-sans">Share this unique link.</p>
                  
                  <div className="flex w-full gap-2 mb-6 relative z-10">
                    <input 
                      type="text" readOnly value={generatedLink} 
                      className="flex-1 bg-gray-50 border border-ink/10 rounded-lg px-4 py-3 text-sm outline-none text-ink/70 truncate"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="bg-ink text-white px-5 py-3 rounded-lg font-semibold hover:bg-ink/90 transition-colors flex items-center gap-2"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <button onClick={() => navigate('/dashboard')} className="text-sm font-semibold text-ink underline hover:text-pastel-blue transition-colors">
                    Go to your Outbox
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
