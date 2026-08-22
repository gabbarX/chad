import type { ReactNode } from 'react'

/**
 * Inline illustrations for the two "Just ask" cards that have no screenshot behind them.
 *
 * Deliberately diagrammatic rather than photorealistic: flat geometry on the existing Kumo tokens,
 * suggesting the *shape* of a GitHub issue dashboard and a Google Doc edit without pretending to be
 * a real screenshot of either product. They exist so cards 4 and 5 aren't visually empty, not to
 * pass as captures. Both scale to their container and are decorative (`aria-hidden`): the card's
 * prompt and outcome text carry the meaning for assistive tech.
 */

/**
 * Shared viewBox so both mocks share one coordinate space and scale identically in their well.
 *
 * Capped at 440px rather than bled to the full plate: at ~570px this line art reads thin and sparse
 * next to the real screenshots beside it, so it sits centred at a specimen size instead. Strokes are
 * 2 rather than 1.5 for the same reason — hairlines disappear against a captured UI.
 */
function MockFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      className="h-auto w-full max-w-110"
    >
      {children}
    </svg>
  )
}

/**
 * A repo issue dashboard: a header row, a small bar chart of issue counts, and three issue rows
 * carrying status marks. The peak bar and the leading status mark take the *compute* category
 * accent rather than the brand orange: they are data marks, so they belong to the four-colour legend
 * the page runs down its entry meta lines, not to the orange the token rule reserves for intent.
 */
export function GitHubDashboardMock() {
  // Bar heights are chosen for silhouette, not to assert any real metric.
  const bars = [26, 44, 34, 58, 40, 70, 52]
  const peak = Math.max(...bars)

  return (
    <MockFrame>
      {/* Window chrome */}
      <rect x="16" y="16" width="288" height="168" rx="10" className="fill-kumo-base" />
      <rect
        x="16"
        y="16"
        width="288"
        height="168"
        rx="10"
        className="fill-none stroke-kumo-line"
        strokeWidth="2"
      />
      <line x1="16" y1="44" x2="304" y2="44" className="stroke-kumo-line" strokeWidth="2" />
      <rect x="30" y="26" width="52" height="8" rx="4" className="fill-kumo-fill" />
      <rect x="248" y="26" width="42" height="8" rx="4" className="fill-kumo-brand" opacity="0.25" />

      {/* Issue volume bars */}
      {bars.map((height, index) => {
        const isPeak = height === peak
        return (
          <rect
            key={index}
            x={32 + index * 22}
            y={122 - height}
            width="12"
            height={height}
            rx="3"
            className={isPeak ? undefined : 'fill-kumo-fill'}
            style={isPeak ? { fill: 'var(--color-compute-100)' } : undefined}
          />
        )
      })}
      <line x1="30" y1="124" x2="196" y2="124" className="stroke-kumo-line" strokeWidth="2" />

      {/* Issue rows */}
      {[0, 1, 2].map((row) => (
        <g key={row} transform={`translate(0 ${140 + row * 16})`}>
          <circle
            cx="36"
            cy="0"
            r="4"
            className={row === 0 ? undefined : 'fill-kumo-interact'}
            style={row === 0 ? { fill: 'var(--color-compute-100)' } : undefined}
          />
          <rect
            x="48"
            y="-4"
            width={row === 1 ? 132 : 108}
            height="8"
            rx="4"
            className="fill-kumo-fill"
          />
          <rect x="252" y="-4" width="38" height="8" rx="4" className="fill-kumo-fill" />
        </g>
      ))}

      {/* Right-hand summary column, hinting at the dashboard's second pane */}
      <rect x="216" y="60" width="74" height="52" rx="8" className="fill-kumo-tint" />
      <rect x="228" y="72" width="34" height="10" rx="5" className="fill-kumo-brand" opacity="0.4" />
      <rect x="228" y="90" width="50" height="6" rx="3" className="fill-kumo-fill" />
    </MockFrame>
  )
}

/**
 * A document mid-edit: body text as lines, with one line struck through and its replacement drawn
 * in the brand accent, so the "AI edits it directly" idea is legible at a glance.
 */
export function GoogleDocMock() {
  return (
    <MockFrame>
      {/* Page */}
      <rect x="60" y="12" width="200" height="176" rx="8" className="fill-kumo-base" />
      <rect
        x="60"
        y="12"
        width="200"
        height="176"
        rx="8"
        className="fill-none stroke-kumo-line"
        strokeWidth="2"
      />

      {/* Title */}
      <rect x="80" y="34" width="104" height="12" rx="6" className="fill-kumo-interact" />

      {/* Untouched body lines */}
      {[62, 78, 94].map((y) => (
        <rect
          key={y}
          x="80"
          y={y}
          width={y === 94 ? 120 : 160}
          height="7"
          rx="3.5"
          className="fill-kumo-fill"
        />
      ))}

      {/* The edited line: original struck through, correction directly beneath in brand */}
      <rect x="80" y="116" width="112" height="7" rx="3.5" className="fill-kumo-fill" />
      <line
        x1="76"
        y1="119.5"
        x2="196"
        y2="119.5"
        className="stroke-kumo-danger"
        strokeWidth="2"
        opacity="0.7"
      />
      <rect x="80" y="132" width="128" height="7" rx="3.5" className="fill-kumo-brand" />
      <rect
        x="72"
        y="126"
        width="146"
        height="19"
        rx="5"
        className="fill-none stroke-kumo-brand"
        strokeWidth="2"
        opacity="0.35"
      />

      {/* Remaining body */}
      {[156, 170].map((y) => (
        <rect
          key={y}
          x="80"
          y={y}
          width={y === 170 ? 88 : 160}
          height="7"
          rx="3.5"
          className="fill-kumo-fill"
        />
      ))}
    </MockFrame>
  )
}
