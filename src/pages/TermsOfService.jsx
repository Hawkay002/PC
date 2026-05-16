import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ScrollText } from 'lucide-react';

const LAST_UPDATED = 'May 16, 2026';
const EFFECTIVE_DATE = 'May 16, 2026';

const SECTIONS = [
  {
    id: '1',
    title: 'Acceptance of Terms',
    content: [
      `By accessing or using Correspondance (the "Service") at epost.vercel.app, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.`,
      `These Terms constitute a legally binding agreement between you and Correspondance ("we", "our", or "us"), operated by Shovith. We reserve the right to modify these Terms at any time. Continued use of the Service following the posting of revised Terms constitutes your acceptance of the changes.`,
    ],
  },
  {
    id: '2',
    title: 'Description of the Service',
    content: [
      `Correspondance is a digital postcard creation and sharing platform. The Service allows users to:`,
    ],
    bullets: [
      'Compose personalised digital postcards with a recipient name, personal message, and sender name.',
      'Upload a personal photograph to be included in the postcard.',
      'Apply decorative botanical illustrations, analog film filters, and artisan stamp designs.',
      'Generate a unique shareable link allowing any recipient to view the postcard.',
      'Manage sent postcards via an Outbox and permanently delete them at any time.',
    ],
    footer: 'The Service is provided free of charge. We reserve the right to introduce optional paid features in the future, with advance notice.',
  },
  {
    id: '3',
    title: 'Eligibility',
    content: [
      `You must be at least 13 years of age to use the Service. By using the Service, you represent and warrant that you meet this age requirement. If you are between 13 and 18 years of age, you represent that your parent or legal guardian has reviewed and agreed to these Terms on your behalf.`,
      `The Service is available globally. However, you are responsible for ensuring that your use of the Service complies with the laws and regulations of your jurisdiction.`,
    ],
  },
  {
    id: '4',
    title: 'User Content and Conduct',
    subsections: [
      {
        heading: '4.1 Your responsibility for content',
        items: [
          'You are solely responsible for the content of postcards you create, including text, images, and any other material ("User Content").',
          'By submitting User Content, you represent that you own the rights to that content or have the necessary permissions to use and share it.',
          'You retain ownership of your User Content. You grant us a limited, non-exclusive, royalty-free licence to store, process, and transmit your User Content solely for the purpose of delivering the Service.',
        ],
      },
      {
        heading: '4.2 Prohibited content',
        items: [
          'Illegal, harmful, threatening, abusive, harassing, defamatory, or discriminatory material.',
          'Content that infringes on the intellectual property, privacy, or publicity rights of any third party.',
          'Sexually explicit material, graphic violence, or content that could cause distress.',
          'Spam, commercial solicitations, or unsolicited promotional material.',
          'Content that impersonates any person or entity or misrepresents your affiliation.',
          'Malicious code, viruses, or any other software intended to interfere with the Service.',
        ],
      },
      {
        heading: '4.3 Prohibited conduct',
        items: [
          'Attempting to gain unauthorised access to any part of the Service, its servers, or databases.',
          'Using automated means (bots, scrapers, crawlers) to access or use the Service without our express written permission.',
          'Reverse engineering, decompiling, or disassembling any part of the Service.',
          'Using the Service to harass, bully, or harm any individual.',
          'Circumventing any security or access controls implemented within the Service.',
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'Intellectual Property',
    content: [
      `All elements of the Correspondance Service — including but not limited to the design, interface, botanical illustrations, stamp artwork, code, trademarks, and written content — are the intellectual property of Correspondance or its licensors and are protected by applicable intellectual property laws.`,
      `You are granted a limited, non-transferable, non-exclusive licence to access and use the Service for personal, non-commercial purposes only. You may not reproduce, distribute, modify, create derivative works of, or commercially exploit any part of the Service without our prior written consent.`,
      `User Content remains your property. We make no claim of ownership over photographs, messages, or other materials you upload.`,
    ],
  },
  {
    id: '6',
    title: 'Privacy',
    content: [
      `Your use of the Service is also governed by our Privacy Policy, available at epost.vercel.app/privacy, which is incorporated into these Terms by reference. Please review our Privacy Policy carefully — it describes how we collect, use, and protect your information.`,
    ],
  },
  {
    id: '7',
    title: 'Third-Party Services',
    content: [
      `The Service uses third-party infrastructure to operate, including:`,
    ],
    bullets: [
      'Telegram Bot API — for image storage and file management.',
      'Supabase — for database hosting and backend services.',
      'Vercel — for application hosting and deployment.',
    ],
    footer: 'These providers have their own terms of service and privacy policies. We are not responsible for the practices or content of third-party services. Use of the Service constitutes acceptance that your content may be processed by these providers in accordance with their respective policies.',
  },
  {
    id: '8',
    title: 'Disclaimers and Limitation of Liability',
    subsections: [
      {
        heading: '8.1 Service provided "as is"',
        items: [
          'The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.',
          'We do not warrant that the Service will be uninterrupted, error-free, secure, or free of viruses or other harmful components.',
          'We do not warrant that any specific postcard link will remain accessible indefinitely. Links may become unavailable if the associated record is deleted or if the Service is discontinued.',
        ],
      },
      {
        heading: '8.2 Limitation of liability',
        items: [
          'To the fullest extent permitted by applicable law, Correspondance and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service.',
          'We shall not be liable for any loss of data, including postcard content or images, resulting from technical failures, third-party service outages, or user error.',
          'Our total liability to you for any claims arising from these Terms or the Service shall not exceed the amount paid by you to use the Service in the preceding 12 months (which, as the Service is currently free, shall be zero).',
        ],
      },
    ],
  },
  {
    id: '9',
    title: 'Indemnification',
    content: [
      `You agree to indemnify, defend, and hold harmless Correspondance, its operators, and affiliates from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable legal fees) arising from: (a) your use of the Service; (b) your User Content; (c) your violation of these Terms; or (d) your violation of any third-party rights.`,
    ],
  },
  {
    id: '10',
    title: 'Termination',
    content: [
      `We reserve the right to suspend or terminate your access to the Service at any time, without notice, if we reasonably believe you have violated these Terms or if we determine that your use of the Service poses a risk to other users, third parties, or to the continued operation of the Service.`,
      `You may stop using the Service at any time. You may delete all your postcards from the Outbox to remove your content from our systems. Upon cessation of use, provisions of these Terms that by their nature should survive termination — including intellectual property, disclaimers, and limitation of liability — shall remain in effect.`,
    ],
  },
  {
    id: '11',
    title: 'Modifications to the Service',
    content: [
      `We reserve the right to modify, suspend, or discontinue any part of the Service at any time without liability to you. We may introduce new features, change existing functionality, or remove features with or without notice.`,
      `We will make reasonable efforts to provide advance notice of significant changes that may affect your use of the Service.`,
    ],
  },
  {
    id: '12',
    title: 'Governing Law and Dispute Resolution',
    content: [
      `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.`,
      `Any dispute arising out of or in connection with these Terms or the Service shall first be attempted to be resolved through informal negotiation. You agree to contact us and provide a written description of the dispute before initiating any formal proceedings.`,
      `If informal resolution fails, disputes shall be subject to the exclusive jurisdiction of the courts located in India.`,
    ],
  },
  {
    id: '13',
    title: 'Miscellaneous',
    subsections: [
      {
        heading: 'Entire agreement',
        items: ['These Terms, together with our Privacy Policy, constitute the entire agreement between you and Correspondance regarding the Service.'],
      },
      {
        heading: 'Severability',
        items: ['If any provision of these Terms is found to be unenforceable, that provision shall be modified to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.'],
      },
      {
        heading: 'Waiver',
        items: ['Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of that right or provision.'],
      },
      {
        heading: 'Assignment',
        items: ['You may not assign your rights under these Terms without our prior written consent. We may assign our rights and obligations without restriction.'],
      },
    ],
  },
  {
    id: '14',
    title: 'Contact',
    content: [
      `If you have questions about these Terms or wish to report a violation, please contact us:`,
    ],
    contact: {
      name: 'Shovith',
      project: 'Correspondance',
      whatsapp: 'https://wa.me/918777845713',
      url: 'https://epost.vercel.app',
    },
  },
];

function TermsSection({ section, index }) {
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
            <ul className="space-y-2.5">
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

export default function TermsOfService() {
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
            <ScrollText className="w-8 h-8 text-gold/50 mt-1 shrink-0" strokeWidth={1} />
            <div>
              <h1 className="font-display text-5xl lg:text-6xl font-light text-luminary leading-tight mb-2">
                Terms of
              </h1>
              <h1 className="font-display text-5xl lg:text-6xl font-light italic text-gradient-gold leading-tight">
                Service
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
              Please read these Terms carefully before using Correspondance. By using the Service,
              you agree to these Terms. These Terms set out your rights, our responsibilities, and
              the rules that make the Service safe and fair for everyone.
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

        {/* Terms sections */}
        <div>
          {SECTIONS.map((section, i) => (
            <div key={section.id} id={`section-${section.id}`}>
              <TermsSection section={section} index={i} />
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
            These Terms exist to protect both you and the integrity of the Service.
          </p>
          <div className="flex gap-6 mt-2">
            <Link to="/privacy" className="text-xs font-sans text-muted/50 hover:text-gold transition-colors underline underline-offset-4 decoration-muted/20">
              Privacy Policy
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
