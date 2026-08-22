import { Hexagon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { Button } from '@cloudflare/kumo'

interface MarketingNavProps {
  /**
   * Scrolls the mid-page demo form into view. A ref-driven `scrollIntoView` rather than an
   * `<a href="#demo">`: the app shell sets `overflow: hidden` on `body`/`#root` and scrolls inside
   * nested containers (see `styles.css`), so fragment navigation resolves against the wrong scroll
   * context and silently does nothing here.
   */
  onRequestDemo: () => void
}

/**
 * Marketing page top bar. One line at every width, 64px tall, with the hexagon wordmark on the left
 * and the two things a visitor can do on the right. The wordmark text drops below `sm` so the bar
 * never wraps on a phone; the hexagon carries the brand at that size.
 */
export default function MarketingNav({ onRequestDemo }: MarketingNavProps) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-kumo-line backdrop-blur-md"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-kumo-base) 82%, transparent)',
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-300 items-center justify-between gap-4 px-6 lg:px-10">
        {/* Wordmark. Reuses the hexagon favicon's mark via the Phosphor `Hexagon` glyph at
            `--color-kumo-brand`, the same pairing `components/Header.tsx` uses in the app chrome.
            "Chad" is hardcoded: this page is brand content, not a per-deployment site name.
            A plain anchor rather than a router `Link` because for a signed-in visitor `/` is the app
            home, which wants a fresh boot with auth rather than a client-side transition. */}
        <a href="/" className="flex shrink-0 items-center gap-2.5">
          <Hexagon size={24} className="text-kumo-brand" weight="bold" />
          <span className="hidden text-lg font-semibold tracking-tight text-kumo-default sm:inline">
            Chad
          </span>
        </a>

        <nav className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            to="/login"
            className="demo-link rounded-md px-2 py-1.5 text-sm font-medium text-kumo-subtle"
          >
            Log in
          </Link>
          <Button variant="primary" onClick={onRequestDemo} className="shrink-0">
            Request a demo
          </Button>
        </nav>
      </div>
    </header>
  )
}
