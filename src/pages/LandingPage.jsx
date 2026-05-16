import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight, Inbox, Flower, Sliders, Stamp, Share2,
  PenLine, ImagePlus, Sparkles, Send, Heart, Clock, Globe, Infinity as InfinityIcon
} from 'lucide-react';
import Postcard from '../components/Postcard';

/* ─────────────────────────────────────────────────────── */
/*  DATA                                                    */
/* ─────────────────────────────────────────────────────── */

const FEATURES = [
  { icon: <Flower className="w-5 h-5" />,  title: 'Botanical Florals',  desc: '19 hand-illustrated botanicals — from Japanese Anemone to Bird of Paradise — drawn in the tradition of Victorian herbarium prints.' },
  { icon: <Sliders className="w-5 h-5" />,  title: 'Film Filters',       desc: '29 analog-inspired filters rendered entirely in CSS — no library required. Warm, cool, fade, noir, vintage, and more.' },
  { icon: <Stamp className="w-5 h-5" />,    title: 'Artisan Stamps',     desc: '6 collector-grade stamp designs, each themed around the quiet poetry of seasonal nature.' },
  { icon: <Share2 className="w-5 h-5" />,   title: 'Share by Link',      desc: 'One link. No app download. Your recipient opens it like unwrapping a letter.' },
];

const STEPS = [
  { num: '01', icon: <PenLine className="w-5 h-5" />,   title: 'Compose',   desc: 'Write to someone. Use their name. Say the thing you\'ve been meaning to say.' },
  { num: '02', icon: <ImagePlus className="w-5 h-5" />, title: 'Attach',    desc: 'Upload a photo from a shared moment. Crop it, give it a film look.' },
  { num: '03', icon: <Stamp className="w-5 h-5" />,     title: 'Adorn',     desc: 'Choose a stamp and a botanical that speaks to you. Make it yours.' },
  { num: '04', icon: <Send className="w-5 h-5" />,      title: 'Deliver',   desc: 'Copy the link. Send it. Watch them flip it over.' },
];

const HISTORY = [
  { year: '1869', event: 'Austria-Hungary issues the world\'s first official postal card — plain, government-issue, purely functional.' },
  { year: '1870', event: 'The first illustrated postcard appears during the Franco-Prussian War. A picture added to a card changed everything.' },
  { year: '1900s', event: 'The Golden Age of Postcards. Billions exchanged annually. Artists competed for the most ornate botanical and landscape illustrations.' },
  { year: '1918', event: 'After WWI, soldiers carried postcards as a way to send love home across impossible distances. Many survive in attic boxes today.' },
  { year: '2026', event: 'Correspondance. The same ritual — botanicals, stamps, a personal note — now travels at the speed of a link.' },
];

const BOTANICALS = [
  { name: 'Japanese Anemone', img: '/flowers/anemone.png',  note: 'Sincerity' },
  { name: 'Oriental Lily',    img: '/flowers/lily.png',     note: 'Devotion' },
  { name: 'Sunflower',        img: '/flowers/sunflower.png',note: 'Warmth' },
  { name: 'Peony',            img: '/flowers/peony.png',    note: 'Prosperity' },
  { name: 'Wisteria',         img: '/flowers/wisteria.png', note: 'Longing' },
  { name: 'Magnolia',         img: '/flowers/magnolia.png', note: 'Dignity' },
  { name: 'Dicentra',         img: '/flowers/dicentra.png', note: 'Tender heart' },
  { name: 'Red Poppy',        img: '/flowers/poppy.png',    note: 'Remembrance' },
];

const STATS = [
  { value: '19',      label: 'Botanical illustrations' },
  { value: '29',      label: 'Analog film filters' },
  { value: '6',       label: 'Artisan stamp designs' },
  { isIcon: true,     label: 'Moments preserved' },
];

const SAMPLE_POSTCARDS = [
  {
    to: 'Ma', from: 'Your son',
    message: "Wishing you were here. The light here reminds me of Sunday mornings at home.",
    decoration: '/flowers/peony.png', stamp: '/stamps/stamp2.webp', image_filter: '',
    previewUrl: '',
  },
  {
    to: 'Aditi', from: 'Rohan',
    message: "Every city I visit, I think about how much you'd love it. Saving this one for us.",
    decoration: '/flowers/wisteria.png', stamp: '/stamps/stamp3.webp', image_filter: '',
    previewUrl: '',
  },
];

/* ─────────────────────────────────────────────────────── */
/*  REUSABLE ANIMATION WRAPPER                             */
/* ─────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-5 mb-16">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-rim/40" />
      <span className="text-gold/50 text-[10px] font-sans uppercase tracking-[0.4em] shrink-0">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-rim/40" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  PAGE                                                    */
/* ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  const landingPostcard = {
    to: "You",
    from: "Correspondance",
    message: "Some things are worth slowing down for. A photograph. A few honest words. A flower pressed between pages.",
    decoration: '/flowers/anemone.png',
    stamp: '/stamps/stamp1.webp',
    image_filter: '',
  };

  return (
    <div className="min-h-screen bg-obsidian overflow-x-hidden flex flex-col">

      {/* ── Ambient glow ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(200,169,110,0.07)_0%,transparent_70%)]" />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(200,169,110,0.04)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-[radial-gradient(ellipse,rgba(200,169,110,0.03)_0%,transparent_70%)]" />
      </div>

      {/* ══════════════════════════════════ HEADER ══ */}
      <header className="relative z-20 flex items-center justify-between px-6 lg:px-16 py-6 border-b border-rim/30">
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

      <main className="relative z-10 flex flex-col items-center">

        {/* ══════════════════════════════════ HERO ══ */}
        <section className="w-full flex flex-col items-center px-6 text-center pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/50" />
              <span className="text-gold/60 text-[10px] tracking-[0.5em] font-sans uppercase">Atelier · Est. 2026</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/50" />
            </div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-light text-luminary leading-[0.95] mb-3">
              Send moments
            </h1>
            <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl font-light italic text-gradient-gold leading-[0.95] mb-10">
              that last forever.
            </h2>

            <p className="text-muted font-sans text-base lg:text-lg font-light max-w-lg leading-relaxed mb-12">
              A digital atelier for crafting handcrafted postcards — adorned with botanicals decorations,
              analog filters, and artisan stamps — delivered by a single link.
            </p>

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

          {/* Hero postcard */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ duration: 1.1, delay: 0.5, ease: 'easeOut' }}
            className="mt-20 w-full max-w-md lg:max-w-lg"
          >
            <Postcard data={landingPostcard} isInteractive={false} noShadow={false} />
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 w-full max-w-2xl"
          >
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                {s.isIcon
                  ? <InfinityIcon className="w-9 h-9 text-gold/80" strokeWidth={1.25} />
                  : <span className="font-display text-4xl font-light text-gold/80">{s.value}</span>
                }
                <span className="text-muted text-[10px] font-sans uppercase tracking-[0.2em]">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════ MANIFESTO ══ */}
        <section className="w-full max-w-5xl mx-auto px-6 py-24 border-t border-rim/30">
          <Reveal>
            <div className="relative flex flex-col items-center text-center">
              {/* Large decorative quote mark */}
              <span className="font-display text-[120px] lg:text-[180px] leading-none text-gold/8 absolute -top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none">
                "
              </span>
              <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-light italic text-luminary/90 max-w-3xl leading-relaxed relative z-10">
                There is a tenderness in receiving a handwritten note — a proof that someone
                paused their life to think of yours.
              </p>
              <div className="flex items-center gap-3 mt-8">
                <div className="w-8 h-px bg-gold/30" />
                <span className="text-muted/50 text-[11px] font-sans italic tracking-wide">On the art of correspondence</span>
                <div className="w-8 h-px bg-gold/30" />
              </div>
            </div>
          </Reveal>
        </section>

        {/* ══════════════════════════════════ ORIGIN ══ */}
        <section className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-rim/30">
          <Reveal>
            <SectionDivider label="Origin & History" />
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <h2 className="font-display text-4xl lg:text-5xl font-light text-luminary mb-6 leading-tight">
                  A ritual older<br />
                  <span className="italic text-gradient-gold">than photography.</span>
                </h2>
                <p className="text-muted font-sans text-sm leading-relaxed mb-5">
                  The postcard was born not from sentimentality, but practicality. In 1869, the
                  Austro-Hungarian Empire issued the world's first official postal card — a plain
                  rectangle of government cardstock, cheaper to send than a sealed letter.
                </p>
                <p className="text-muted font-sans text-sm leading-relaxed mb-5">
                  Within a year, someone added a picture. That small act — placing an image beside
                  a personal message — changed how people shared their world. By the early 1900s,
                  postcard exchange had become a mass cultural phenomenon. Artists competed to
                  illustrate the most exquisite botanicals, landscapes, and portraits.
                </p>
                <p className="text-muted font-sans text-sm leading-relaxed">
                  During wartime, soldiers carried blank postcards the way we carry charged phones.
                  A few words. A name. Proof that someone, somewhere, was thinking of you.
                  <span className="text-champagne/70"> That impulse has never changed.</span>
                </p>
              </div>
            </Reveal>

            {/* Timeline */}
            <Reveal delay={0.15}>
              <div className="relative pl-6 border-l border-rim/40 space-y-8">
                {HISTORY.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="relative"
                  >
                    {/* Dot */}
                    <div className={`absolute -left-[1.82rem] top-1 w-2.5 h-2.5 rounded-full border ${
                      i === HISTORY.length - 1
                        ? 'border-gold bg-gold/30'
                        : 'border-rim/60 bg-obsidian'
                    }`} />
                    <span className={`font-display text-xs tracking-[0.2em] mb-1 block ${
                      i === HISTORY.length - 1 ? 'text-gold' : 'text-muted/60'
                    }`}>
                      {h.year}
                    </span>
                    <p className="text-luminary/80 font-sans text-sm leading-relaxed">{h.event}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════ SENTIMENTAL VALUE ══ */}
        <section className="w-full border-t border-rim/30 py-24 bg-[radial-gradient(ellipse_at_50%_50%,rgba(200,169,110,0.04)_0%,transparent_70%)]">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal>
              <SectionDivider label="Why It Matters" />
            </Reveal>

            <div className="grid lg:grid-cols-3 gap-8 mb-20">
              {[
                {
                  icon: <Heart className="w-5 h-5" />,
                  title: 'Emotional weight',
                  body: 'A postcard carries emotional specificity that a text message cannot. It implies forethought — someone chose a photo, chose words, chose a flower. That labour is felt by the receiver.',
                },
                {
                  icon: <Clock className="w-5 h-5" />,
                  title: 'Made to keep',
                  body: 'Postcards are rarely thrown away. They are pinned to corkboards, tucked into journals, kept in shoeboxes. A well-made postcard outlives the phone it was shared on.',
                },
                {
                  icon: <Globe className="w-5 h-5" />,
                  title: 'Bridges distance',
                  body: 'Distance is the natural enemy of intimacy. A postcard from a place you visited — a photo, a message, a stamp — collapses geography into something holdable.',
                },
              ].map((card, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-7 border border-rim/40 hover:border-gold/25 rounded-sm bg-panel/30 hover:bg-panel/60 transition-all group h-full">
                    <span className="text-gold/60 group-hover:text-gold/90 transition-colors mb-4 block">
                      {card.icon}
                    </span>
                    <h3 className="font-display text-lg font-light text-luminary mb-3">{card.title}</h3>
                    <p className="text-muted font-sans text-sm leading-relaxed">{card.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Pull stat */}
            <Reveal>
              <div className="border border-gold/15 rounded-sm p-10 lg:p-14 bg-panel/20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.05)_0%,transparent_70%)] pointer-events-none" />
                <p className="font-display text-5xl lg:text-7xl font-light italic text-gradient-gold mb-4 relative z-10">
                  "The hand that writes<br className="hidden lg:block" /> still matters."
                </p>
                <p className="text-muted/60 font-sans text-xs tracking-[0.25em] uppercase relative z-10">
                  Even in a digital world — the personal touch is irreplaceable
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════ HOW IT WORKS ══ */}
        <section className="w-full max-w-5xl mx-auto px-6 py-24 border-t border-rim/30">
          <Reveal>
            <SectionDivider label="How It Works" />
          </Reveal>

          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl lg:text-5xl font-light text-luminary mb-4">
                Four steps to something<br />
                <span className="italic text-gradient-gold">worth keeping.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="relative p-6 border border-rim/40 hover:border-gold/30 rounded-sm bg-panel/20 hover:bg-panel/50 transition-all group h-full">
                  {/* Step number — decorative bg */}
                  <span className="absolute top-4 right-5 font-display text-5xl font-light text-gold/8 select-none">
                    {step.num}
                  </span>
                  <span className="text-gold/60 group-hover:text-gold/90 transition-colors mb-5 block">
                    {step.icon}
                  </span>
                  <h3 className="font-display text-lg font-light text-luminary mb-2">{step.title}</h3>
                  <p className="text-muted font-sans text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="flex justify-center mt-12">
              <Link
                to="/create"
                className="group flex items-center gap-3 bg-gradient-to-r from-gold/90 to-champagne/80 hover:from-gold hover:to-champagne text-obsidian px-10 py-4 rounded-sm font-sans font-medium text-sm transition-all shadow-gold"
              >
                Start creating
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ══════════════════════════════════ BOTANICAL SHOWCASE ══ */}
        <section className="w-full border-t border-rim/30 py-24">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal>
              <SectionDivider label="The Botanicals" />
            </Reveal>

            <Reveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-4xl lg:text-5xl font-light text-luminary mb-4">
                  Each flower carries<br />
                  <span className="italic text-gradient-gold">a meaning.</span>
                </h2>
                <p className="text-muted font-sans text-sm max-w-md mx-auto leading-relaxed">
                  Drawn in the Victorian tradition of florography — where every bloom was a
                  silent vocabulary. Choose the one that says what words cannot.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {BOTANICALS.map((flower, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="flex flex-col items-center gap-2 group cursor-default">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-cream/60 border border-rim/30 group-hover:border-gold/40 flex items-center justify-center transition-all group-hover:bg-cream/80 shadow-sm">
                      <img
                        src={flower.img}
                        alt={flower.name}
                        className="w-10 h-10 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[9px] font-sans text-muted/60 group-hover:text-gold/80 text-center leading-tight transition-colors uppercase tracking-wide">
                      {flower.note}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <p className="text-center text-muted/40 text-[11px] font-sans italic mt-8">
                · 19 total botanical decorations available in the creator ·
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════ SAMPLE POSTCARDS ══ */}
        <section className="w-full border-t border-rim/30 py-24">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal>
              <SectionDivider label="In the Atelier" />
            </Reveal>

            <Reveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-4xl lg:text-5xl font-light text-luminary mb-4">
                  Letters waiting<br />
                  <span className="italic text-gradient-gold">to be sent.</span>
                </h2>
                <p className="text-muted font-sans text-sm max-w-sm mx-auto">
                  Every message is personal. Every arrangement unique.
                </p>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 gap-10 max-w-3xl mx-auto">
              {SAMPLE_POSTCARDS.map((card, i) => (
                <Reveal key={i} delay={i * 0.15}>
                  <motion.div
                    whileHover={{ y: -4, rotate: i === 0 ? -1 : 1 }}
                    style={{ rotate: i === 0 ? -1.5 : 1 }}
                    className="transition-shadow duration-300"
                  >
                    <Postcard data={card} isInteractive={false} noShadow={false} />
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════ FEATURES ══ */}
        <section className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-rim/30">
          <Reveal>
            <SectionDivider label="Craftsmanship" />
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="flex flex-col items-start p-6 border border-rim/40 hover:border-gold/30 rounded-sm bg-panel/30 hover:bg-panel/70 transition-all group h-full">
                  <span className="text-gold/60 group-hover:text-gold/90 transition-colors mb-4 block">
                    {f.icon}
                  </span>
                  <h3 className="font-display text-base font-medium text-luminary mb-2">{f.title}</h3>
                  <p className="text-muted text-xs font-sans leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════ FINAL CTA ══ */}
        <section className="w-full max-w-5xl mx-auto px-6 py-24 border-t border-rim/30">
          <Reveal>
            <div className="relative border border-gold/20 rounded-sm p-12 lg:p-20 text-center overflow-hidden bg-panel/20">
              {/* Decorative corner flourishes */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-gold/30" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-gold/30" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-gold/30" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-gold/30" />

              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.06)_0%,transparent_70%)] pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/50" />
                  <Sparkles className="w-4 h-4 text-gold/60" />
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/50" />
                </div>

                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-luminary mb-4 leading-tight">
                  Someone is waiting<br />
                  <span className="italic text-gradient-gold">to hear from you.</span>
                </h2>
                <p className="text-muted font-sans text-sm max-w-sm leading-relaxed mb-10">
                  It takes three minutes to make something they will keep for years.
                </p>
                <Link
                  to="/create"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-gold/90 to-champagne/80 hover:from-gold hover:to-champagne text-obsidian px-10 py-4 rounded-sm font-sans font-medium text-sm transition-all shadow-gold"
                >
                  Begin composing
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Bottom ornament */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-rim/50" />
          <span className="text-muted/30 text-[10px] tracking-[0.3em] font-sans uppercase">Correspondance</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-rim/50" />
        </div>

      </main>

      {/* ══════════════════════════════════ FOOTER ══ */}
      <footer className="relative z-10 shrink-0 py-10 border-t border-rim/30 bg-obsidian/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/40" />
            <span className="text-gold/60 text-sm">✦</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/40" />
          </div>
          <p className="font-sans text-xs tracking-[0.2em] text-muted uppercase">
            Crafted by{' '}
            <a
              href="https://wa.me/918777845713"
              target="_blank"
              rel="noopener noreferrer"
              className="text-champagne hover:text-gold transition-colors duration-300 underline underline-offset-4 decoration-gold/30"
            >
              Shovith
            </a>
          </p>
          <p className="text-[10px] font-sans text-muted/40 italic">© 2026 Correspondance · Made with care</p>
          <div className="flex items-center gap-5 mt-1">
            <Link
              to="/privacy"
              className="text-[10px] font-sans text-muted/40 hover:text-gold/70 transition-colors tracking-wide"
            >
              Privacy Policy
            </Link>
            <span className="text-muted/20 text-[10px]">·</span>
            <Link
              to="/terms"
              className="text-[10px] font-sans text-muted/40 hover:text-gold/70 transition-colors tracking-wide"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
