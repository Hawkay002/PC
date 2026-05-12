import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Inbox } from 'lucide-react';

const FEATURES = [
  { icon: '✿', title: 'Botanical Florals', desc: '16 hand-illustrated botanicals to grace your correspondence.' },
  { icon: '◎', title: 'Film Filters', desc: '39 analog filters that turn every photo into a memory.' },
  { icon: '❧', title: 'Wax Seals', desc: 'Seal your postcard with a cracking wax ritual.' },
  { icon: '↗', title: 'Share Anywhere', desc: 'A single link delivers your postcard to anyone, anywhere.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(200,169,110,0.07)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(200,169,110,0.04)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-6 border-b border-rim/30">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-gradient-to-b from-gold to-gold/20 rounded-full" />
          <span className="font-display text-lg font-light tracking-[0.3em] text-champagne uppercase">Correspondance</span>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xs font-sans text-muted hover:text-champagne border border-rim hover:border-gold/30 px-3.5 py-1.5 rounded-sm transition-all"
        >
          <Inbox className="w-3.5 h-3.5" />
          Outbox
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Ornament */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-gold/60 text-xs tracking-[0.4em] font-sans uppercase">Atelier</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          {/* Title */}
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-light text-luminary leading-none mb-4">
            Send moments
          </h1>
          <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl font-light italic text-gradient-gold leading-none mb-8">
            that last forever.
          </h2>

          {/* Subtitle */}
          <p className="text-muted font-sans text-base lg:text-lg font-light max-w-md leading-relaxed mb-12">
            A digital atelier for crafting handcrafted postcards — adorned with botanicals, film filters, and wax seals — delivered by link.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/create"
              className="group flex items-center gap-3 bg-gradient-to-r from-gold/90 to-champagne/80 hover:from-gold hover:to-champagne text-obsidian px-8 py-3.5 rounded-sm font-sans font-medium text-sm transition-all shadow-gold"
            >
              Begin composing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 border border-rim hover:border-gold/40 text-muted hover:text-champagne px-8 py-3.5 rounded-sm font-sans text-sm transition-all"
            >
              View your outbox
            </Link>
          </div>
        </motion.div>

        {/* Decorative postcard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="mt-20 w-full max-w-xs sm:max-w-sm relative"
        >
          {/* Shadow card behind */}
          <div className="absolute inset-0 bg-panel border border-rim/30 rounded-sm translate-x-3 translate-y-3" />
          {/* Main preview card */}
          <div className="relative bg-[#EDE5D4] rounded-sm border border-ink/10 overflow-hidden aspect-[3/2]">
            {/* Postcard header */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 font-serif tracking-[0.35em] text-[9px] text-ink/30 uppercase">Postcard</div>
            <div className="absolute top-6 left-3 right-3 h-px bg-ink/10" />
            {/* Floral decoration */}
            <div className="absolute left-0 bottom-0 top-8 w-[45%] flex items-center justify-center overflow-hidden opacity-80">
              <img src="/flowers/peony.png" alt="" className="w-40 h-40 object-contain translate-x-4" />
            </div>
            {/* Divider */}
            <div className="absolute top-8 bottom-2 left-[45%] w-px bg-ink/10" />
            {/* Text side */}
            <div className="absolute top-8 right-2 left-[47%] bottom-2 flex flex-col justify-between py-2">
              <div className="absolute top-2 right-1">
                <img src="/stamps/stamp1.webp" alt="" className="w-10 h-12 object-contain" />
              </div>
              <div className="font-serif text-ink/60 text-xs pt-2">
                <p><span className="italic font-bold">To</span> <span className="font-medium">Emma</span></p>
              </div>
              <p className="font-script text-base text-ink leading-6 pr-2 flex-1 mt-1 overflow-hidden">
                Thinking of you from across the miles…
              </p>
              <div className="font-serif text-ink/60 text-xs">
                <p><span className="italic font-bold">From</span> <span className="font-medium">James</span></p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-3xl"
        >
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-5 border border-rim/40 hover:border-gold/25 rounded-sm bg-panel/40 hover:bg-panel/80 transition-all group"
            >
              <span className="text-gold/60 text-2xl mb-3 group-hover:text-gold/90 transition-colors">{f.icon}</span>
              <h3 className="font-display text-sm font-medium text-luminary mb-1.5">{f.title}</h3>
              <p className="text-muted text-[11px] font-sans leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Bottom ornament */}
        <div className="mt-20 flex items-center gap-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-rim/50" />
          <span className="text-muted/40 text-[10px] tracking-[0.3em] font-sans uppercase">Correspondance</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-rim/50" />
        </div>
      </main>
    </div>
  );
}
