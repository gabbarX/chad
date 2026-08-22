import type { ReactNode } from 'react'
import JustAskCard, { type JustAskCardProps } from './JustAskCard'
import { GitHubDashboardMock, GoogleDocMock } from './marketingIllustrations'

/**
 * Screenshot plate.
 *
 * Absolutely positioned inside the entry's `aspect-16/10` well so a crop transform can never push
 * the well's own height around. `loading="lazy"` because every one of these is below the fold — the
 * one eager image on this page is the hero, which is the LCP element.
 */
function Screenshot({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`absolute inset-0 h-full w-full object-cover ${className ?? 'object-top'}`}
    />
  )
}

/**
 * The two inline mocks are 320x200 line art. Bled to the full ~570px plate they read thin and
 * sparse, so they get a lighter ground and sit centred at their own scale instead — a specimen on a
 * card rather than a stretched diagram.
 */
function MockWell({ children }: { children: ReactNode }) {
  return <div className="absolute inset-0 grid place-items-center p-6">{children}</div>
}

/**
 * The five prompts, in the order the product owner approved. Copy is fixed content: the `prompt`,
 * `followUp`, and `outcome` strings are reproduced verbatim, quote marks included.
 *
 * `category` and `accent` are the page's four-colour legend, in the same roles it takes everywhere
 * else: a 6px mark, never a fill.
 */
const ENTRIES: JustAskCardProps[] = [
  {
    index: '01',
    category: 'SLIDES',
    accent: 'var(--color-media-100)',
    emoji: '📊',
    prompt: '"Make slides for my upcoming meeting with a customer."',
    outcome: 'Builds a deck instantly using the built-in Slides format — no blank page.',
    visual: (
      <Screenshot
        src="/marketing/slides.png"
        alt="A slide deck Chad generated, open in Chad"
        // The asset is pre-cropped to the slide artwork itself, so it fills the well without a
        // scale transform — a transform large enough to hide the old margins also cropped the
        // title mid-word at narrow cell widths.
        className="object-center"
      />
    ),
  },
  {
    index: '02',
    category: 'REAL-TIME',
    accent: 'var(--color-compute-100)',
    emoji: '🧑‍🤝‍🧑',
    prompt: '"Make a collaborative whiteboard app."',
    outcome: 'Builds a brand-new app from scratch, shareable with your team in real time.',
    visual: (
      <Screenshot
        src="/marketing/whiteboard.png"
        alt="A collaborative whiteboard app Chad built, with several people editing it"
        className="object-top-left"
      />
    ),
  },
  {
    index: '03',
    category: 'GAMES',
    accent: 'var(--color-ai-100)',
    emoji: '🎮',
    prompt: '"Make a tic-tac-toe game."',
    followUp: '"I\'ll be X and you be O. Your turn."',
    outcome: "It doesn't just build the game — it can play it with you.",
    // The re-captured game is dark-themed; a light tint behind it would show as a bright halo.
    wellClassName: 'bg-kumo-recessed',
    visual: (
      <Screenshot
        src="/marketing/tic-tac-toe.png"
        alt="A tic-tac-toe game Chad built, part-way through a match"
        className="object-top-left"
      />
    ),
  },
  {
    index: '04',
    category: 'DASHBOARDS',
    accent: 'var(--color-storage-100)',
    emoji: '🐙',
    prompt: '"Make an issue dashboard for this GitHub repo."',
    outcome: 'Attach a repo, get a live dashboard — wired through a secure Gatekeeper.',
    wellClassName: 'bg-kumo-elevated',
    visual: (
      <MockWell>
        <GitHubDashboardMock />
      </MockWell>
    ),
  },
  {
    index: '05',
    category: 'DOCUMENTS',
    accent: 'var(--color-compute-100)',
    emoji: '📄',
    prompt: '"Fix the typos in this Google Doc."',
    outcome: 'Attach a doc, AI edits it directly, scoped to just that file.',
    wellClassName: 'bg-kumo-elevated',
    wide: true,
    visual: (
      <MockWell>
        <GoogleDocMock />
      </MockWell>
    ),
  },
]

/**
 * "Just ask", as a numbered index rather than a bento.
 *
 * The bento is gone for one concrete reason: its cells were unequal widths (4+2, 2+4), so two
 * fixed-ratio wells in the same row were different heights and the shorter card padded the
 * difference into dead space. Equal `md:col-span-6` cells make that failure impossible instead of
 * patching it, and they roughly double the rendered size of every screenshot on the way — which is
 * the other half of the complaint, small images floating in oversized wells.
 */
export default function JustAskSection() {
  return (
    <section className="border-t border-kumo-line">
      <div className="mx-auto w-full max-w-300 px-5 py-14 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-12 items-start gap-x-6 lg:gap-x-10">
          {/* The rail. Same mark, same position, every section — this is the page's spine. */}
          <div className="col-span-12 md:col-span-3">
            <div aria-hidden="true" className="mb-3 h-0.5 w-8 bg-kumo-contrast dark:bg-kumo-line" />
            <p className="font-mono text-[11px] tracking-[0.14em] text-kumo-subtle uppercase">
              01 — JUST ASK
            </p>
          </div>

          <h2 className="col-span-12 mt-6 text-[clamp(2rem,4vw,3.25rem)] leading-none font-semibold tracking-[-0.03em] text-kumo-default md:col-span-6 md:mt-0">
            Just ask.
          </h2>

          <p className="col-span-12 mt-4 max-w-[34ch] text-[15px] leading-relaxed text-kumo-subtle md:col-span-3 md:mt-0">
            Five real prompts. Some build you something new; some just get the work done.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-12">
          {ENTRIES.map((entry) => (
            <JustAskCard key={entry.prompt} {...entry} />
          ))}
        </div>
      </div>
    </section>
  )
}
