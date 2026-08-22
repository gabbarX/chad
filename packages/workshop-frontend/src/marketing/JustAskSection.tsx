import JustAskCard, { type JustAskCardProps } from './JustAskCard'
import { GitHubDashboardMock, GoogleDocMock } from './marketingIllustrations'

/**
 * Screenshot well for the three cards backed by a captured image.
 *
 * The three `/marketing/*.png` files do not exist in `public/` yet and are expected to land in a
 * later change; until then these render as a broken image inside a tinted panel, which is the agreed
 * interim state rather than something to work around. `loading="lazy"` because every one of them is
 * below the fold.
 */
function Screenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover object-left-top"
    />
  )
}

/**
 * The five prompts, in the order the product owner approved. Copy is fixed content: the `prompt`,
 * `followUp`, and `outcome` strings are reproduced verbatim, quote marks included.
 */
const CARDS: JustAskCardProps[] = [
  {
    emoji: '📊',
    prompt: '"Make slides for my upcoming meeting with a customer."',
    outcome: 'Builds a deck instantly using the built-in Slides format — no blank page.',
    visual: (
      <Screenshot src="/marketing/slides.png" alt="A slide deck Chad generated, open in Chad" />
    ),
  },
  {
    emoji: '🧑‍🤝‍🧑',
    prompt: '"Make a collaborative whiteboard app."',
    outcome: 'Builds a brand-new app from scratch, shareable with your team in real time.',
    visual: (
      <Screenshot
        src="/marketing/whiteboard.png"
        alt="A collaborative whiteboard app Chad built, with several people editing it"
      />
    ),
  },
  {
    emoji: '🎮',
    prompt: '"Make a tic-tac-toe game."',
    followUp: '"I\'ll be X and you be O. Your turn."',
    outcome: "It doesn't just build the game — it can play it with you.",
    visual: (
      <Screenshot
        src="/marketing/tic-tac-toe.png"
        alt="A tic-tac-toe game Chad built, part-way through a match"
      />
    ),
  },
  {
    emoji: '🐙',
    prompt: '"Make an issue dashboard for this GitHub repo."',
    outcome: 'Attach a repo, get a live dashboard — wired through a secure Gatekeeper.',
    visual: <GitHubDashboardMock />,
  },
  {
    emoji: '📄',
    prompt: '"Fix the typos in this Google Doc."',
    outcome: 'Attach a doc, AI edits it directly, scoped to just that file.',
    visual: <GoogleDocMock />,
  },
]

/**
 * Per-card bento spans over a 6-column grid: 4+2, then 2+4, then a full-width row. Exactly five
 * cells for five prompts, no filler tile, and the mirrored pair plus the wide closer keeps the
 * section from reading as a row of identical cards. The wide card flips to a side-by-side layout on
 * its own, via the container query in `JustAskCard`.
 */
const SPANS = [
  'md:col-span-4',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-4',
  'md:col-span-6',
]

export default function JustAskSection() {
  return (
    <section className="mx-auto w-full max-w-300 px-6 py-20 sm:py-24 lg:px-10 lg:py-32">
      <h2 className="max-w-2xl text-4xl leading-tight font-semibold tracking-[-0.02em] text-kumo-default sm:text-5xl">
        Just ask.
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 md:grid-cols-6 lg:gap-5">
        {CARDS.map((card, index) => (
          <div key={card.prompt} className={SPANS[index]}>
            <JustAskCard {...card} />
          </div>
        ))}
      </div>
    </section>
  )
}
