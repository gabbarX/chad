import type { ReactNode } from 'react'

export interface JustAskCardProps {
  /** Catalogue index, `01`–`05`. Set in mono on the meta line, like a plate number. */
  index: string
  /** The category this entry belongs to, e.g. `SLIDES`. Paired with `accent` as a legend mark. */
  category: string
  /** One of the four category tokens, as a CSS value. The only colour an entry carries. */
  accent: string
  /** What the visitor would type. Rendered in the app's own chat-bubble treatment. */
  prompt: string
  /** Optional second turn, shown as a distinct, indented reply line under `prompt`. */
  followUp?: string
  /** What Chad does about it. Sits under a `WHAT CAME BACK` micro-label, after the evidence. */
  outcome: string
  /** A screenshot or inline illustration, filling the entry's fixed-ratio well. */
  visual: ReactNode
  /** Background for the well, when the default tint is wrong for the capture behind it. */
  wellClassName?: string
  /** Decorative glyph for the prompt line. Hidden from assistive tech; the prompt carries meaning. */
  emoji: string
  /**
   * The closer. Runs the full 12 columns with the media and the copy side by side, so the catalogue
   * ends on a wide plate instead of a fifth identical cell.
   */
  wide?: boolean
}

/**
 * One entry in the "Just ask" index: meta line, plate, prompt, outcome.
 *
 * No card chrome. The old version was a bordered, rounded, elevated box in an *uneven* bento cell,
 * and that unevenness was the actual defect: `h-full` + `flex-1` made a short card stretch to its
 * tall neighbour's height and pad 200px of dead air above the outcome strip. The fix is structural
 * rather than a min-height — `JustAskSection` gives every entry an equal-width cell, so the wells
 * are the same ratio at the same width and therefore the same height by construction. There is no
 * `h-full` and no `flex-1` left in this file for a row to stretch.
 *
 * The prompt keeps the app's own chat surface tokens (`bg-kumo-bubble-user` plus the shared
 * `themed-user-bubble-shadow` utility) so a marketing entry and a real conversation in the product
 * read as the same system — which is also what keeps the mono/ruled treatment from reading colder
 * than the product it is selling.
 */
export default function JustAskCard({
  index,
  category,
  accent,
  prompt,
  followUp,
  outcome,
  visual,
  wellClassName = 'bg-kumo-tint',
  emoji,
  wide = false,
}: JustAskCardProps) {
  return (
    <article
      className={
        wide
          ? 'grid grid-cols-1 gap-x-10 md:col-span-12 md:grid-cols-12 md:items-center'
          : 'md:col-span-6'
      }
    >
      {/* Meta line. The numeral, a category mark in one of the four accents, and the category
          word — the annual-report legend, not decoration. */}
      <div
        className={`flex items-center gap-2.5 border-t border-kumo-line pt-3 pb-4 font-mono text-[11px] tracking-[0.12em] text-kumo-subtle uppercase ${
          wide ? 'md:col-span-12' : ''
        }`}
      >
        <span>{index}</span>
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: accent }}
        />
        <span>{category}</span>
      </div>

      {/* The plate. A fixed ratio at an equal-width cell is what makes a row line up; nothing here
          grows to absorb a neighbour's height. */}
      <div
        className={`relative aspect-16/10 overflow-hidden rounded-lg border border-kumo-line ${wellClassName} ${
          wide ? 'md:col-span-7' : ''
        }`}
      >
        {visual}
      </div>

      <div className={wide ? 'mt-6 md:col-span-5 md:mt-0' : 'mt-5'}>
        <p className="themed-user-bubble-shadow flex w-fit max-w-full items-start gap-2.5 rounded-xl rounded-bl-sm bg-kumo-bubble-user px-3.5 py-2.5 text-[17px] leading-snug font-medium text-kumo-default">
          <span aria-hidden="true" className="shrink-0 text-base leading-tight">
            {emoji}
          </span>
          <span>{prompt}</span>
        </p>

        {/* Second turn. Indented, lighter, and dashed rather than filled, so the exchange reads as
            two beats without introducing a second bubble colour. */}
        {followUp && (
          <p className="mt-3 ml-5 w-fit max-w-full rounded-xl rounded-bl-sm border border-dashed border-kumo-line px-3.5 py-2 text-sm leading-snug text-kumo-subtle">
            {followUp}
          </p>
        )}

        {/* The outcome is the payload of the entry, so it is ruled off and set at full text colour
            rather than receding into the subtle grey the old footer strip used. */}
        <div className="mt-5 border-t border-kumo-line pt-4">
          <p className="mb-1.5 font-mono text-[10px] tracking-[0.14em] text-kumo-subtle uppercase">
            WHAT CAME BACK
          </p>
          <p className="text-[15px] leading-relaxed text-kumo-default">{outcome}</p>
        </div>
      </div>
    </article>
  )
}
