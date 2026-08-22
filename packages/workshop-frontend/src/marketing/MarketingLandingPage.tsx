import { useCallback, useRef } from 'react'
import { RpcStub } from 'capnweb'
import { PublicApi } from '@gadgets/workshop-shared/api'
import MarketingNav from './MarketingNav'
import MarketingHero from './MarketingHero'
import JustAskSection from './JustAskSection'
import FeatureHighlights from './FeatureHighlights'
import DemoRequestForm from './DemoRequestForm'
import MarketingFAQ from './MarketingFAQ'
import MarketingFooter from './MarketingFooter'

interface MarketingLandingPageProps {
  rpcStub: RpcStub<PublicApi>
}

/**
 * The public marketing page.
 *
 * Static brand content on purpose: no `useAuth()`, no `useAuthenticatedApi()`, and no
 * `useServerConfig()`. The wordmark is the hardcoded string "Chad" rather than the
 * deployment-configurable site name, and the page does not call `useDocumentTitle()` because the
 * static `<title>Chad</title>` in `index.html` is already correct for it.
 *
 * The root owns `overflow-y-auto` and its own height: this renders outside the app shell's
 * `<Outlet>` wrapper the way `LoginPage` does, and `body`/`#root` are both `overflow: hidden` per
 * `styles.css`, so nothing above this element will scroll on its behalf.
 *
 * Section order puts the demo form between the feature blocks and the FAQ: mid-page, where a reader
 * convinced by Gadgets/Gatekeepers/Blueprints can act immediately, with the FAQ left to catch the
 * ones who still have an objection before the footer asks a second time.
 */
export default function MarketingLandingPage({ rpcStub }: MarketingLandingPageProps) {
  const demoFormRef = useRef<HTMLElement>(null)

  // Every "Request a demo" affordance above the form scrolls to it rather than navigating. A
  // fragment link (`<a href="#demo">`) would resolve against the wrong scroll context here, since
  // the scroll container is this element and not the document.
  const scrollToDemoForm = useCallback(() => {
    demoFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-kumo-base">
      <MarketingNav onRequestDemo={scrollToDemoForm} />
      <main>
        <MarketingHero onRequestDemo={scrollToDemoForm} />
        <JustAskSection />
        <FeatureHighlights />

        <section
          ref={demoFormRef}
          className="scroll-mt-16 border-t border-kumo-line bg-kumo-elevated"
        >
          <div className="mx-auto w-full max-w-300 px-6 py-20 sm:py-24 lg:px-10 lg:py-28">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl leading-tight font-semibold tracking-[-0.02em] text-kumo-default sm:text-4xl">
                Request a demo
              </h2>
              <div className="mt-8">
                <DemoRequestForm rpcStub={rpcStub} variant="section" />
              </div>
            </div>
          </div>
        </section>

        <MarketingFAQ />
      </main>
      <MarketingFooter rpcStub={rpcStub} />
    </div>
  )
}
