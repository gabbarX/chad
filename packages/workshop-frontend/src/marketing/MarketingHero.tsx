import { Fragment } from 'react'
import { Button } from '@cloudflare/kumo'
import { SELF_HOST_URL } from './marketingLinks'

interface MarketingHeroProps {
  /** Same ref-driven scroll as the nav CTA. See `MarketingNav` for why this isn't a fragment link. */
  onRequestDemo: () => void
}

/**
 * The measure. 1200px, identical to every section below, so the dateline, masthead and legend sit on
 * the same left edge as the section rails and the page reads as one ruled spine.
 */
const TEXT_SHELL = 'mx-auto w-full max-w-300 px-5 md:px-8 lg:px-12'

/**
 * The figure runs wider than the measure (1536px) on purpose: the screenshot *breaks* the column
 * rather than sitting inside it. 1536 is also the ceiling that keeps `hero-workspace.png` (1600px
 * native) at or under 1:1 — a viewport-width bleed would upscale it and go soft.
 */
const FIGURE_SHELL = 'mx-auto w-full max-w-[96rem] px-5 md:px-8 lg:px-12'

/**
 * What Chad works on — things you already have as much as things it builds. First appearance of the
 * four-colour legend.
 *
 * The open-ended last entry is the load-bearing one: a closed list of six app categories read as a
 * product catalogue, which is exactly the "it's an app builder" misreading this page has to avoid.
 */
const LEGEND = [
  'DOCS',
  'SLIDES',
  'DASHBOARDS',
  'WHITEBOARDS',
  'REPOS',
  'GAMES',
  'INTERNAL TOOLS',
  'ANYTHING ELSE YOU ASK FOR',
]

/** Cycles compute → storage → ai → media across the separators, the same order the page reuses. */
const LEGEND_ACCENTS = [
  'var(--color-compute-100)',
  'var(--color-storage-100)',
  'var(--color-ai-100)',
  'var(--color-media-100)',
]

/**
 * Hero, as the front page of an annual report: a dateline strip, a masthead whose headline and
 * standfirst sit in adjacent columns rather than stacked, and a captioned figure that breaks the
 * measure.
 *
 * The old brand mesh is gone. It was a watermark behind an empty right half, and both problems have
 * the same fix: put the product's own workspace capture on the page at full width. Because the
 * capture is dark, it also lands a ~610px near-black slab on a near-white page, which is the largest
 * contrast event on the whole document and costs no chroma at all.
 */
export default function MarketingHero({ onRequestDemo }: MarketingHeroProps) {
  return (
    <section className="pb-12 lg:pb-16">
      <div className={TEXT_SHELL}>
        {/* (1) Dateline. A masthead needs a rule and a date line above it or the page starts in
            mid-air; this is what stops the top of the document reading as blank. */}
        <div className="flex h-10 items-center justify-between border-b border-kumo-line font-mono text-[11px] tracking-[0.14em] text-kumo-subtle uppercase">
          <span>Chad — AI workspace</span>
          <span className="hidden sm:block">Open source · Runs on your own infrastructure</span>
        </div>

        {/* (2) Masthead. Headline cols 1-7, standfirst cols 9-12. */}
        <div className="grid grid-cols-12 items-start gap-x-6 pt-10 pb-8 lg:gap-x-10 lg:pt-14 lg:pb-10">
          <h1 className="col-span-12 text-[clamp(2.75rem,6vw,5rem)] leading-[0.96] font-semibold tracking-[-0.035em] text-kumo-default text-balance lg:col-span-7">
            Ask for anything. Chad does it.
          </h1>

          <div className="col-span-12 mt-6 lg:col-span-4 lg:col-start-9 lg:mt-2">
            {/* Near-black, deliberately not orange: the whole orange budget on this screen belongs
                to the primary CTA a few lines below. */}
            <div aria-hidden="true" className="mb-4 h-0.5 w-10 bg-kumo-contrast dark:bg-kumo-line" />
            <p className="text-[17px] leading-[1.55] text-kumo-subtle">
              A general-purpose AI agent that gets real work done — on your docs, your repos, your
              Slack — and builds you a private app whenever one would help. It only ever touches what
              you approve.
            </p>
          </div>

          <div className="col-span-12 mt-8 lg:mt-10">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onRequestDemo}
                  className="w-full sm:w-auto"
                >
                  Request a demo
                </Button>
              </div>
              <a
                href={SELF_HOST_URL}
                target="_blank"
                rel="noreferrer"
                className="demo-link text-sm font-medium text-kumo-subtle"
              >
                Prefer to try it yourself? Self-host it free →
              </a>
            </div>

            <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-kumo-subtle uppercase">
              Does the work · Builds the tools · Private by default
            </p>
          </div>
        </div>
      </div>

      {/* (3) The figure, plus (4) its caption. */}
      <div className={`${FIGURE_SHELL} mt-10 lg:mt-14`}>
        <figure>
          <div className="themed-floating-shadow-lg relative overflow-hidden rounded-xl bg-kumo-recessed ring-1 ring-kumo-line lg:rounded-2xl">
            {/* Chrome bar. Reads the capture as a framed device rather than a floating rectangle,
                and gives the crop at the image's top edge somewhere to end. */}
            <div
              aria-hidden="true"
              className="flex h-9 items-center gap-1.5 border-b border-kumo-line bg-kumo-elevated px-4"
            >
              <span className="h-2 w-2 rounded-full bg-kumo-interact" />
              <span className="h-2 w-2 rounded-full bg-kumo-interact" />
              <span className="h-2 w-2 rounded-full bg-kumo-interact" />
            </div>

            {/* The `<source>` swap is load-bearing, not an optimisation: at 375px the two-pane
                workspace capture is unreadable mush, while the bare gadget dashboard still reads.
                The wide capture stays on the `<img>` so it is also the no-`<picture>` fallback.
                Eager and `fetchPriority="high"` — this is the page's LCP element. */}
            <picture className="block aspect-4/3 md:aspect-16/9 lg:aspect-16/7">
              <source media="(max-width: 767px)" srcSet="/marketing/hero-gadget.png" />
              <img
                src="/marketing/hero-workspace.png"
                alt="The Chad workspace: an AI conversation on the left and the project dashboard it built on the right"
                fetchPriority="high"
                decoding="async"
                className="block h-full w-full object-cover object-top"
              />
            </picture>
          </div>

          <figcaption className="mt-3 flex items-baseline gap-3 border-t border-kumo-line pt-3">
            <span className="shrink-0 font-mono text-[11px] tracking-[0.12em] text-kumo-subtle uppercase">
              FIG. 01
            </span>
            <span aria-hidden="true" className="text-kumo-interact">
              │
            </span>
            <span className="text-[13px] leading-relaxed text-kumo-subtle">
              The conversation on the left; the work on the right — here, an app the agent built and
              now runs with you. Both are yours alone.
            </span>
          </figcaption>
        </figure>
      </div>

      {/* (5) Legend strip. Static rather than a marquee: keeps the register enterprise and avoids
          owing `prefers-reduced-motion` a second code path. */}
      <div className={TEXT_SHELL}>
        <div className="hide-scrollbar mt-12 overflow-x-auto border-y border-kumo-line py-3">
          <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.16em] whitespace-nowrap text-kumo-subtle uppercase">
            {LEGEND.map((word, index) => (
              <Fragment key={word}>
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    style={{ color: LEGEND_ACCENTS[(index - 1) % LEGEND_ACCENTS.length] }}
                  >
                    ·
                  </span>
                )}
                <span>{word}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
