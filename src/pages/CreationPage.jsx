import { useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Check, Copy, ArrowRight, ArrowLeft, Inbox, Upload, Camera, X } from 'lucide-react';
import clsx from 'clsx';
import Postcard from '../components/Postcard';
import { createPostcard } from '../lib/supabase';
import getCroppedImg from '../utils/cropImage';

// ─── Constants & SVGs for Envelope consistency ─────────────────────────────
const GOLD = '#C8A96E';
const GOLD2 = '#E4CC8A';

function BotanicalDefs({ id }) {
  return (
    <defs>
      <pattern id={id} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        {/* Cream base */}
        <rect width="60" height="60" fill="#EDE5D0" />

        {/* ── Central 8-petal flower ── */}
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

        {/* ── Corner leaf sprigs ── */}
        <path d="M3 6 Q6.5 2 9 7 Q4 10 3 6Z" fill="#6E9A5F" opacity="0.6" />
        <path d="M6 3 Q10 6 7 9.5 Q3 7 6 3Z" fill="#7FAD6E" opacity="0.45" />
        <path d="M57 6 Q53.5 2 51 7 Q56 10 57 6Z" fill="#6E9A5F" opacity="0.6" />
        <path d="M54 3 Q50 6 53 9.5 Q57 7 54 3Z" fill="#7FAD6E" opacity="0.45" />
        <path d="M3 54 Q6.5 58 9 53 Q4 50 3 54Z" fill="#6E9A5F" opacity="0.6" />
        <path d="M6 57 Q10 54 7 50.5 Q3 53 6 57Z" fill="#7FAD6E" opacity="0.45" />
        <path d="M57 54 Q53.5 58 51 53 Q56 50 57 54Z" fill="#6E9A5F" opacity="0.6" />
        <path d="M54 57 Q50 54 53 50.5 Q57 53 54 57Z" fill="#7FAD6E" opacity="0.45" />

        {/* ── Small buds at edge midpoints ── */}
        <ellipse cx="30" cy="4" rx="2" ry="2.8" fill="#D4956A" opacity="0.55" />
        <circle cx="30" cy="4" r="1" fill="#C8A96E" opacity="0.6" />
        <ellipse cx="30" cy="56" rx="2" ry="2.8" fill="#D4956A" opacity="0.55" />
        <circle cx="30" cy="56" r="1" fill="#C8A96E" opacity="0.6" />
        <ellipse cx="4" cy="30" rx="2.8" ry="2" fill="#D4956A" opacity="0.55" />
        <circle cx="4" cy="30" r="1" fill="#C8A96E" opacity="0.6" />
        <ellipse cx="56" cy="30" rx="2.8" ry="2" fill="#D4956A" opacity="0.55" />
        <circle cx="56" cy="30" r="1" fill="#C8A96E" opacity="0.6" />

        {/* ── Gold dot accents ── */}
        <circle cx="15" cy="15" r="1.4" fill="#C8A96E" opacity="0.38" />
        <circle cx="45" cy="15" r="1.4" fill="#C8A96E" opacity="0.38" />
        <circle cx="15" cy="45" r="1.4" fill="#C8A96E" opacity="0.38" />
        <circle cx="45" cy="45" r="1.4" fill="#C8A96E" opacity="0.38" />
      </pattern>
    </defs>
  );
}

const FLOWERS = [
  { id: 'anemone', name: 'Japanese Anemone', img: '/flowers/anemone.png' },
  { id: 'lily', name: 'Oriental Lily', img: '/flowers/lily.png' },
  { id: 'sunflower', name: 'Sunflower', img: '/flowers/sunflower.png' },
  { id: 'marigold', name: 'French Marigold', img: '/flowers/marigold.png' },
  { id: 'magnolia', name: 'Magnolia', img: '/flowers/magnolia.png' },
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
  { id: 'cosmos', name: 'Purple Cosmos', img: '/flowers/cosmos.png' },
  { id: 'hydrangea', name: 'Hydrangea Cluster', img: '/flowers/hydrangea.png' },
  { id: 'protea', name: 'Fiery Protea', img: '/flowers/protea.png' }
];

const STAMPS = [
  { id: 'stamp1', name: "Autumn's Yield", img: '/stamps/stamp1.webp' },
  { id: 'stamp2', name: 'Winter Forage', img: '/stamps/stamp2.webp' },
  { id: 'stamp3', name: 'Wildwood Bramble', img: '/stamps/stamp3.webp' },
  { id: 'stamp4', name: 'Fallen Acorn', img: '/stamps/stamp4.webp' },
  { id: 'stamp5', name: 'The Rowan Branch', img: '/stamps/stamp5.webp' },
  { id: 'stamp6', name: 'Echinacea Sky', img: '/stamps/stamp6.webp' }
];

const CSSGRAM_FILTERS = [
  { id: 'none', name: 'Original', class: '' },
  { id: '1977', name: '1977', class: '_1977' },
  { id: 'aden', name: 'Aden', class: 'aden' },
  { id: 'amaro', name: 'Amaro', class: 'amaro'},
  { id: 'brannan', name: 'Brannan', class: 'brannan' },
  { id: 'brooklyn', name: 'Brooklyn', class: 'brooklyn' },
  { id: 'charmes', name: 'Charmes', class: 'charmes' },
  { id: 'clarendon', name: 'Clarendon', class: 'clarendon' },
  { id: 'earlybird', name: 'Earlybird', class: 'earlybird' },
  { id: 'gingham', name: 'Gingham', class: 'gingham' },
  { id: 'hudson', name: 'Hudson', class: 'hudson' },
  { id: 'inkwell', name: 'Inkwell', class: 'inkwell' },
  { id: 'kelvin', name: 'Kelvin', class: 'kelvin' },
  { id: 'lark', name: 'Lark', class: 'lark' },
  { id: 'lofi', name: 'Lo-Fi', class: 'lofi' },
  { id: 'maven', name: 'Maven', class: 'maven' },
  { id: 'mayfair', name: 'Mayfair', class: 'mayfair' },
  { id: 'moon', name: 'Moon', class: 'moon' },
  { id: 'nashville', name: 'Nashville', class: 'nashville' },
  { id: 'perpetua', name: 'Perpetua', class: 'perpetua' },
  { id: 'reyes', name: 'Reyes', class: 'reyes' },
  { id: 'rise', name: 'Rise', class: 'rise' },
  { id: 'sierra', name: 'Sierra', class: 'sierra' },
  { id: 'slumber', name: 'Slumber', class: 'slumber' },
  { id: 'toaster', name: 'Toaster', class: 'toaster' },
  { id: 'valencia', name: 'Valencia', class: 'valencia' },
  { id: 'walden', name: 'Walden', class: 'walden' },
  { id: 'willow', name: 'Willow', class: 'willow' },
  { id: 'xpro2', name: 'X-Pro II', class: 'xpro2' }
];

const STEPS = [
  { num: 1, label: 'Message' },
  { num: 2, label: 'Photo' },
  { num: 3, label: 'Stamp' },
  { num: 4, label: 'Florals' },
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

  const [formData, setFormData] = useState({
    to: '', from: '', message: '', font: 'script',
    decoration: FLOWERS[0].img, stamp: STAMPS[0].img, image_filter: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [rawImageSrc, setRawImageSrc] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, cap) => setCroppedAreaPixels(cap), []);

  const handleRawImageSelect = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => setRawImageSrc(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSaveCrop = async () => {
    try {
      const croppedImageFile = await getCroppedImg(rawImageSrc, croppedAreaPixels, rotation);
      setPreviewUrl(URL.createObjectURL(croppedImageFile));
      setImageFile(croppedImageFile);
      setRawImageSrc(null);
      setRotation(0);
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
    if (!imageFile) return alert('Please add a photo.');
    if (!formData.message) return alert('Please write a message.');

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

      // --- TIMING FIX HERE ---
      setTimeout(() => setPackStep(1), 100);
      setTimeout(() => setPackStep(2), 1200);
      setTimeout(() => setPackStep(3), 2000); // Postcard slides up
      setTimeout(() => setPackStep(4), 2800); // Postcard starts falling
      setTimeout(() => setPackStep(5), 4500); // Wait 1.7 seconds for card to settle!
      setTimeout(() => setPackStep(6), 5300); // Drop the wax seal
      
    } catch (error) {
      console.error(error);
      alert('Failed to send: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass = "w-full bg-charcoal/80 border border-rim hover:border-gold/30 focus:border-gold/50 rounded-sm px-4 py-3 text-luminary font-sans text-sm placeholder:text-muted transition-colors";
  const labelClass = "block text-xs font-sans font-medium uppercase tracking-[0.15em] text-muted mb-2";

  return (
    <>
      <div className="bg-obsidian bg-noise h-[100dvh] overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="shrink-0 flex items-center justify-between px-5 lg:px-8 py-4 border-b border-rim/50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-5 bg-gradient-to-b from-gold to-gold/30 rounded-full" />
            <h1 className="font-display text-lg font-light tracking-[0.25em] text-champagne uppercase">
              Correspondance
            </h1>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-xs font-sans text-muted hover:text-champagne border border-rim hover:border-gold/30 transition-all px-3.5 py-1.5 rounded-sm"
          >
            <Inbox className="w-3.5 h-3.5" />
            Outbox
          </Link>
        </div>

        <div className="max-w-7xl mx-auto w-full flex-1 min-h-0 p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left — postcard preview */}
          <div className="w-full lg:w-[45%] shrink-0 flex flex-col items-center justify-center z-20 pb-3 border-b lg:border-none border-rim/30">
            <div className="w-full max-w-md">
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-muted mb-3 text-center">Preview</p>
              <Postcard
                data={{ ...formData, previewUrl }}
                isInteractive={true}
                forceFlip={currentStep === 2}
                onRemoveImage={handleRemoveImage}
              />
              <p className="text-xs text-muted/60 text-center mt-3 font-sans font-light italic">
                Tap to flip
              </p>
            </div>
          </div>

          {/* Right — form panel */}
          <div className="w-full lg:w-[55%] bg-panel border border-rim/50 rounded-sm flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Step indicator */}
            <div className="shrink-0 flex items-center gap-0 border-b border-rim/50">
              {STEPS.map((step, i) => (
                <div key={step.num} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.num)}
                    className={clsx(
                      'flex-1 flex flex-col items-center py-3.5 transition-all relative',
                      currentStep === step.num
                        ? 'text-champagne'
                        : currentStep > step.num
                        ? 'text-gold/60'
                        : 'text-muted/50'
                    )}
                  >
                    <span className={clsx(
                      'text-[10px] font-sans uppercase tracking-[0.15em] font-medium',
                    )}>
                      {step.label}
                    </span>
                    {currentStep === step.num && (
                      <motion.div
                        layoutId="step-underline"
                        className="absolute bottom-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                      />
                    )}
                    {currentStep > step.num && (
                      <div className="absolute bottom-0 left-2 right-2 h-px bg-gold/20" />
                    )}
                  </button>
                  {i < STEPS.length - 1 && <div className="w-px h-6 bg-rim/50" />}
                </div>
              ))}
            </div>

            {/* Step content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="p-5 lg:p-7">

                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="font-display text-3xl lg:text-4xl font-light italic text-luminary mb-1">
                        Compose your letter
                      </h2>
                      <p className="text-muted text-xs font-sans">Every great postcard starts with heartfelt words.</p>
                    </div>
                    <div className="w-8 h-px bg-gold/40" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>To</label>
                        <input
                          type="text" maxLength={30} placeholder="Recipient"
                          className={inputClass}
                          value={formData.to}
                          onChange={e => setFormData({ ...formData, to: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>From</label>
                        <input
                          type="text" maxLength={30} placeholder="Your name"
                          className={inputClass}
                          value={formData.from}
                          onChange={e => setFormData({ ...formData, from: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Message</label>
                      <textarea
                        rows={6} 
                        maxLength={200}
                        placeholder="Write something lovely..."
                        className={`${inputClass} font-script text-2xl resize-none leading-relaxed overflow-y-auto`}
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                      />
                      <p className="text-right text-xs text-muted mt-1">{formData.message.length}/200</p>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="font-display text-3xl lg:text-4xl font-light italic text-luminary mb-1">
                        Attach a memory
                      </h2>
                      <p className="text-muted text-xs font-sans">A photograph for the back of your postcard.</p>
                    </div>
                    <div className="w-8 h-px bg-gold/40" />

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-2 border border-rim hover:border-gold/40 bg-charcoal/50 hover:bg-surface py-3 rounded-sm transition-all group"
                      >
                        <Upload className="w-5 h-5 text-muted group-hover:text-gold transition-colors" />
                        <span className="text-xs font-sans uppercase tracking-[0.15em] text-muted group-hover:text-champagne">Upload</span>
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleRawImageSelect(e.target.files[0])} />

                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-2 border border-rim hover:border-gold/40 bg-charcoal/50 hover:bg-surface py-3 rounded-sm transition-all group"
                      >
                        <Camera className="w-5 h-5 text-muted group-hover:text-gold transition-colors" />
                        <span className="text-xs font-sans uppercase tracking-[0.15em] text-muted group-hover:text-champagne">Camera</span>
                      </button>
                      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => handleRawImageSelect(e.target.files[0])} />
                    </div>

                    {/* Filter strip */}
                    <div className={clsx(
                      "pt-5 border-t border-rim/50 transition-opacity duration-300",
                      imageFile ? "opacity-100 pointer-events-auto" : "opacity-30 pointer-events-none"
                    )}>
                      <p className={labelClass}>Film Filter</p>
                      <div className="flex overflow-x-auto gap-2 pt-2 pb-3 px-1 snap-x" style={{ scrollbarWidth: 'none' }}>
                        {CSSGRAM_FILTERS.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, image_filter: f.class })}
                            className={clsx(
                              "shrink-0 flex flex-col items-center gap-1.5 snap-center p-2 transition-all rounded-sm w-[72px]",
                              formData.image_filter === f.class
                                ? "bg-gold/10 ring-1 ring-gold/50"
                                : "hover:bg-surface"
                            )}
                          >
                            <figure className={clsx(
                              "w-12 h-12 rounded-full overflow-hidden m-0 ring-1",
                              formData.image_filter === f.class ? "ring-gold/60" : "ring-rim",
                              f.class
                            )}>
                              <img
                                src={previewUrl || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="}
                                alt={f.name}
                                className="w-full h-full object-cover"
                              />
                            </figure>
                            <span className={clsx(
                              "text-[9px] font-sans uppercase tracking-wide",
                              formData.image_filter === f.class ? "text-champagne" : "text-muted"
                            )}>{f.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="font-display text-3xl lg:text-4xl font-light italic text-luminary mb-1">
                        Choose a stamp
                      </h2>
                      <p className="text-muted text-xs font-sans">Select a philatelic accent for your postcard.</p>
                    </div>
                    <div className="w-8 h-px bg-gold/40" />
                    <div className="grid grid-cols-2 gap-3">
                      {STAMPS.map((stamp) => (
                        <button
                          key={stamp.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, stamp: stamp.img })}
                          className={clsx(
                            "flex flex-col items-center p-4 rounded-sm border transition-all",
                            formData.stamp === stamp.img
                              ? "border-gold/50 bg-gold/5 shadow-gold"
                              : "border-rim hover:border-gold/25 hover:bg-surface"
                          )}
                        >
                          <div className="w-16 h-16 flex items-center justify-center mb-3">
                            <img src={stamp.img} alt={stamp.name} className="w-full h-full object-contain drop-shadow-sm" />
                          </div>
                          <span className={clsx(
                            "text-xs font-sans text-center",
                            formData.stamp === stamp.img ? "text-champagne" : "text-muted"
                          )}>{stamp.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="font-display text-3xl lg:text-4xl font-light italic text-luminary mb-1">
                        Floral accent
                      </h2>
                      <p className="text-muted text-xs font-sans">Adorn your postcard with a botanical illustration.</p>
                    </div>
                    <div className="w-8 h-px bg-gold/40" />
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {FLOWERS.map((flower) => (
                        <button
                          key={flower.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, decoration: flower.img })}
                          className={clsx(
                            "flex flex-col items-center p-2.5 rounded-sm border transition-all",
                            formData.decoration === flower.img
                              ? "border-gold/50 bg-gold/5"
                              : "border-rim/50 hover:border-gold/25 hover:bg-surface"
                          )}
                        >
                          <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center mb-2 shadow-sm">
                            <img src={flower.img} alt={flower.name} className="w-11 h-11 object-contain mix-blend-multiply" />
                          </div>
                          <span className={clsx(
                            "text-[10px] font-sans text-center leading-tight",
                            formData.decoration === flower.img ? "text-champagne" : "text-muted"
                          )}>{flower.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Navigation footer */}
            <div className="shrink-0 flex items-center justify-between px-5 lg:px-7 py-4 border-t border-rim/50">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(p => p - 1)}
                  className="flex items-center gap-2 text-sm text-muted hover:text-luminary transition-colors font-sans"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : <div />}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(p => p + 1)}
                  className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 hover:border-gold/60 text-champagne px-6 py-2.5 rounded-sm text-sm font-sans transition-all"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitPostcard}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-gold/90 to-champagne/80 hover:from-gold hover:to-champagne text-obsidian px-6 py-2.5 rounded-sm text-sm font-sans font-medium transition-all disabled:opacity-50 shadow-gold"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                  {isSubmitting ? 'Sealing...' : 'Send Postcard'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Crop modal */}
      <AnimatePresence>
        {rawImageSrc && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          >
            <div className="bg-panel border border-rim rounded-sm w-full max-w-2xl overflow-hidden flex flex-col h-[80vh]">
              <div className="p-4 border-b border-rim flex justify-between items-center">
                <h3 className="font-display text-xl font-light italic text-luminary">Frame your photo</h3>
                <button onClick={() => { setRawImageSrc(null); setRotation(0); }} className="text-muted hover:text-luminary text-sm font-sans transition-colors">
                  Cancel
                </button>
              </div>
              <div className="flex-1 relative bg-obsidian">
                <Cropper
                  image={rawImageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={3 / 2}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                />
              </div>
              <div className="p-5 border-t border-rim flex flex-col sm:flex-row gap-4 justify-between items-center bg-charcoal/30">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs font-sans uppercase tracking-[0.15em] text-muted">Rotate</span>
                  <input
                    type="range"
                    value={rotation}
                    min={0}
                    max={360}
                    step={1}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full sm:w-48 h-1 bg-rim rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                  <span className="text-xs font-sans text-muted w-8 text-right">{rotation}°</span>
                </div>
                <button
                  onClick={handleSaveCrop}
                  className="w-full sm:w-auto bg-gradient-to-r from-gold/90 to-champagne/80 text-obsidian px-8 py-2.5 rounded-sm font-sans font-medium text-sm hover:from-gold hover:to-champagne transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sealing animation overlay */}
      <AnimatePresence>
        {showSealingAnim && (
          <motion.div
            key="animation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-obsidian p-4 overflow-hidden"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.06)_0%,transparent_70%)] pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => {
                setShowSealingAnim(false);
                setPackStep(0);
                setGeneratedLink('');
                setCopied(false);

                // Reset form for new postcard
                setCurrentStep(1);
                setPreviewUrl('');
                setImageFile(null);
                setRawImageSrc(null);
                setRotation(0);

                setFormData({
                  to: '',
                  from: '',
                  message: '',
                  font: 'script',
                  decoration: FLOWERS[0].img,
                  stamp: STAMPS[0].img,
                  image_filter: ''
                });
              }}
              className="absolute top-5 right-5 z-[120] w-11 h-11 flex items-center justify-center rounded-full border border-rim/60 bg-panel/80 backdrop-blur hover:border-gold/40 hover:bg-panel transition-all"
            >
              <X className="w-5 h-5 text-muted hover:text-champagne transition-colors" />
            </button>
            
            <div className="relative w-full max-w-lg aspect-[3/2] perspective-1000 mb-32">
              
              {/* ── ENVELOPE BODY — botanical inside lining ── */}
              <motion.div
                className="absolute inset-0 shadow-envelope rounded-sm overflow-hidden"
                initial={{ y: '-100vh', zIndex: 0 }}
                animate={{ y: packStep >= 1 ? 0 : '-100vh' }}
                transition={{ type: 'spring', stiffness: 40, damping: 15 }}
              >
                <div className="absolute inset-0 bg-[#EAE5DC]" />
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 540 360"
                  preserveAspectRatio="none"
                >
                  <BotanicalDefs id="bodyPat-anim" />
                  <rect width="540" height="360" fill="url(#bodyPat-anim)" opacity="0.88" />
                  <line x1="0" y1="0" x2="270" y2="220" stroke={GOLD} strokeWidth="1.2" opacity="0.35" />
                  <line x1="540" y1="0" x2="270" y2="220" stroke={GOLD} strokeWidth="1.2" opacity="0.35" />
                </svg>
                <div
                  className="absolute inset-0 pointer-events-none rounded-sm"
                  style={{ boxShadow: `inset 0 0 0 1.5px rgba(200,169,110,0.4), inset 0 0 0 3.5px rgba(200,169,110,0.12)` }}
                />
              </motion.div>
              
              {/* ── POSTCARD ── */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                initial={{ scale: 0.96, opacity: 0, zIndex: 50 }}
                animate={{
                  scale: 0.96,
                  opacity: 1,
                  y: packStep === 3 ? '-110%' : 0,
                  zIndex: packStep >= 4 ? 10 : 50
                }}
                transition={{ type: 'spring', stiffness: 40, damping: 15 }}
              >
                <div className="w-full relative">
                  <Postcard data={{ ...formData, previewUrl }} isInteractive={false} forceFlip={false} showShadow={false} />
                </div>
              </motion.div>
              
              {/* ── BOTTOM FLAP — outside face with gold borders ── */}
              <motion.div
                className="absolute inset-0 w-full h-full z-20 pointer-events-none drop-shadow-sm"
                initial={{ y: '-100vh' }}
                animate={{ y: packStep >= 1 ? 0 : '-100vh' }}
                transition={{ type: 'spring', stiffness: 40, damping: 15 }}
              >
                <svg viewBox="0 0 540 360" preserveAspectRatio="none" className="w-full h-full rounded-b-sm overflow-hidden">
                  <BotanicalDefs id="btmPat-anim" />
                  <path d="M0,0 L270,220 L540,0 L540,360 L0,360 Z" fill="#F0EBE1" />
                  <path d="M0,0 L270,220 L540,0 L540,360 L0,360 Z" fill="url(#btmPat-anim)" opacity="0.12" />
                  <path d="M2,0 L270,218 L538,0" fill="none" stroke={GOLD2} strokeWidth="0.8" opacity="0.55" />
                  <path d="M0,0 L270,220 L540,0" fill="none" stroke={GOLD} strokeWidth="2.2" opacity="0.85" />
                  <path d="M14,0 L270,208 L526,0" fill="none" stroke={GOLD} strokeWidth="0.7" opacity="0.3" />
                  <path d="M0,360 L270,222 L540,360" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.28" />
                  <rect x="1.5" y="1.5" width="537" height="357" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.3" rx="1" />
                </svg>
              </motion.div>
              
              {/* ── TOP FLAP — outside + inside botanical revealed on open ── */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full origin-top drop-shadow-md"
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ y: '-100vh', rotateX: 0, zIndex: 30 }}
                animate={{
                  y: packStep >= 1 ? 0 : '-100vh',
                  rotateX: (packStep >= 2 && packStep < 5) ? 180 : 0,
                  zIndex: (packStep >= 2 && packStep < 5) ? 5 : 30
                }}
                transition={{ 
                  y: { type: 'spring', stiffness: 40, damping: 15 },
                  rotateX: { duration: 0.8, ease: 'easeInOut' },
                  zIndex: { duration: 0 } 
                }}
              >
                {/* OUTSIDE face of top flap */}
                <svg
                  viewBox="0 0 540 360"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full rounded-t-sm"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                  <BotanicalDefs id="flapOutPat-anim" />
                  <path d="M0,0 L270,230 L540,0 Z" fill="#F0EBE1" />
                  <path d="M0,0 L270,230 L540,0 Z" fill="url(#flapOutPat-anim)" opacity="0.10" />
                  <path d="M2,0 L270,228" fill="none" stroke={GOLD2} strokeWidth="0.9" opacity="0.6" />
                  <path d="M0,0 L270,230" fill="none" stroke={GOLD} strokeWidth="2.8" opacity="0.88" />
                  <path d="M538,0 L270,228" fill="none" stroke={GOLD2} strokeWidth="0.9" opacity="0.6" />
                  <path d="M540,0 L270,230" fill="none" stroke={GOLD} strokeWidth="2.8" opacity="0.88" />
                  <path d="M16,0 L270,216" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.28" />
                  <path d="M524,0 L270,216" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.28" />
                  <line x1="0" y1="1" x2="540" y2="1" stroke={GOLD} strokeWidth="1.8" opacity="0.45" />
                  <line x1="0" y1="5" x2="540" y2="5" stroke={GOLD} strokeWidth="0.6" opacity="0.22" />
                </svg>

                {/* INSIDE face — full botanical lining revealed when flap opens */}
                <svg
                  viewBox="0 0 540 360"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateX(180deg)',
                  }}
                >
                  <BotanicalDefs id="flapInPat-anim" />
                  <path d="M0,0 L270,230 L540,0 Z" fill="url(#flapInPat-anim)" />
                  <path d="M0,0 L270,230 L540,0 Z" fill="rgba(180,130,90,0.07)" />
                  <path d="M0,0 L270,230" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.7" />
                  <path d="M540,0 L270,230" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.7" />
                  <line x1="0" y1="1" x2="540" y2="1" stroke={GOLD} strokeWidth="1.2" opacity="0.45" />
                </svg>
              </motion.div>
              
              <motion.img
                src="/waxseal-1.webp"
                alt="Wax Seal"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 object-contain z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: packStep >= 6 ? 1 : 0 }}
                transition={{ duration: 0.5, ease: 'easeIn' }}
              />
            </div>

            <motion.div
              className="absolute bottom-8 lg:bottom-10 z-[100] bg-panel border border-gold/20 p-6 sm:p-8 rounded-sm shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] flex flex-col items-center text-center max-w-md w-11/12"
              animate={{ opacity: packStep >= 6 ? 1 : 0, y: packStep >= 6 ? 0 : 24 }}
              style={{ pointerEvents: packStep >= 6 ? 'auto' : 'none' }}
              transition={{ duration: 0.4 }}
            >
              {/* Gold ornament */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/60" />
                <span className="text-gold/60 text-sm">✦</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/60" />
              </div>
              <h2 className="font-display text-3xl font-light italic text-luminary mb-2">Sealed & sent</h2>
              <p className="text-muted text-sm mb-6 font-sans">Share this unique link with your recipient.</p>

              <div className="flex flex-col sm:flex-row w-full gap-2 mb-5">
                <input
                  type="text" readOnly value={generatedLink}
                  className="w-full sm:flex-1 bg-charcoal border border-rim rounded-sm px-3 py-2.5 text-sm outline-none text-muted/80 font-sans"
                />
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto bg-gradient-to-r from-gold/90 to-champagne/80 text-obsidian px-5 py-2.5 rounded-sm font-sans font-medium text-sm flex items-center justify-center gap-2 hover:from-gold hover:to-champagne transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs font-sans text-muted hover:text-champagne transition-colors underline underline-offset-4"
              >
                View your outbox
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
