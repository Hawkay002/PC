import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Clock, ArrowRight, PenSquare, Trash2, Inbox, ArrowLeft, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

async function deleteTelegramMessage(message_id) {
  if (!message_id) return; // older cards won't have this
  try {
    await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message_id }),
    });
  } catch (e) {
    console.error('Telegram delete failed (non-fatal):', e);
  }
}

async function deletePostcardById(id) {
  const { error } = await supabase.from('postcards').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [postcards, setPostcards] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null); // which card is pending delete
  const [copied, setCopied] = useState(null);
  const [copiedUuid, setCopiedUuid] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('my_postcards') || '[]');
    setPostcards(saved.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeletingId(confirmId);
    setConfirmId(null);
    try {
      // Find the card in local state to get its Telegram message_id
      const card = postcards.find(c => c.id === confirmId);
      await deleteTelegramMessage(card?.message_id);
      await deletePostcardById(confirmId);
    } catch (e) {
      console.error('Delete failed:', e);
    } finally {
      const updated = JSON.parse(localStorage.getItem('my_postcards') || '[]').filter(c => c.id !== confirmId);
      localStorage.setItem('my_postcards', JSON.stringify(updated));
      setPostcards(updated);
      setDeletingId(null);
    }
  };

  const handleCopyLink = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/card/${id}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyUuid = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedUuid(id);
    setTimeout(() => setCopiedUuid(null), 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-obsidian bg-noise">
        {/* Header */}
        <header className="border-b border-rim/50 px-6 lg:px-12 py-5">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Back button — acts as browser back */}
              <button
                onClick={() => navigate(-1)}
                className="w-8 h-8 flex items-center justify-center border border-rim hover:border-gold/40 rounded-sm text-muted hover:text-champagne transition-all mr-1"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                <Inbox className="w-4 h-4 text-gold" />
              </div>
              <h1 className="font-display text-xl font-light tracking-widest text-champagne uppercase">Outbox</h1>
            </div>
            <Link to="/create" className="flex items-center gap-2 text-sm font-sans text-muted hover:text-champagne border border-rim hover:border-gold/40 transition-all px-4 py-2 rounded-sm">
              <PenSquare className="w-3.5 h-3.5" />
              New Postcard
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
          <div className="mb-12">
            <p className="font-display text-5xl lg:text-6xl font-light italic text-luminary mb-3">Your Correspondence</p>
            <div className="w-16 h-px bg-gradient-to-r from-gold/60 to-transparent" />
            <p className="text-muted text-sm mt-4 font-sans font-light tracking-wide">Postcards saved on this device</p>
          </div>

          {postcards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-rim/50 rounded-sm bg-panel/50">
              <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-gold/40" />
              </div>
              <h2 className="font-display text-3xl font-light italic text-luminary/60 mb-3">No letters sent yet</h2>
              <p className="text-muted text-sm mb-8 font-sans">Your outbox awaits its first correspondent.</p>
              <Link to="/create" className="inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 hover:border-gold/60 text-champagne px-6 py-2.5 rounded-sm text-sm font-sans transition-all">
                Compose your first postcard
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {postcards.map((card, i) => (
                <div key={card.id}
                  className="group flex items-center justify-between bg-panel border border-rim/50 hover:border-gold/30 rounded-sm px-5 py-4 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-transparent border border-gold/20 flex items-center justify-center shrink-0">
                      <span className="text-gold/60 text-xs font-display italic">✦</span>
                    </div>
                    <div>
                      <p className="font-display text-lg font-light text-luminary">To: <span className="italic">{card.to || 'Unknown'}</span></p>
                      <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5 font-sans">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(card.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      {/* Supabase UUID for admin lookup */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="font-mono text-[10px] text-muted/50 tracking-tight select-all">{card.id}</span>
                        <button
                          onClick={() => handleCopyUuid(card.id)}
                          title="Copy UUID"
                          className="flex items-center justify-center w-4 h-4 rounded-sm text-muted/40 hover:text-gold/70 hover:bg-gold/10 transition-all shrink-0"
                        >
                          {copiedUuid === card.id ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 text-gold/70"><polyline points="20 6 9 17 4 12"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCopyLink(card.id)}
                      className="text-xs font-sans text-muted hover:text-champagne px-3 py-1.5 border border-rim hover:border-gold/30 rounded-sm transition-all">
                      {copied === card.id ? '✓ Copied' : 'Copy Link'}
                    </button>
                    <button
                      onClick={() => setConfirmId(card.id)}
                      disabled={deletingId === card.id}
                      className="w-8 h-8 flex items-center justify-center text-muted hover:text-red-400/80 hover:bg-red-500/10 rounded-sm transition-all disabled:opacity-30">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Link to={`/card/${card.id}`}
                      className="w-8 h-8 flex items-center justify-center text-muted hover:text-gold border border-rim hover:border-gold/30 rounded-sm transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── CUSTOM DELETE MODAL ── */}
      <AnimatePresence>
        {confirmId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setConfirmId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-panel border border-rim rounded-sm p-6 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400/80" />
              </div>

              {/* Gold divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/30" />
                <span className="text-gold/30 text-xs">✦</span>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/30" />
              </div>

              <h3 className="font-display text-2xl font-light italic text-luminary mb-2">Recall this postcard?</h3>
              <p className="text-muted text-sm font-sans leading-relaxed mb-7">
                This will permanently remove the postcard from your outbox and delete it from our servers. The recipient's link will stop working.
              </p>

              <div className="flex flex-col gap-2.5 w-full">
                <button
                  onClick={handleDelete}
                  className="w-full py-2.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/50 text-red-400 font-sans text-sm rounded-sm transition-all"
                >
                  Yes, delete permanently
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="w-full py-2.5 border border-rim hover:border-gold/30 text-muted hover:text-champagne font-sans text-sm rounded-sm transition-all"
                >
                  Keep it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
