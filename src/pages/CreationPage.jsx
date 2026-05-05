import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { v4 as uuidv4 } from 'uuid';
import Postcard from '../components/Postcard';
import { createPostcard } from '../lib/supabase';
import { ImagePlus, Send, Loader2 } from 'lucide-react';

export default function CreationPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Postcard State
  const [formData, setFormData] = useState({
    to: '',
    from: '',
    message: '',
    font: 'script',
    decoration: '🌸',
    stamp: '💌',
  });
  
  // Image State
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a fast local preview
    setPreviewUrl(URL.createObjectURL(file));
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !formData.message) return alert("Please add an image and a message!");
    
    setIsSubmitting(true);
    try {
      // 1. Compress Image (Protecting Vercel's 4.5MB limit)
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1200, useWebWorker: true };
      const compressedFile = await imageCompression(imageFile, options);
      
      // 2. Convert to Base64 for the serverless proxy
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => resolve(reader.result);
      });

      // 3. Upload to Telegram via our API route
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      });
      
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error);

      // 4. Save metadata + file_id to Supabase
      const postcardId = await createPostcard({ ...formData, file_id: uploadData.file_id });

      // 5. Save to local storage for the dashboard
      const savedCards = JSON.parse(localStorage.getItem('my_postcards') || '[]');
      savedCards.push({ id: postcardId, to: formData.to, date: new Date().toISOString() });
      localStorage.setItem('my_postcards', JSON.stringify(savedCards));

      // 6. Navigate to the generated link
      navigate(`/card/${postcardId}`);

    } catch (error) {
      console.error(error);
      alert("Failed to send postcard: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      
      {/* Left: The Live 3D Preview */}
      <div className="sticky top-12 flex flex-col items-center">
        <h2 className="text-sm font-sans font-semibold tracking-widest text-ink/50 uppercase mb-8">
          Live Preview (Click to flip)
        </h2>
        <Postcard data={{ ...formData, previewUrl }} />
      </div>

      {/* Right: The Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-ink/5 p-8">
        <h1 className="font-serif text-3xl font-bold mb-6">Craft your postcard</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">To</label>
              <input 
                type="text" required maxLength={30}
                className="w-full bg-pastel-blue/10 border border-ink/10 rounded p-2 focus:outline-none focus:border-ink/30"
                value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">From</label>
              <input 
                type="text" required maxLength={30}
                className="w-full bg-pastel-blue/10 border border-ink/10 rounded p-2 focus:outline-none focus:border-ink/30"
                value={formData.from} onChange={e => setFormData({...formData, from: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">Message</label>
            <textarea 
              required rows={4} maxLength={150}
              className="w-full bg-pastel-blue/10 border border-ink/10 rounded p-2 focus:outline-none focus:border-ink/30 font-script text-xl resize-none"
              value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <div className="border-t border-ink/10 pt-6">
            <label className="block text-xs font-semibold uppercase text-ink/60 mb-3">Attach Photo</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-ink/20 rounded cursor-pointer hover:bg-pastel-blue/5 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImagePlus className="w-8 h-8 text-ink/40 mb-2" />
                <p className="text-sm text-ink/60 font-medium">Click to upload photo</p>
              </div>
              <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleImageChange} required />
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-ink text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
            {isSubmitting ? 'Sealing envelope...' : 'Send Postcard'}
          </button>
        </form>
      </div>
    </div>
  );
}
