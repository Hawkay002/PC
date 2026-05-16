import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Clock, ArrowRight, PenSquare, Trash2, Inbox,
  ArrowLeft, AlertTriangle, Copy, Check, Link2, ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Postcard from '../components/Postcard';

// ─── Supabase helpers ───────────────────────────────────────────────────────
async function deleteTelegramMessage(message_id) {
  if (!message_id) return;
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

// ─── UUID copy strip ────────────────────────────────────────────────────────
function UuidStrip({ id }) {
  const [copied, setCopied] = useState(false);
  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-2 bg-obsidian/60 border border-rim/40 rounded-sm px-3 py-1.5 mt-3">
      <span className="text-[9px] font-sans text-gold/40 uppercase tracking-widest shrink-0">UUID</span>
      <span className="font-mono text-[10px] text-muted/60 flex-1 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
        {id}
      </span>
      <button
        onClick={copy}
        title="Copy UUID"
        className="shrink-0 flex items-center justify-center w-5 h-5 rounded-sm text-muted/40 hover:text-gold/70 hover:bg-gold/10 transition-all"
      >
        {copied
          ? <Check className="w-3 h-3 text-gold/70" />
          : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
}

// ─── Single postcard card ───────────────────────────────────────────────────
function PostcardCard({ card, onConfirmDelete, deletingId }) {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/card/${card.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="bg-panel border border-rim/50 hover:border-gold/25 rounded-sm p-5 transition-colors duration-300"
    >
      {/* ── Top meta bar ── */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-light text-luminary leading-tight">
            To: <span className="italic">{card.to || 'Unknown'}</span>
          </p>
          {card.from && (
            <p className="font-display text-sm font-light text-muted/70 leading-tight mt-0.5">
              From: <span className="italic">{card.from}</span>
            </p>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted/50 mt-1 font-sans">
            <Clock className="w-3 h-3 shrink-0" />
            <span>{new Date(card.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {/* UUID — full width, never wraps */}
          <UuidStrip id={card.id} />
        </div>

        {/* Action buttons — Link + Open, both h-8 to match */}
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          <button
            onClick={handleCopyLink}
            title="Copy shareable link"
            className="h-8 flex items-center gap-1.5 text-xs font-sans text-muted hover:text-champagne px-2.5 border border-rim hover:border-gold/30 rounded-sm transition-all"
          >
            {copiedLink
              ? <><Check className="w-3 h-3 text-gold" /><span>Copied</span></>
              : <><Link2 className="w-3 h-3" /><span>Link</span></>}
          </button>

          <Link
            to={`/card/${card.id}`}
            title="Open postcard"
            className="h-8 w-8 flex items-center justify-center text-muted hover:text-gold border border-rim hover:border-gold/30 rounded-sm transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Actual Postcard preview ── */}
      <div className="w-full max-w-lg mx-auto">
        <Postcard
          data={{
            to:           card.to,
            from:         card.from,
            message:      card.message,
            decoration:   card.decoration,
            stamp:        card.stamp,
            image_filter: card.image_filter,
            file_id:      card.file_id,
            previewUrl:   card.previewUrl,
          }}
          isInteractive={true}
          showShadow={true}
        />
      </div>

      {/* ── Below postcard: flip hint left, delete right ── */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs font-sans text-muted/40 italic select-none">
          Click postcard to flip
        </p>
        <button
          onClick={() => onConfirmDelete(card.id)}
          disabled={deletingId === card.id}
          title="Delete postcard"
          className="flex items-center gap-1.5 h-7 px-2.5 text-xs font-sans text-muted/50 hover:text-red-400/80 hover:bg-red-500/10 border border-rim/40 hover:border-red-500/30 rounded-sm transition-all disabled:opacity-30"
        >
          {deletingId === card.id
            ? <span className="w-3 h-3 border border-muted/30 border-t-muted/70 rounded-full animate-spin block" />
            : <Trash2 className="w-3 h-3" />}
          <span>Delete</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main dashboard ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [postcards, setPostcards] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('my_postcards') || '[]');
    setPostcards(saved.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

  const handleDelete = async () => {
    if (!confirmId) return;
    const id = confirmId;
    setDeletingId(id);
    setConfirmId(null);
    try {
      const card = postcards.find(c => c.id === id);
      await deleteTelegramMessage(card?.message_id);
      await deletePostcardById(id);
    } catch (e) {
      console.error('Delete failed:', e);
    } finally {
      const updated = JSON.parse(localStorage.getItem('my_postcards') || '[]').filter(c => c.id !== id);
      localStorage.setItem('my_postcards', JSON.stringify(updated));
      setPostcards(updated.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-obsidian bg-noise">
        {/* Header */}
        <header className="border-b border-rim/50 px-6 lg:px-12 py-5">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
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
            <Link
              to="/create"
              className="flex items-center gap-2 text-sm font-sans text-muted hover:text-champagne border border-rim hover:border-gold/40 transition-all px-4 py-2 rounded-sm"
            >
              <PenSquare className="w-3.5 h-3.5" />
              New Postcard
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
          <div className="mb-12">
            <p className="font-display text-5xl lg:text-6xl font-light italic text-luminary mb-3">Your Correspondence</p>
            <div className="w-16 h-px bg-gradient-to-r from-gold/60 to-transparent" />
            <p className="text-muted text-sm mt-4 font-sans font-light tracking-wide">
              Postcards saved on this device · {postcards.length} {postcards.length === 1 ? 'sent' : 'sent'}
            </p>
          </div>

          {postcards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-rim/50 rounded-sm bg-panel/50">
              <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-gold/40" />
              </div>
              <h2 className="font-display text-3xl font-light italic text-luminary/60 mb-3">No letters sent yet</h2>
              <p className="text-muted text-sm mb-8 font-sans">Your outbox awaits its first correspondent.</p>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 hover:border-gold/60 text-champagne px-6 py-2.5 rounded-sm text-sm font-sans transition-all"
              >
                Compose your first postcard
              </Link>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-6">
                {postcards.map((card) => (
                  <PostcardCard
                    key={card.id}
                    card={card}
                    deletingId={deletingId}
                    onConfirmDelete={setConfirmId}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* ── Delete confirmation modal ── */}
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
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400/80" />
              </div>

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
