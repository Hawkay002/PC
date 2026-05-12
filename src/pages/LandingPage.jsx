import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Inbox, Flower2, Sliders, Stamp, Share2 } from 'lucide-react';
import Postcard from '../components/Postcard';

const FEATURES = [
  { icon: <Flower2 className="w-6 h-6" />, title: 'Botanical Florals', desc: '16 hand-illustrated botanicals to grace your correspondence.' },
  { icon: <Sliders className="w-6 h-6" />, title: 'Film Filters', desc: '39 analog filters that turn every photo into a memory.' },
  { icon: <Stamp className="w-6 h-6" />, title: 'Wax Seals', desc: 'Seal your postcard with a cracking wax ritual.' },
  { icon: <Share2 className="w-6 h-6" />, title: 'Share Anywhere', desc: 'A single link delivers your postcard to anyone, anywhere.' },
];

export default function LandingPage() {
  [span_7](start_span)[span_8](start_span)// Configuration for the original postcard on landing[span_7](end_span)[span_8](end_span)
  const landingPageData = {
    to: "Y'all",
    from: "Shovith",
    message: "Create your own postcard @ epost.vercel.app. 4 custom made stamps and 16 flower decoration designs for you to decorate your postcard.",
    decoration: "/flowers/anemone.png", // Default Japanese Anemone
    stamp: "/stamps/stamp1.webp",      // Default Autumn's Yield
    image_filter: ""
  };

  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(200,169,110,0.07)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(200,169,110,0.04)_0%,transparent_70%)]" />
      </div>

      [span_9](start_span){/* Header[span_9](end_span) */}
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

      [span_10](start_span){/* Hero[span_10](end_span) */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          [span_11](start_span){/* Ornament[span_11](end_span) */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-gold/60 text-xs tracking-[0.4em] font-sans uppercase">Atelier</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          [span_12](start_span){/* Title[span_12](end_span) */}
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-light text-luminary leading-none mb-4">
            Send moments
          </h1>
          <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl font-light italic text-gradient-gold leading-none mb-8">
            that last forever.
          </h2>

          [span_13](start_span){/* Subtitle[span_13](end_span) */}
          <p className="text-muted font-sans text-base lg:text-lg font-light max-w-md leading-relaxed mb-12">
            A digital atelier for crafting handcrafted postcards — adorned with botanicals, film filters, and wax seals — delivered by link.
          </p>

          [span_14](start_span){/* CTAs[span_14](end_span) */}
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

        [span_15](start_span)[span_16](start_span){/* Decorative Postcard Component[span_15](end_span)[span_16](end_span) */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="mt-20 w-full max-w-md lg:max-w-lg z-20"
        >
          <Postcard 
            data={landingPageData} 
            isInteractive={false} 
            showShadow={true} 
          />
        </motion.div>

        [span_17](start_span)[span_18](start_span){/* Features row[span_17](end_span)[span_18](end_span) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl"
        >
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-5 border border-rim/40 hover:border-gold/25 rounded-sm bg-panel/40 hover:bg-panel/80 transition-all group"
            >
              <span className="text-gold/60 mb-3 group-hover:text-gold/90 transition-colors">
                {f.icon}
              </span>
              <h3 className="font-display text-sm font-medium text-luminary mb-1.5">{f.title}</h3>
              <p className="text-muted text-[11px] font-sans leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        [span_19](start_span){/* Bottom ornament[span_19](end_span) */}
        <div className="mt-20 flex items-center gap-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-rim/50" />
          <span className="text-muted/40 text-[10px] tracking-[0.3em] font-sans uppercase">Correspondance</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-rim/50" />
        </div>
      </main>

      [span_20](start_span){/* Footer with WhatsApp Link[span_20](end_span) */}
      <footer className="relative z-10 shrink-0 py-8 border-t border-rim/30 bg-obsidian/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/40" />
            <span className="text-gold/60 text-sm">✦</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/40" />
          </div>
          
          <p className="font-sans text-xs tracking-[0.2em] text-muted uppercase">
            Crafted by{" "}
            <a 
              href="https://wa.me/918777845713" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-champagne hover:text-gold transition-colors duration-300 underline underline-offset-4 decoration-gold/30"
            >
              Shovith Debnath
            </a>
          </p>
          
          <p className="text-[10px] font-sans text-muted/40 italic">
            © 2026 Correspondance
          </p>
        </div>
      </footer>
    </div>
  );
}
