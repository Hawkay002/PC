import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian bg-noise flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative flex flex-col items-center">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-20 h-px bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-gold/40 font-display text-sm tracking-widest">404</span>
          <div className="w-20 h-px bg-gradient-to-l from-transparent to-gold/40" />
        </div>

        <p className="font-display text-6xl lg:text-7xl font-light italic text-luminary mb-4">
          Lost in the mail
        </p>

        <p className="text-muted text-sm font-sans font-light max-w-xs mb-10 leading-relaxed">
          We couldn't find the postcard you're looking for. The link may be broken, or the letter has been returned to sender.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 hover:border-gold/60 text-champagne px-8 py-3 rounded-sm text-sm font-sans uppercase tracking-[0.15em] transition-all"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
