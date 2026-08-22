import { RpcStub } from 'capnweb'
import { PublicApi } from '@gadgets/workshop-shared/api'
import { Hexagon } from '@phosphor-icons/react'
import DemoRequestForm from './DemoRequestForm'
import { DOCS_URL, REPO_URL, SELF_HOST_URL } from './marketingLinks'

interface MarketingFooterProps {
  rpcStub: RpcStub<PublicApi>
}

/**
 * Footer. Carries the page's last ask (a second `DemoRequestForm`, styled for this surface) beside
 * the two things a visitor who isn't ready to talk to anyone still wants: the self-host route and
 * the source. Asymmetric 5/7 split so the form, not the link column, is the heavier half.
 */
export default function MarketingFooter({ rpcStub }: MarketingFooterProps) {
  return (
    <footer className="border-t border-kumo-line bg-kumo-recessed">
      <div className="mx-auto grid w-full max-w-300 gap-12 px-6 py-16 sm:py-20 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-2.5">
            <Hexagon size={24} className="text-kumo-brand" weight="bold" />
            <span className="text-lg font-semibold tracking-tight text-kumo-default">Chad</span>
          </div>

          <nav className="mt-7 flex flex-col items-start gap-3">
            <a
              href={SELF_HOST_URL}
              target="_blank"
              rel="noreferrer"
              className="demo-link text-sm font-medium text-kumo-subtle"
            >
              Prefer to try it yourself? Self-host it free →
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="demo-link text-sm text-kumo-subtle"
            >
              GitHub
            </a>
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="demo-link text-sm text-kumo-subtle"
            >
              Docs
            </a>
          </nav>
        </div>

        <div className="lg:col-span-7">
          <h2 className="text-xl font-semibold tracking-tight text-kumo-default">
            Request a demo
          </h2>
          <div className="mt-6 max-w-lg">
            <DemoRequestForm rpcStub={rpcStub} variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  )
}
