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
  { id: 'cosmos', name: 'Purple Cosmos', img: '/flowers/cosmos.png' }
];

const STAMPS = [
  { id: 'stamp1', name: "Autumn's Yield", img: '/stamps/stamp1.webp' },
  { id: 'stamp2', name: 'Winter Forage', img: '/stamps/stamp2.webp' },
  { id: 'stamp3', name: 'Wildwood Bramble', img: '/stamps/stamp3.webp' },
  { id: 'stamp4', name: 'Fallen Acorn', img: '/stamps/stamp4.webp' }
];

const CSSGRAM_FILTERS = [
  { id: 'none', name: 'Original', class: '' },
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
  { id: 'reyes', name: 'Reyes', class: 'reyes' },
  { id: 'rise', name: 'Rise', class: 'rise' },
  { id: 'sierra', name: 'Sierra', class: 'sierra' },
  { id: 'slumber', name: 'Slumber', class: 'slumber' },
  { id: 'stinson', name: 'Stinson', class: 'stinson' },
  { id: 'toaster', name: 'Toaster', class: 'toaster' },
  { id: 'valencia', name: 'Valencia', class: 'valencia' },
  { id: 'vesper', name: 'Vesper', class: 'vesper' },
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

      setTimeout(() => setPackStep(1), 100);
      setTimeout(() => setPackStep(2), 1200);
      setTimeout(() => setPackStep(3), 2000);
      setTimeout(() => setPackStep(4), 2800);
      setTimeout(() => setPackStep(5), 3600);
      setTimeout(() => setPackStep(6), 4400);
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
                        rows={5} maxLength={200}
                        placeholder="Write something lovely..."
                        className={`${inputClass} font-script text-2xl resize-none leading-relaxed`}
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
                        className="flex flex-col items-center justify-center gap-2 border border-rim hover:border-gold/40 bg-charcoal/50 hover:bg-surface py-6 rounded-sm transition-all group"
                      >
                        <Upload className="w-5 h-5 text-muted group-hover:text-gold transition-colors" />
                        <span className="text-xs font-sans uppercase tracking-[0.15em] text-muted group-hover:text-champagne">Upload</span>
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleRawImageSelect(e.target.files[0])} />

                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-2 border border-rim hover:border-gold/40 bg-charcoal/50 hover:bg-surface py-6 rounded-sm transition-all group"
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
                      <div className="flex overflow-x-auto gap-2 pb-3 snap-x" style={{ scrollbarWidth: 'none' }}>
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
                <button onClick={() => setRawImageSrc(null)} className="text-muted hover:text-luminary text-sm font-sans transition-colors">
                  Cancel
                </button>
              </div>
              <div className="flex-1 relative bg-obsidian">
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
              <div className="p-5 border-t border-rim flex justify-end">
                <button
                  onClick={handleSaveCrop}
                  className="bg-gradient-to-r from-gold/90 to-champagne/80 text-obsidian px-8 py-2.5 rounded-sm font-sans font-medium text-sm hover:from-gold hover:to-champagne transition-all"
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

            <div className="relative w-full max-w-lg aspect-[3/2] perspective-1000 mb-32">
              <motion.div
                className="absolute inset-0 bg-[#EAE5DC] shadow-envelope rounded-sm border border-ink/10"
                initial={{ y: '-100vh', zIndex: 0 }}
                animate={{ y: packStep >= 1 ? 0 : '-100vh' }}
                transition={{ type: 'spring', stiffness: 40, damping: 15 }}
              />
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
                <div className="w-full relative shadow-card">
                  <Postcard data={{ ...formData, previewUrl }} isInteractive={false} forceFlip={false} />
                </div>
              </motion.div>
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none drop-shadow-sm"
                initial={{ y: '-100vh' }}
                animate={{ y: packStep >= 1 ? 0 : '-100vh' }}
                transition={{ type: 'spring', stiffness: 40, damping: 15 }}
              >
                <svg viewBox="0 0 540 360" preserveAspectRatio="none" className="w-full h-full rounded-b-sm overflow-hidden">
                  <path d="M0,0 L270,220 L540,0 L540,360 L0,360 Z" fill="#F4F1EB" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
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
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 540 360" preserveAspectRatio="none" className="w-full h-full rounded-t-sm">
                  <path d="M0,0 L270,230 L540,0 Z" fill="#F4F1EB" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
                </svg>
              </motion.div>
              <motion.img
                src="/seal-1.webp"
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
