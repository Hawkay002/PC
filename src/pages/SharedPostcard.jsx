import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostcard } from '../lib/supabase';
import Envelope from '../components/Envelope';

export default function SharedPostcard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPostcard() {
      try {
        const postcardData = await getPostcard(id);
        setData(postcardData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPostcard();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian bg-noise flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-gold/30 rounded-full border-t-gold/80 animate-spin" />
          <p className="font-display text-lg font-light italic text-muted">Delivering your correspondence…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-obsidian bg-noise flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-4" />
        <h1 className="font-display text-3xl font-light italic text-luminary">Lost in transit</h1>
        <p className="text-muted text-sm font-sans">{error}</p>
        <Link to="/" className="mt-4 text-xs font-sans uppercase tracking-[0.15em] text-gold/70 hover:text-gold border border-gold/20 hover:border-gold/50 px-5 py-2 rounded-sm transition-all">
          Send a new one
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian bg-noise flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.05)_0%,transparent_65%)] pointer-events-none" />
      
      <Envelope postcardData={data} />

      <div className="fixed bottom-8 text-center z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-panel/80 backdrop-blur-md border border-gold/20 hover:border-gold/50 text-champagne px-5 py-2.5 rounded-sm text-xs font-sans uppercase tracking-[0.15em] transition-all shadow-gold"
        >
          <span className="text-gold/60">✦</span>
          Create your own
        </Link>
      </div>
    </div>
  );
}
