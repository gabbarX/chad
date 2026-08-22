import type { ReactNode } from 'react'

export interface JustAskCardProps {
  /** What the visitor would type. Rendered as the first line of a two-turn chat exchange. */
  prompt: string
  /** Optional second turn, shown as a distinct, indented reply line under `prompt`. */
  followUp?: string
  /** What Chad does about it. Sits in a footer strip so the outcome lands last, after the visual. */
  outcome: string
  /** A screenshot or inline illustration. Fills a fixed-ratio well so bento rows stay aligned. */
  visual: ReactNode
  /** Decorative glyph for the prompt line. Hidden from assistive tech; the prompt carries meaning. */
  emoji: string
}

/**
 * One "Just ask" card: prompt on top, evidence in the middle, outcome last.
 *
 * The card is a container query root, so the same component renders as a tall tile in a narrow bento
 * cell and as a side-by-side split once its cell is wide enough (56rem). That is what lets
 * `JustAskSection` vary its grid rhythm without a `layout` prop or a second component.
 *
 * The prompt reuses the app's own chat surface tokens (`bg-kumo-bubble-user` plus the shared
 * `themed-user-bubble-shadow` utility from `styles.css`) so a marketing card and a real conversation
 * in the product read as the same system.
 */
export default function JustAskCard({
  prompt,
  followUp,
  outcome,
  visual,
  emoji,
}: JustAskCardProps) {
  return (
    <article className="@container themed-card-hover-shadow flex h-full flex-col overflow-hidden rounded-2xl border border-kumo-line bg-kumo-elevated transition-shadow">
      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6 @4xl:flex-row @4xl:items-center @4xl:gap-8">
        <div className="flex flex-col gap-3 @4xl:w-2/5 @4xl:shrink-0">
          <p className="themed-user-bubble-shadow flex items-start gap-2.5 self-start rounded-xl rounded-bl-sm bg-kumo-bubble-user px-3.5 py-2.5 text-[15px] leading-snug font-medium text-kumo-default">
            <span aria-hidden="true" className="shrink-0 text-base leading-tight">
              {emoji}
            </span>
            <span>{prompt}</span>
          </p>

          {/* Second turn. Indented, lighter, and dashed rather than filled, so the exchange reads as
              two beats without introducing a second bubble colour. */}
          {followUp && (
            <p className="ml-5 self-start rounded-xl rounded-bl-sm border border-dashed border-kumo-line px-3.5 py-2 text-sm leading-snug text-kumo-subtle">
              {followUp}
            </p>
          )}
        </div>

        {/* Media well. Fixed ratio while stacked so the bento grid keeps a steady beat; height-led
            once the card is wide enough to split, where a ratio would fight the copy column. */}
        <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-kumo-tint @4xl:aspect-auto @4xl:min-h-52 @4xl:flex-1 @4xl:self-stretch">
          {visual}
        </div>
      </div>

      <p className="border-t border-kumo-line px-5 py-4 text-sm leading-relaxed text-kumo-subtle sm:px-6">
        {outcome}
      </p>
    </article>
  )
}
