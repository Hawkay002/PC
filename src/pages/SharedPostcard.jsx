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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-serif text-ink/50 text-xl">Delivering mail...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="font-serif text-2xl text-ink">Postcard lost in transit.</h1>
        <p className="text-ink/60">{error}</p>
        <Link to="/" className="underline text-pastel-blue font-semibold">Send a new one</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <Envelope postcardData={data} />
      
      {/* Viral Loop / Call to Action */}
      <div className="fixed bottom-8 text-center animate-fade-in delay-1000">
        <Link to="/" className="bg-white/80 backdrop-blur px-6 py-2 rounded-full shadow-sm border border-white/20 text-sm font-semibold hover:bg-white transition-colors">
          Create your own postcard ✨
        </Link>
      </div>
    </div>
  );
}
