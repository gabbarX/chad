/**
 * The three ideas the product rests on, as a full-bleed dark band.
 *
 * Two things changed here and both are about density. First, the section is inked: `.marketing-ink-band`
 * (in `styles.css`) paints it near-black in light mode, which gives the page a second hard
 * light-to-dark transition after the hero figure and is the largest "not dull" lever available at
 * zero chroma cost. It is a hand-written utility rather than `bg-kumo-contrast` because that token
 * resolves to the brand orange in dark mode.
 *
 * Second, the heading and the body sit in *adjacent* columns instead of stacked, which roughly
 * halves the section's height. The label keeps its own left rail, now carrying a ghosted plate
 * numeral and a category accent above it. Gatekeepers takes the brand orange — the one fully
 * token-compliant orange spend on this page, because a Gatekeeper *is* the intent mechanism.
 */
const BLOCKS = [
  {
    numeral: '01',
    accent: 'var(--color-compute-100)',
    label: 'Gadgets',
    heading: 'Every request becomes its own app',
    body: "When you ask for a slide deck, a whiteboard, or a dashboard, Chad doesn't hand you a shared tool — it builds you a private one, running in its own secure sandbox. Don't like something about it? Just ask AI to change it. It's yours.",
  },
  {
    numeral: '02',
    accent: 'var(--color-kumo-brand)',
    label: 'Gatekeepers',
    heading: 'Nothing gets touched without your OK',
    body: 'Every time an app or agent needs to reach outside — your GitHub, your Docs, your Slack — a Gatekeeper stands in the way. It only allows exactly the access you approved, logs everything it does, and lets you review sensitive actions before they happen. Your team gets to move fast with AI; your security team still gets to sleep at night.',
  },
  {
    numeral: '03',
    accent: 'var(--color-media-100)',
    label: 'Blueprints',
    heading: 'Good ideas spread, safely',
    body: 'Built something useful? Share it as a Blueprint. Anyone on your team can spin up their own independent copy — same starting point, their own data, their own changes. Nothing shared, nothing to step on.',
  },
]

export default function FeatureHighlights() {
  return (
    <section className="marketing-ink-band border-t border-[var(--ink-line)]">
      <div className="mx-auto w-full max-w-300 px-5 py-14 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-12 gap-x-6 pb-8 lg:gap-x-10">
          <div className="col-span-12 md:col-span-3">
            <div aria-hidden="true" className="mb-3 h-0.5 w-8 bg-[var(--ink-fg-subtle)]" />
            <p className="font-mono text-[11px] tracking-[0.14em] text-[var(--ink-fg-subtle)] uppercase">
              02 — HOW IT WORKS
            </p>
          </div>
        </div>

        {BLOCKS.map(({ numeral, accent, label, heading, body }) => (
          <article
            key={label}
            className="grid grid-cols-12 items-start gap-x-6 border-t border-[var(--ink-line)] py-10 lg:gap-x-10 lg:py-12"
          >
            <div className="col-span-12 md:col-span-3">
              <p
                aria-hidden="true"
                className="font-mono text-[clamp(3rem,5vw,4.5rem)] leading-[0.8] text-white/12 dark:text-kumo-line"
              >
                {numeral}
              </p>
              <div aria-hidden="true" className="mt-3 h-0.5 w-8" style={{ background: accent }} />
              <p
                className="mt-3 font-mono text-[13px] tracking-[0.16em] uppercase"
                style={{ color: accent }}
              >
                {label}
              </p>
            </div>

            <h2 className="col-span-12 mt-6 max-w-[18ch] text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-[var(--ink-fg)] md:col-span-5 md:mt-0">
              {heading}
            </h2>

            <p className="col-span-12 mt-4 text-[15px] leading-[1.6] text-[var(--ink-fg-subtle)] md:col-span-4 md:mt-0">
              {body}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
