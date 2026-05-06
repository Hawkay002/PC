import { useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2, Copy, ArrowRight, ArrowLeft, Inbox, Upload, Camera } from 'lucide-react';
import clsx from 'clsx';
import Postcard from '../components/Postcard';
import { createPostcard } from '../lib/supabase';
import getCroppedImg from '../utils/cropImage';

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
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  
  // Stepper State
  const [currentStep, setCurrentStep] = useState(1);
  
  // Global States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSealingAnim, setShowSealingAnim] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [packStep, setPackStep] = useState(0); 

  // Form Data
  const [formData, setFormData] = useState({
    to: '', from: '', message: '', font: 'script',
    decoration: FLOWERS[0].img, stamp: STAMPS[0].img,       
  });
  
  // Cropper & Image States
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleRawImageSelect = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => setRawImageSrc(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSaveCrop = async () => {
    try {
      const croppedImageFile = await getCroppedImg(rawImageSrc, croppedAreaPixels);
      setPreviewUrl(URL.createObjectURL(croppedImageFile));
      setImageFile(croppedImageFile);
      setRawImageSrc(null); // Close modal
    } catch (e) {
      console.error(e);
    }
  };

  const submitPostcard = async () => {
    if (!imageFile) return alert("Please add a photo!");
    if (!formData.message) return alert("Please write a message!");
    
    setIsSubmitting(true);
    try {
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1200, useWebWorker: true };
      const compressedFile = await imageCompression(imageFile, options);
      
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => resolve(reader.result);
      });

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });
      
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error);

      const postcardId = await createPostcard({ ...formData, file_id: uploadData.file_id });

      const savedCards = JSON.parse(localStorage.getItem('my_postcards') || '[]');
      savedCards.push({ id: postcardId, to: formData.to, date: new Date().toISOString() });
      localStorage.setItem('my_postcards', JSON.stringify(savedCards));

      setGeneratedLink(`${window.location.origin}/card/${postcardId}`);
      setShowSealingAnim(true);
      
      // Choreography
      setTimeout(() => setPackStep(1), 100);    
      setTimeout(() => setPackStep(2), 1200);   
      setTimeout(() => setPackStep(3), 2000);   
      setTimeout(() => setPackStep(4), 2800);   
      setTimeout(() => setPackStep(5), 3600);   
      setTimeout(() => setPackStep(6), 4400);   

    } catch (error) {
      console.error(error);
      alert("Failed to send: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Background container */}
      <div className="bg-[#FDFBF7] min-h-screen">
        <div className="max-w-7xl mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* --- LEFT: Sticky Preview (Mobile & Desktop) --- */}
          <div className="w-full lg:w-[45%] sticky top-0 lg:top-8 bg-[#FDFBF7]/95 backdrop-blur-sm z-20 pb-4 pt-2 self-start flex flex-col items-center border-b lg:border-none border-ink/5">
            
            {/* Header & Outbox Link */}
            <div className="w-full flex items-center justify-between mb-4 lg:mb-8 px-2">
              <h1 className="font-serif text-2xl font-bold text-ink">Postcard Studio</h1>
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-ink/60 hover:text-pastel-blue transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-ink/5">
                <Inbox className="w-4 h-4" /> Outbox
              </Link>
            </div>

            <Postcard 
              data={{ ...formData, previewUrl }} 
              isInteractive={false}
              forceFlip={currentStep === 2} 
            />
          </div>

          {/* --- RIGHT: Scrollable Stepper Form --- */}
          <div className="w-full lg:w-[55%] bg-white rounded-xl shadow-sm border border-ink/5 p-6 relative z-0 flex flex-col h-[550px] lg:h-[650px] lg:mt-16">
            
            {/* Fixed Stepper Header */}
            <div className="shrink-0 flex items-center justify-between mb-6 border-b border-ink/5 pb-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className={clsx(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors",
                  currentStep === num ? "bg-ink text-white" : currentStep > num ? "bg-pastel-blue/20 text-ink" : "bg-gray-100 text-gray-400"
                )}>
                  {num}
                </div>
              ))}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin pr-2">
              
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h2 className="font-serif text-2xl text-ink">Write your message</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-ink/60 mb-2">To</label>
                      <input type="text" maxLength={30} className="w-full bg-pastel-blue/5 border border-ink/10 rounded-md p-3 text-ink" value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-ink/60 mb-2">From</label>
                      <input type="text" maxLength={30} className="w-full bg-pastel-blue/5 border border-ink/10 rounded-md p-3 text-ink" value={formData.from} onChange={e => setFormData({...formData, from: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-ink/60 mb-2">Message</label>
                    <textarea rows={5} maxLength={200} className="w-full bg-pastel-blue/5 border border-ink/10 rounded-md p-3 font-script text-2xl resize-none text-ink" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center justify-center py-12 space-y-8">
                  <div className="text-center">
                    <h2 className="font-serif text-2xl text-ink mb-2">Attach a Memory</h2>
                    <p className="text-ink/60 text-sm">Upload a photo for the back of your postcard.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 bg-pastel-blue/10 hover:bg-pastel-blue/20 text-ink py-4 rounded-xl transition-colors font-medium border border-ink/5">
                      <Upload className="w-5 h-5" /> Upload File
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleRawImageSelect(e.target.files[0])} />

                    <button onClick={() => cameraInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 bg-pastel-pink/10 hover:bg-pastel-pink/20 text-ink py-4 rounded-xl transition-colors font-medium border border-ink/5">
                      <Camera className="w-5 h-5" /> Camera
                    </button>
                    <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => handleRawImageSelect(e.target.files[0])} />
                  </div>

                  {imageFile && <span className="text-sm font-semibold text-pastel-blue">Photo successfully attached!</span>}
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h2 className="font-serif text-2xl text-ink">Choose a Stamp</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {STAMPS.map((stamp) => (
                      <button key={stamp.id} type="button" onClick={() => setFormData({...formData, stamp: stamp.img})} className={clsx("flex flex-col items-center p-3 rounded-lg border-2 transition-all", formData.stamp === stamp.img ? "border-pastel-blue bg-pastel-blue/5 shadow-sm" : "border-transparent hover:bg-gray-50")}>
                        <div className="w-14 h-16 bg-gray-100 shadow-sm border border-white mb-3 overflow-hidden"><img src={stamp.img} alt={stamp.name} className="w-full h-full object-cover" /></div>
                        <span className="text-xs text-center font-medium">{stamp.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h2 className="font-serif text-2xl text-ink">Add a Floral Touch</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {FLOWERS.map((flower) => (
                      <button key={flower.id} type="button" onClick={() => setFormData({...formData, decoration: flower.img})} className={clsx("flex flex-col items-center p-3 rounded-lg border-2 transition-all", formData.decoration === flower.img ? "border-pastel-pink bg-pastel-pink/10 shadow-sm" : "border-transparent hover:bg-gray-50")}>
                        <img src={flower.img} alt={flower.name} className="w-16 h-16 object-contain mb-3 drop-shadow-sm mix-blend-multiply" />
                        <span className="text-xs text-center font-medium leading-tight">{flower.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Fixed Footer Navigation */}
            <div className="shrink-0 pt-6 mt-4 flex items-center justify-between border-t border-ink/5">
              {currentStep > 1 ? (
                <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="px-6 py-3 font-semibold text-ink/60 hover:text-ink flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}
              
              {currentStep < 4 ? (
                <button type="button" onClick={() => setCurrentStep(prev => prev + 1)} className="bg-ink text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-ink/90">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="button" onClick={submitPostcard} disabled={isSubmitting} className="bg-pastel-blue text-ink px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:brightness-95 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                  {isSubmitting ? 'Sealing...' : 'Send Postcard'}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- CROPPER MODAL --- */}
      <AnimatePresence>
        {rawImageSrc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh]">
              <div className="p-4 border-b border-ink/10 flex justify-between items-center">
                <h3 className="font-serif font-bold text-xl">Crop Image</h3>
                <button onClick={() => setRawImageSrc(null)} className="text-ink/50 hover:text-ink font-bold">Close</button>
              </div>
              <div className="flex-1 relative bg-gray-900">
                <Cropper
                  image={rawImageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={3 / 2} 
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="p-6 bg-white flex justify-end gap-4">
                <button onClick={handleSaveCrop} className="bg-ink text-white px-8 py-3 rounded-lg font-semibold hover:bg-ink/90">
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ORCHESTRATION ANIMATION OVERLAY --- */}
      <AnimatePresence>
        {showSealingAnim && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDFBF7] p-4 overflow-hidden"
          >
            <div className="relative w-full max-w-lg aspect-[3/2] perspective-1000 mt-24">
              
              <motion.div 
                className="absolute inset-0 bg-[#EAE5DC] shadow-envelope rounded-md border border-ink/10"
                initial={{ y: '-100vh', zIndex: 0 }}
                animate={{ y: packStep >= 1 ? 0 : '-100vh' }}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
              />

              <motion.div
                className="absolute inset-2"
                initial={{ scale: 0.8, opacity: 0, zIndex: 50 }}
                animate={{ 
                  scale: 1, opacity: 1,
                  y: packStep === 3 ? '-110%' : 0, 
                  zIndex: packStep >= 4 ? 10 : 50 
                }}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
              >
                <Postcard data={{ ...formData, previewUrl }} isInteractive={false} forceFlip={false} />
              </motion.div>

              <motion.div 
                className="absolute inset-0 z-20 pointer-events-none drop-shadow-sm"
                initial={{ y: '-100vh' }} animate={{ y: packStep >= 1 ? 0 : '-100vh' }}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
              >
                <svg viewBox="0 0 540 360" className="w-full h-full">
                  <path d="M0,0 L270,220 L540,0 L540,360 L0,360 Z" fill="#F4F1EB" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                  <path d="M0,360 L270,220 L540,360" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="2" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute top-0 left-0 w-full h-full origin-top drop-shadow-md"
                initial={{ y: '-100vh', rotateX: 0, zIndex: 30 }}
                animate={{ 
                  y: packStep >= 1 ? 0 : '-100vh',
                  rotateX: (packStep >= 2 && packStep < 5) ? 180 : 0,
                  zIndex: packStep >= 3 && packStep < 5 ? 0 : 30 
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 540 360" className="w-full h-full">
                  <path d="M0,0 L270,230 L540,0 Z" fill="#F4F1EB" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
                </svg>
              </motion.div>

            </div>

            <AnimatePresence>
              {packStep >= 6 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-12 bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-md w-full border border-ink/5"
                >
                  <h2 className="font-serif text-3xl font-bold mb-2 text-ink">Signed & Sealed!</h2>
                  <p className="text-ink/60 mb-6 font-sans">Share this unique link.</p>
                  
                  <div className="flex w-full gap-2 mb-6 relative z-10">
                    <input type="text" readOnly value={generatedLink} className="flex-1 bg-gray-50 border border-ink/10 rounded-lg px-4 py-3 text-sm outline-none text-ink/70 truncate" />
                    <button onClick={handleCopyLink} className="bg-ink text-white px-5 py-3 rounded-lg font-semibold hover:bg-ink/90 flex items-center gap-2">
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <button onClick={() => navigate('/dashboard')} className="text-sm font-semibold text-ink underline hover:text-pastel-blue">
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
