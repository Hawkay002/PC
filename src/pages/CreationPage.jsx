import { useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Check, Copy, ArrowRight, ArrowLeft, Inbox, Upload, Camera } from 'lucide-react';
import clsx from 'clsx';
import Postcard from '../components/Postcard';
import { createPostcard } from '../lib/supabase';
import getCroppedImg from '../utils/cropImage';

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
  { id: 'stamp1', name: 'Autumn’s Yield', img: '/stamps/stamp1.webp' },
  { id: 'stamp2', name: 'Winter Forage', img: '/stamps/stamp2.webp' },
  { id: 'stamp3', name: 'Wildwood Bramble', img: '/stamps/stamp3.webp' },
  { id: 'stamp4', name: 'Fallen Acorn', img: '/stamps/stamp4.webp' }
];

// ALL 41 CSSgram Filters
const CSSGRAM_FILTERS = [
  { id: 'none', name: 'Normal', class: '' },
  { id: '1977', name: '1977', class: '_1977' },
  { id: 'aden', name: 'Aden', class: 'aden' },
  { id: 'amaro', name: 'Amaro', class: 'amaro' },
  { id: 'ashby', name: 'Ashby', class: 'ashby' },
  { id: 'brannan', name: 'Brannan', class: 'brannan' },
  { id: 'brooklyn', name: 'Brooklyn', class: 'brooklyn' },
  { id: 'charmes', name: 'Charmes', class: 'charmes' },
  { id: 'clarendon', name: 'Clarendon', class: 'clarendon' },
  { id: 'crema', name: 'Crema', class: 'crema' },
  { id: 'dogpatch', name: 'Dogpatch', class: 'dogpatch' },
  { id: 'earlybird', name: 'Earlybird', class: 'earlybird' },
  { id: 'gingham', name: 'Gingham', class: 'gingham' },
  { id: 'ginza', name: 'Ginza', class: 'ginza' },
  { id: 'hefe', name: 'Hefe', class: 'hefe' },
  { id: 'helena', name: 'Helena', class: 'helena' },
  { id: 'hudson', name: 'Hudson', class: 'hudson' },
  { id: 'inkwell', name: 'Inkwell', class: 'inkwell' },
  { id: 'juno', name: 'Juno', class: 'juno' },
  { id: 'kelvin', name: 'Kelvin', class: 'kelvin' },
  { id: 'lark', name: 'Lark', class: 'lark' },
  { id: 'lofi', name: 'Lo-Fi', class: 'lofi' },
  { id: 'ludwig', name: 'Ludwig', class: 'ludwig' },
  { id: 'maven', name: 'Maven', class: 'maven' },
  { id: 'mayfair', name: 'Mayfair', class: 'mayfair' },
  { id: 'moon', name: 'Moon', class: 'moon' },
  { id: 'nashville', name: 'Nashville', class: 'nashville' },
  { id: 'perpetua', name: 'Perpetua', class: 'perpetua' },
  { id: 'poprocket', name: 'Poprocket', class: 'poprocket' },
  { id: 'reyes', name: 'Reyes', class: 'reyes' },
  { id: 'rise', name: 'Rise', class: 'rise' },
  { id: 'sierra', name: 'Sierra', class: 'sierra' },
  { id: 'skyline', name: 'Skyline', class: 'skyline' },
  { id: 'slumber', name: 'Slumber', class: 'slumber' },
  { id: 'stinson', name: 'Stinson', class: 'stinson' },
  { id: 'sutro', name: 'Sutro', class: 'sutro' },
  { id: 'toaster', name: 'Toaster', class: 'toaster' },
  { id: 'valencia', name: 'Valencia', class: 'valencia' },
  { id: 'vesper', name: 'Vesper', class: 'vesper' },
  { id: 'walden', name: 'Walden', class: 'walden' },
  { id: 'willow', name: 'Willow', class: 'willow' },
  { id: 'xpro2', name: 'X-Pro II', class: 'xpro2' }
];

export default function CreationPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSealingAnim, setShowSealingAnim] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [packStep, setPackStep] = useState(0); 

  // FIXED: Renamed filter to image_filter globally
  const [formData, setFormData] = useState({
    to: '', from: '', message: '', font: 'script',
    decoration: FLOWERS[0].img, stamp: STAMPS[0].img, image_filter: ''       
  });
  
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
      setRawImageSrc(null); 
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    setFormData({ ...formData, image_filter: '' }); 
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-[#FDFBF7] h-[100dvh] overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto w-full h-full p-4 lg:p-8 flex flex-col lg:flex-row gap-4 lg:gap-8 relative">
          
          <div className="w-full lg:w-[45%] shrink-0 flex flex-col items-center z-20 pb-2 border-b lg:border-none border-ink/5">
            <div className="w-full flex items-center justify-between mb-4 lg:mb-8 px-2">
              <h1 className="font-serif text-2xl font-bold text-ink">Postcard Studio</h1>
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-ink/60 hover:text-pastel-blue transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-ink/5">
                <Inbox className="w-4 h-4" /> Outbox
              </Link>
            </div>
            <Postcard 
              data={{ ...formData, previewUrl }} 
              isInteractive={true} 
              forceFlip={currentStep === 2} 
              onRemoveImage={handleRemoveImage}
            />
          </div>

          <div className="w-full lg:w-[55%] bg-white rounded-xl shadow-sm border border-ink/5 p-4 sm:p-6 relative z-0 flex flex-col flex-1 min-h-0">
            
            <div className="shrink-0 flex items-center justify-between mb-4 border-b border-ink/5 pb-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className={clsx(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors",
                  currentStep === num ? "bg-ink text-white" : currentStep > num ? "bg-pastel-blue/20 text-ink" : "bg-gray-100 text-gray-400"
                )}>
                  {num}
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin pr-2">
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pt-2 pb-4">
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
                // FIXED: 'Attach a Memory' left-aligned flawlessly.
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pt-2 pb-4">
                  <div>
                    <h2 className="font-serif text-2xl text-ink">Attach a Memory</h2>
                    <p className="text-ink/60 text-sm mt-2">Upload a photo for the back of your postcard.</p>
                  </div>
                  
                  <div className="flex flex-row gap-4 w-full">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 flex flex-col items-center justify-center gap-2 bg-pastel-blue/10 hover:bg-pastel-blue/20 text-ink py-4 rounded-xl transition-colors font-medium border border-ink/5">
                      <Upload className="w-5 h-5" /> Upload
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleRawImageSelect(e.target.files[0])} />
                    
                    <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex-1 flex flex-col items-center justify-center gap-2 bg-pastel-pink/10 hover:bg-pastel-pink/20 text-ink py-4 rounded-xl transition-colors font-medium border border-ink/5">
                      <Camera className="w-5 h-5" /> Camera
                    </button>
                    <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => handleRawImageSelect(e.target.files[0])} />
                  </div>

                  <div className={clsx(
                    "w-full pt-4 border-t border-ink/5 transition-opacity duration-300", 
                    imageFile ? "opacity-100 pointer-events-auto" : "opacity-30 pointer-events-none"
                  )}>
                    <h3 className="font-serif text-lg text-ink mb-4">Choose your filter</h3>
                    {/* FIXED: Padding prevents the active scale-105 button from getting cropped */}
                    <div className="flex overflow-x-auto gap-3 pb-4 pt-4 px-2 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {CSSGRAM_FILTERS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, image_filter: f.class })}
                          className={clsx(
                            "shrink-0 flex flex-col items-center gap-2 snap-center rounded-xl p-2 transition-all w-[76px]",
                            formData.image_filter === f.class ? "bg-ink text-white shadow-md scale-105" : "hover:bg-gray-50 text-ink/70"
                          )}
                        >
                          <figure className={clsx("w-14 h-14 rounded-full overflow-hidden m-0 border-2", formData.image_filter === f.class ? "border-white" : "border-transparent", f.class)}>
                             <img src={previewUrl || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt={f.name} className="w-full h-full object-cover" />
                          </figure>
                          <span className="text-[10px] font-semibold tracking-wide uppercase">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pt-2">
                  <h2 className="font-serif text-2xl text-ink">Choose a Stamp</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {STAMPS.map((stamp) => (
                      <button key={stamp.id} type="button" onClick={() => setFormData({...formData, stamp: stamp.img})} className={clsx("flex flex-col items-center p-3 rounded-xl border-2 transition-all", formData.stamp === stamp.img ? "border-pastel-blue bg-pastel-blue/5 shadow-sm" : "border-transparent hover:bg-gray-50")}>
                        <div className="w-16 h-16 mb-2 flex items-center justify-center">
                          <img src={stamp.img} alt={stamp.name} className="w-full h-full object-contain drop-shadow-sm" />
                        </div>
                        <span className="text-xs text-center font-medium">{stamp.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pt-2 pb-4">
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

            <div className="shrink-0 pt-4 mt-2 flex items-center justify-between border-t border-ink/5">
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
                <button type="button" onClick={submitPostcard} disabled={isSubmitting} className="bg-pastel-blue text-ink px-6 sm:px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:brightness-95 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                  {isSubmitting ? 'Sealing...' : 'Send'}
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

      {/* --- RESTORED: THE PERFECT ORCHESTRATION ANIMATION OVERLAY --- */}
      <AnimatePresence>
        {showSealingAnim && (
          <motion.div 
            key="animation-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FDFBF7] p-4 overflow-hidden"
          >
            <div className="relative w-full max-w-lg aspect-[3/2] perspective-1000 mb-32">
              
              <motion.div 
                className="absolute inset-0 bg-[#EAE5DC] shadow-envelope rounded-md border border-ink/10"
                initial={{ y: '-100vh', zIndex: 0 }}
                animate={{ y: packStep >= 1 ? 0 : '-100vh' }}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
              />

              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                initial={{ scale: 0.8, opacity: 0, zIndex: 50 }}
                animate={{ 
                  scale: packStep >= 4 ? 0.96 : 0.96, 
                  opacity: 1,
                  y: packStep === 3 ? '-110%' : 0, 
                  zIndex: packStep >= 4 ? 10 : 50 
                }}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
              >
                <div className="w-full relative shadow-sm">
                  <Postcard data={{ ...formData, previewUrl }} isInteractive={false} forceFlip={false} />
                </div>
              </motion.div>

              <motion.div 
                className="absolute inset-0 z-20 pointer-events-none drop-shadow-sm"
                initial={{ y: '-100vh' }} animate={{ y: packStep >= 1 ? 0 : '-100vh' }}
                transition={{ type: "spring", stiffness: 40, damping: 15 }}
              >
                <svg viewBox="0 0 540 360" preserveAspectRatio="none" className="w-full h-full rounded-b-md overflow-hidden">
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
                <svg viewBox="0 0 540 360" preserveAspectRatio="none" className="w-full h-full rounded-t-md">
                  <path d="M0,0 L270,230 L540,0 Z" fill="#F4F1EB" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
                </svg>
              </motion.div>

              <motion.img 
                src="/seal-1.webp" 
                alt="Wax Seal"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 object-contain z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: packStep >= 6 ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeIn" }}
              />
            </div>

            <motion.div 
              className="absolute bottom-8 lg:bottom-12 z-[100] bg-white p-6 sm:p-8 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col items-center text-center max-w-md w-11/12 border border-ink/5"
              animate={{ opacity: packStep >= 6 ? 1 : 0, y: packStep >= 6 ? 0 : 20 }}
              style={{ pointerEvents: packStep >= 6 ? 'auto' : 'none' }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-3xl font-bold mb-2 text-ink">Signed & Sealed!</h2>
              <p className="text-ink/60 mb-6 font-sans">Share this unique link.</p>
              
              <div className="flex flex-col sm:flex-row w-full gap-3 mb-6 relative z-10">
                <input 
                  type="text" readOnly value={generatedLink} 
                  className="w-full sm:flex-1 bg-gray-50 border border-ink/10 rounded-lg px-4 py-3 text-center sm:text-left text-sm outline-none text-ink/70" 
                />
                <button 
                  onClick={handleCopyLink} 
                  className="w-full sm:w-auto bg-ink text-white px-6 py-3 rounded-lg font-semibold hover:bg-ink/90 flex items-center justify-center gap-2 shrink-0 transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <button onClick={() => navigate('/dashboard')} className="text-sm font-semibold text-ink underline hover:text-pastel-blue transition-colors">
                Go to your Outbox
              </button>
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
