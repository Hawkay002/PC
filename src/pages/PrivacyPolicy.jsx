import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';

const LAST_UPDATED = 'May 16, 2026';
const EFFECTIVE_DATE = 'May 16, 2026';

const SECTIONS = [
  {
    id: '1',
    title: 'Who We Are',
    content: [
      `Correspondance ("we", "our", or "us") is a digital postcard atelier operated at epost.vercel.app. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it.`,
      `If you have any questions or concerns about this notice or our practices with regard to your personal information, please contact us at the details provided at the end of this document.`,
    ],
  },
  {
    id: '2',
    title: 'Information We Collect',
    subsections: [
      {
        heading: '2.1 Information you provide directly',
        items: [
          'Postcard content — the recipient name, personal message, and sender name you compose.',
          'Images — photographs you upload to include in your postcard.',
          'No account, email address, or payment information is ever collected.',
        ],
      },
      {
        heading: '2.2 Information collected automatically',
        items: [
          'Browser type, operating system, and device identifiers via standard server logs.',
          'IP address, approximate geographic region (country/city level), and referral URL.',
          'Pages visited and time spent — collected to understand aggregate usage, not to build individual profiles.',
        ],
      },
      {
        heading: '2.3 Locally stored data',
        items: [
          'Your outbox (the list of postcards you have sent) is stored in your browser\'s localStorage. This data never leaves your device unless you explicitly share a postcard link.',
          'We do not use third-party tracking cookies or advertising pixels.',
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'How We Use Your Information',
    content: [
      `We use the information we collect solely to provide, maintain, and improve the Correspondance service. Specifically:`,
    ],
    bullets: [
      'To render and deliver your postcard to the recipient via a unique shareable link.',
      'To store your postcard image securely via Telegram\'s file infrastructure and metadata in our Supabase database.',
      'To diagnose errors and improve service reliability using aggregated, anonymised log data.',
      'To respond to support requests if you contact us directly.',
    ],
    footer: 'We do not sell, trade, or otherwise transfer your information to third parties for marketing purposes. We do not use your postcard content to train machine-learning models.',
  },
  {
    id: '4',
    title: 'How We Store and Protect Your Data',
    content: [
      `Your postcard images are transmitted to and stored within Telegram's servers using their Bot API. Telegram applies its own encryption and security standards. Postcard metadata (recipient name, message, filter, stamp, file reference) is stored in a Supabase (PostgreSQL) database hosted on infrastructure subject to SOC 2 Type II controls.`,
      `All data in transit between your browser and our servers is encrypted via TLS 1.2 or higher. We implement access controls to limit who can query the database to authorised service accounts only.`,
      `While we take reasonable precautions, no method of electronic storage or transmission over the internet is 100% secure. We cannot guarantee absolute security.`,
    ],
  },
  {
    id: '5',
    title: 'Data Retention',
    content: [
      `Postcard records are retained in our database until you explicitly delete them from your Outbox. Upon deletion, we remove both the database record and the associated image from Telegram's servers using the deleteMessage API.`,
      `Server access logs are retained for up to 90 days and then automatically purged.`,
      `Data stored in your browser's localStorage persists until you clear your browser storage or uninstall your browser. This is entirely within your control.`,
    ],
  },
  {
    id: '6',
    title: 'Sharing of Information',
    content: [
      `We share your information only in the following limited circumstances:`,
    ],
    bullets: [
      'Service providers — Supabase (database hosting) and Telegram (image storage) receive the minimum data necessary to operate the service. Both are bound by their respective data processing terms.',
      'Legal obligations — we may disclose information if required by law, subpoena, or other legal process, or if we believe in good faith that disclosure is necessary to protect our rights or prevent harm.',
      'Business transfers — in the event of a merger or acquisition, your information may be transferred as part of that transaction. We will notify you before your information becomes subject to a different privacy policy.',
    ],
    footer: 'We do not share postcard content, images, or messages with any advertising network.',
  },
  {
    id: '7',
    title: 'Your Rights and Choices',
    content: [
      `Depending on your location, you may have the following rights regarding your personal data:`,
    ],
    subsections: [
      {
        heading: 'Access and portability',
        items: ['You may request a copy of the personal data we hold about you.'],
      },
      {
        heading: 'Deletion ("Right to be forgotten")',
        items: [
          'You may delete any postcard from your Outbox at any time — this removes the record from our database and the image from Telegram.',
          'You may request complete deletion of any data associated with your IP address by contacting us.',
        ],
      },
      {
        heading: 'Correction',
        items: ['If any information we hold is inaccurate, you may request correction.'],
      },
      {
        heading: 'Objection and restriction',
        items: ['You may object to or request restriction of processing of your data under certain circumstances.'],
      },
    ],
    footer: 'To exercise any of these rights, please contact us. We will respond within 30 days. You also have the right to lodge a complaint with your local data protection authority.',
  },
  {
    id: '8',
    title: 'Children\'s Privacy',
    content: [
      `Correspondance is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to remove that information promptly.`,
    ],
  },
  {
    id: '9',
    title: 'International Data Transfers',
    content: [
      `Correspondance is operated from India. If you are accessing the service from the European Economic Area, United Kingdom, or other regions with data protection laws, please be aware that your information may be transferred to and processed in countries that may not have the same data protection laws as your jurisdiction.`,
      `Where required by applicable law, we rely on appropriate transfer mechanisms (such as Standard Contractual Clauses) to ensure your data is protected. Our third-party processors (Supabase, Telegram) have their own internationally recognised compliance frameworks.`,
    ],
  },
  {
    id: '10',
    title: 'Changes to This Policy',
    content: [
      `We may update this Privacy Policy from time to time. The updated version will be indicated by a revised "Last Updated" date at the top of this page. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.`,
      `For material changes, we will make reasonable efforts to provide notice — such as updating the date prominently or adding a notice on the landing page.`,
    ],
  },
  {
    id: '11',
    title: 'Contact Us',
    content: [
      `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, you may reach us at:`,
    ],
    contact: {
      name: 'Shovith',
      project: 'Correspondance',
      whatsapp: 'https://wa.me/918777845713',
      url: 'https://epost.vercel.app',
    },
  },
];

function PolicySection({ section, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.04 }}
      className="mb-14"
    >
      <div className="flex items-start gap-4 mb-5">
        <span className="font-display text-2xl lg:text-3xl font-light text-gold/40 shrink-0">{section.id}.</span>
        <h2 className="font-display text-2xl lg:text-3xl font-light text-luminary leading-snug">
          {section.title}
        </h2>
      </div>

      <div className="pl-8 space-y-4">
        {section.content?.map((para, i) => (
          <p key={i} className="text-muted font-sans text-sm leading-relaxed">{para}</p>
        ))}

        {section.bullets && (
          <ul className="space-y-2.5 mt-3">
            {section.bullets.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted font-sans text-sm leading-relaxed">
                <span className="text-gold/50 mt-1.5 shrink-0 text-[8px]">✦</span>
                {item}
              </li>
            ))}
          </ul>
        )}

        {section.subsections?.map((sub, i) => (
          <div key={i} className="mt-5 pl-4 border-l border-rim/30">
            <h3 className="font-sans text-xs font-medium text-champagne/70 tracking-[0.15em] uppercase mb-3">{sub.heading}</h3>
            <ul className="space-y-2">
              {sub.items.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-muted font-sans text-sm leading-relaxed">
                  <span className="text-gold/40 mt-1.5 shrink-0 text-[8px]">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {section.footer && (
          <p className="text-muted/70 font-sans text-sm leading-relaxed italic mt-4 pl-4 border-l border-gold/20">
            {section.footer}
          </p>
        )}

        {section.contact && (
          <div className="mt-4 p-5 border border-rim/40 rounded-sm bg-panel/30 space-y-2">
            <p className="text-luminary font-sans text-sm">{section.contact.name} — <span className="text-muted">{section.contact.project}</span></p>
            <p className="text-muted font-sans text-xs">
              Website:{' '}
              <a href={section.contact.url} className="text-gold hover:text-champagne transition-colors underline underline-offset-4 decoration-gold/30">
                {section.contact.url}
              </a>
            </p>
            <p className="text-muted font-sans text-xs">
              WhatsApp:{' '}
              <a href={section.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-champagne transition-colors underline underline-offset-4 decoration-gold/30">
                +91 87778 45713
              </a>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col overflow-x-hidden">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(200,169,110,0.06)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 lg:px-16 py-6 border-b border-rim/30">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-gradient-to-b from-gold to-gold/20 rounded-full" />
          <Link to="/" className="font-display text-lg font-light tracking-[0.3em] text-champagne uppercase hover:text-gold transition-colors">
            Correspondance
          </Link>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-sans text-muted hover:text-champagne border border-rim hover:border-gold/30 px-3.5 py-1.5 rounded-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
      </header>

      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-6 py-16 lg:py-24">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-gold/60 text-[10px] tracking-[0.5em] font-sans uppercase">Legal Document</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          <div className="flex items-start gap-4 mb-6">
            <Shield className="w-8 h-8 text-gold/50 mt-1 shrink-0" strokeWidth={1} />
            <div>
              <h1 className="font-display text-5xl lg:text-6xl font-light text-luminary leading-tight mb-2">
                Privacy
              </h1>
              <h1 className="font-display text-5xl lg:text-6xl font-light italic text-gradient-gold leading-tight">
                Policy
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pl-12 mb-8">
            <span className="text-xs font-sans text-muted/60 tracking-wide">
              Last updated: <span className="text-muted">{LAST_UPDATED}</span>
            </span>
            <span className="text-xs font-sans text-muted/60 tracking-wide">
              Effective: <span className="text-muted">{EFFECTIVE_DATE}</span>
            </span>
          </div>

          <div className="pl-12 p-5 border border-gold/15 rounded-sm bg-panel/20">
            <p className="text-muted font-sans text-sm leading-relaxed italic">
              Correspondance is designed with privacy as a first principle. We collect the minimum
              information necessary to deliver postcards, we do not sell data, and we give you full
              control to delete your content at any time.
            </p>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-5 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-rim/40" />
          <span className="text-gold/40 text-[10px] font-sans uppercase tracking-[0.4em] shrink-0">Contents</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-rim/40" />
        </div>

        {/* Table of contents */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 p-6 border border-rim/30 rounded-sm bg-panel/20"
        >
          <p className="text-[10px] font-sans text-muted/50 uppercase tracking-[0.3em] mb-4">Table of Contents</p>
          <ol className="space-y-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#section-${s.id}`}
                  className="flex items-center gap-3 text-sm font-sans text-muted hover:text-champagne transition-colors group"
                >
                  <span className="text-gold/30 text-[10px] group-hover:text-gold/60 transition-colors w-4">{s.id}.</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </motion.nav>

        {/* Policy sections */}
        <div>
          {SECTIONS.map((section, i) => (
            <div key={section.id} id={`section-${section.id}`}>
              <PolicySection section={section} index={i} />
              {i < SECTIONS.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-rim/30 to-transparent mb-14" />
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/30" />
            <span className="text-gold/50 text-sm">✦</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/30" />
          </div>
          <p className="text-muted/40 text-xs font-sans italic">
            This policy is part of our commitment to treating your correspondence with the care it deserves.
          </p>
          <div className="flex gap-6 mt-2">
            <Link to="/terms" className="text-xs font-sans text-muted/50 hover:text-gold transition-colors underline underline-offset-4 decoration-muted/20">
              Terms of Service
            </Link>
            <Link to="/" className="text-xs font-sans text-muted/50 hover:text-gold transition-colors">
              ← Return home
            </Link>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
