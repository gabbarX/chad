import { Button } from '@cloudflare/kumo'
import MeshBackground from '../components/MeshBackground'
import { SELF_HOST_URL } from './marketingLinks'

interface MarketingHeroProps {
  /** Same ref-driven scroll as the nav CTA. See `MarketingNav` for why this isn't a fragment link. */
  onRequestDemo: () => void
}

/**
 * Hero. Asymmetric rather than centred: the copy holds a left column and the brand hex mesh is
 * masked toward the upper right, so the composition has a subject and a horizon instead of a
 * symmetrical block over a gradient. The mesh is the existing `MeshBackground` canvas, the same
 * brand backdrop the signed-in home page uses, which is also the wordmark's motif at page scale. No
 * new brand asset is introduced.
 */
export default function MarketingHero({ onRequestDemo }: MarketingHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          // Pulls the mesh's density into the upper right so the left column reads as foreground.
          maskImage:
            'radial-gradient(120% 95% at 78% 8%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 44%, rgba(0,0,0,0) 78%)',
          WebkitMaskImage:
            'radial-gradient(120% 95% at 78% 8%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 44%, rgba(0,0,0,0) 78%)',
        }}
      >
        <MeshBackground />
      </div>

      <div className="mx-auto w-full max-w-300 px-6 pt-16 pb-20 sm:pt-20 lg:px-10 lg:pt-24 lg:pb-28">
        <div className="max-w-3xl">
          <h1 className="text-5xl leading-[1.02] font-semibold tracking-[-0.03em] text-kumo-default text-balance sm:text-6xl lg:text-7xl">
            Your own apps, built in seconds.
          </h1>

          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-kumo-subtle sm:mt-7 sm:text-xl">
            Chad turns any request into a working, secure app — instantly, and just for you. No SaaS
            sign-up, no waiting on engineering, no shared risk.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 sm:mt-10">
            <Button variant="primary" size="lg" onClick={onRequestDemo}>
              Request a demo
            </Button>
            <a
              href={SELF_HOST_URL}
              target="_blank"
              rel="noreferrer"
              className="demo-link text-sm font-medium text-kumo-subtle"
            >
              Prefer to try it yourself? Self-host it free →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
