import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Clock, ArrowRight, PenSquare, Trash2, Inbox } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Dedicated delete that calls Supabase directly
async function deletePostcardById(id) {
  const { error } = await supabase
    .from('postcards')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export default function Dashboard() {
  const [postcards, setPostcards] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('my_postcards') || '[]');
    setPostcards(saved.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

  const handleDelete = async (idToDelete) => {
    if (!window.confirm('Remove this postcard permanently?')) return;
    setDeletingId(idToDelete);
    try {
      // Delete from Supabase first
      await deletePostcardById(idToDelete);
      // Then remove from localStorage
      const savedCards = JSON.parse(localStorage.getItem('my_postcards') || '[]');
      const updatedCards = savedCards.filter(card => card.id !== idToDelete);
      localStorage.setItem('my_postcards', JSON.stringify(updatedCards));
      // Update state
      setPostcards(updatedCards);
    } catch (error) {
      console.error('Failed to delete from Supabase:', error);
      // Still remove locally even if remote fails
      const savedCards = JSON.parse(localStorage.getItem('my_postcards') || '[]');
      const updatedCards = savedCards.filter(card => card.id !== idToDelete);
      localStorage.setItem('my_postcards', JSON.stringify(updatedCards));
      setPostcards(updatedCards);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/card/${id}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-obsidian bg-noise">
      {/* Header */}
      <header className="border-b border-rim/50 px-6 lg:px-12 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Inbox className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h1 className="font-display text-xl font-light tracking-widest text-champagne uppercase">
                Outbox
              </h1>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-sans text-muted hover:text-champagne border border-rim hover:border-gold/40 transition-all px-4 py-2 rounded-sm"
          >
            <PenSquare className="w-3.5 h-3.5" />
            New Postcard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        {/* Page title */}
        <div className="mb-12">
          <p className="font-display text-5xl lg:text-6xl font-light italic text-luminary mb-3">
            Your Correspondence
          </p>
          <div className="w-16 h-px bg-gradient-to-r from-gold/60 to-transparent" />
          <p className="text-muted text-sm mt-4 font-sans font-light tracking-wide">
            Postcards saved on this device
          </p>
        </div>

        {postcards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-rim/50 rounded-sm bg-panel/50">
            <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-gold/40" />
            </div>
            <h2 className="font-display text-3xl font-light italic text-luminary/60 mb-3">
              No letters sent yet
            </h2>
            <p className="text-muted text-sm mb-8 font-sans">
              Your outbox awaits its first correspondent.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 hover:border-gold/60 text-champagne px-6 py-2.5 rounded-sm text-sm font-sans transition-all"
            >
              Compose your first postcard
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {postcards.map((card, i) => (
              <div
                key={card.id}
                className="group flex items-center justify-between bg-panel border border-rim/50 hover:border-gold/30 rounded-sm px-5 py-4 transition-all duration-300"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Decorative wax seal indicator */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-transparent border border-gold/20 flex items-center justify-center shrink-0">
                    <span className="text-gold/60 text-xs font-display italic">✦</span>
                  </div>
                  <div>
                    <p className="font-display text-lg font-light text-luminary">
                      To: <span className="italic">{card.to || 'Unknown'}</span>
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5 font-sans">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(card.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Copy link button */}
                  <button
                    onClick={() => handleCopyLink(card.id)}
                    className="text-xs font-sans text-muted hover:text-champagne px-3 py-1.5 border border-rim hover:border-gold/30 rounded-sm transition-all"
                  >
                    {copied === card.id ? '✓ Copied' : 'Copy Link'}
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(card.id)}
                    disabled={deletingId === card.id}
                    className="w-8 h-8 flex items-center justify-center text-muted hover:text-red-400/80 hover:bg-red-500/10 rounded-sm transition-all disabled:opacity-30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* View button */}
                  <Link
                    to={`/card/${card.id}`}
                    className="w-8 h-8 flex items-center justify-center text-muted hover:text-gold group-hover:border-gold/30 border border-rim hover:border-gold/30 rounded-sm transition-all"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
