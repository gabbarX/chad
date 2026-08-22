/**
 * The three ideas the product rests on, as a definition list rather than a card grid.
 *
 * Three equal feature cards is the single most templated shape a marketing page can take, so this
 * section instead uses the term-and-definition layout the product's own vocabulary invites: the
 * label sits in its own left rail, set in `--font-mono` (Apercu Mono Pro) at the brand orange, and
 * the heading and body stack in a wide right column. A single hairline opens each row, and the rest
 * of the separation is whitespace, which keeps a long body paragraph readable instead of boxed.
 */
const BLOCKS = [
  {
    label: 'Gadgets',
    heading: 'Every request becomes its own app',
    body: "When you ask for a slide deck, a whiteboard, or a dashboard, Chad doesn't hand you a shared tool — it builds you a private one, running in its own secure sandbox. Don't like something about it? Just ask AI to change it. It's yours.",
  },
  {
    label: 'Gatekeepers',
    heading: 'Nothing gets touched without your OK',
    body: 'Every time an app or agent needs to reach outside — your GitHub, your Docs, your Slack — a Gatekeeper stands in the way. It only allows exactly the access you approved, logs everything it does, and lets you review sensitive actions before they happen. Your team gets to move fast with AI; your security team still gets to sleep at night.',
  },
  {
    label: 'Blueprints',
    heading: 'Good ideas spread, safely',
    body: 'Built something useful? Share it as a Blueprint. Anyone on your team can spin up their own independent copy — same starting point, their own data, their own changes. Nothing shared, nothing to step on.',
  },
]

export default function FeatureHighlights() {
  return (
    <section className="mx-auto w-full max-w-300 px-6 pb-20 sm:pb-24 lg:px-10 lg:pb-32">
      <div className="flex flex-col">
        {BLOCKS.map(({ label, heading, body }) => (
          <article
            key={label}
            className="grid gap-x-10 gap-y-4 border-t border-kumo-line py-10 lg:grid-cols-12 lg:py-14"
          >
            <p className="font-mono text-sm tracking-tight text-kumo-brand lg:col-span-3 lg:pt-2">
              {label}
            </p>
            <div className="lg:col-span-9">
              <h2 className="max-w-[24ch] text-2xl leading-tight font-semibold tracking-[-0.02em] text-kumo-default sm:text-3xl">
                {heading}
              </h2>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-kumo-subtle sm:text-lg">
                {body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
