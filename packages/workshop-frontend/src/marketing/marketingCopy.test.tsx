// @vitest-environment jsdom
/* eslint-disable react/react-in-jsx-scope */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import type { RpcStub } from 'capnweb'
import type { DemoRequestInput, PublicApi } from '@gadgets/workshop-shared/api'

import MarketingLandingPage from './MarketingLandingPage'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// jsdom doesn't implement scrolling; the router's hash scroll restoration calls it on mount, now
// that the tree is wrapped in a real router. Same stub as legacyRedirects.test.tsx.
window.scrollTo = () => {}

/**
 * Every string the product owner approved, verbatim.
 *
 * This is the regression these tests exist to catch: the copy went through a multi-round review, so
 * a later paraphrase ("instantly, just for you", "no shared risk at all") is the realistic way this
 * page degrades, not a layout change. Anything edited here must be re-approved, not just made green.
 */
const APPROVED_COPY = {
  hero: [
    'Ask for anything. Chad does it.',
    'A general-purpose AI agent that gets real work done — on your docs, your repos, your Slack — and builds you a private app whenever one would help. It only ever touches what you approve.',
    'Request a demo',
    'Prefer to try it yourself? Self-host it free →',
    // The legend's open-ended terminal. A closed list of app categories is the exact misreading
    // this page has to avoid, so it is guarded like any other approved string.
    'ANYTHING ELSE YOU ASK FOR',
  ],
  justAsk: [
    'Five real prompts. Some build you something new; some just get the work done.',
    '"Make slides for my upcoming meeting with a customer."',
    'Builds a deck instantly using the built-in Slides format — no blank page.',
    '"Make a collaborative whiteboard app."',
    'Builds a brand-new app from scratch, shareable with your team in real time.',
    '"Make a tic-tac-toe game."',
    '"I\'ll be X and you be O. Your turn."',
    "It doesn't just build the game — it can play it with you.",
    '"Make an issue dashboard for this GitHub repo."',
    'Attach a repo, get a live dashboard — wired through a secure Gatekeeper.',
    '"Fix the typos in this Google Doc."',
    'Attach a doc, AI edits it directly, scoped to just that file.',
  ],
  features: [
    'Most requests the agent just handles — it writes and runs the code itself. When a job needs software of its own, it builds that too. Three things keep all of it yours.',
    'Gadgets',
    'When it builds, it builds just for you',
    "When you ask for a slide deck, a whiteboard, or a dashboard, Chad doesn't hand you a shared tool — it builds you a private one, running in its own secure sandbox. Don't like something about it? Just ask AI to change it. It's yours.",
    'Gatekeepers',
    'Nothing gets touched without your OK',
    'Every time an app or agent needs to reach outside — your GitHub, your Docs, your Slack — a Gatekeeper stands in the way. It only allows exactly the access you approved, logs everything it does, and lets you review sensitive actions before they happen. Your team gets to move fast with AI; your security team still gets to sleep at night.',
    'Blueprints',
    'Good ideas spread, safely',
    'Built something useful? Share it as a Blueprint. Anyone on your team can spin up their own independent copy — same starting point, their own data, their own changes. Nothing shared, nothing to step on.',
  ],
  faq: [
    'Do I need to know how to code?',
    'No. Describe what you want in plain language — the agent writes and runs the code for you. If you do want to tweak something yourself, you can.',
    "Can it see everything in my company's tools?",
    'No. Every agent and app starts with zero access. You explicitly introduce it to only the specific account or file it needs, through a Gatekeeper — every action is logged, and sensitive ones can require your approval first.',
    "Isn't this just like ChatGPT / Copilot?",
    "Not quite. Most AI tools give you a chat window and an answer. Chad's agent actually builds and hosts working, private apps for you — each one its own secure instance, not a shared chatbot session.",
    'Can we self-host it? Is it open source?',
    'Yes — Chad is open source and can run entirely on your own infrastructure.',
    'What does it cost?',
    "Self-hosting is free. Pricing for a managed or enterprise deployment depends on your team's needs — request a demo and we'll walk you through it.",
    'What AI models does it work with?',
    'Most major providers and self-hosted models — bring your own keys, or use ours.',
  ],
}

describe('MarketingLandingPage', () => {
  let container: HTMLDivElement
  let root: Root
  let scrollIntoView: Mock<(arg?: boolean | ScrollIntoViewOptions) => void>

  /** All rendered text, with JSX's line-wrapping whitespace collapsed so long copy compares cleanly. */
  const renderedText = () => container.textContent!.replace(/\s+/g, ' ')

  beforeEach(async () => {
    // jsdom implements no scrolling at all, and the CTAs call scrollIntoView directly.
    scrollIntoView = vi.fn<(arg?: boolean | ScrollIntoViewOptions) => void>()
    Element.prototype.scrollIntoView = scrollIntoView

    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    const rpcStub = {
      submitDemoRequest: vi.fn<(request: DemoRequestInput) => Promise<void>>(),
    } as unknown as RpcStub<PublicApi>

    // MarketingNav's "Log in" CTA is a typed router `Link`, so it needs a real router context —
    // a bare createRoot().render() (no RouterProvider) throws on mount. Mirrors the router
    // scaffolding SandboxedGatekeeperApp.test.tsx uses for the same reason.
    const rootRoute = createRootRoute({
      component: () => <MarketingLandingPage rpcStub={rpcStub} />,
    })
    const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login' })
    const history = createMemoryHistory({ initialEntries: ['/'] })
    const router = createRouter({ history, routeTree: rootRoute.addChildren([loginRoute]) })
    await act(async () => root.render(<RouterProvider router={router} />))
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    vi.clearAllMocks()
  })

  for (const [section, strings] of Object.entries(APPROVED_COPY)) {
    it(`renders the approved ${section} copy verbatim`, () => {
      const text = renderedText()
      for (const approved of strings) {
        expect(text).toContain(approved)
      }
    })
  }

  it('renders all five Just ask prompts with their glyphs and visuals', () => {
    const text = renderedText()
    for (const emoji of ['📊', '🧑‍🤝‍🧑', '🎮', '🐙', '📄']) {
      expect(text).toContain(emoji)
    }

    // The asset paths are the contract. The hero's `<picture>` contributes exactly one `<img>` —
    // jsdom never evaluates `<source>`, so the wide capture on the `<img>` itself is what shows up
    // here, and the narrow `hero-gadget.png` swap is invisible to this assertion.
    const sources = [...container.querySelectorAll('img')].map((img) => img.getAttribute('src'))
    expect(sources).toEqual([
      '/marketing/hero-workspace.png',
      '/marketing/slides.png',
      '/marketing/whiteboard.png',
      '/marketing/tic-tac-toe.png',
    ])

    for (const img of container.querySelectorAll('img')) {
      expect(img.getAttribute('alt')).toBeTruthy()
    }

    // The hero figure is the LCP element, so it is deliberately eager and prioritised. Everything
    // below the fold stays lazy — asserted per-image rather than in a blanket loop, so relaxing the
    // hero can't silently relax the other three.
    const [hero, ...belowTheFold] = [...container.querySelectorAll('img')]
    expect(hero.getAttribute('loading')).toBeNull()
    expect(hero.getAttribute('fetchpriority')).toBe('high')
    for (const img of belowTheFold) {
      expect(img.getAttribute('loading')).toBe('lazy')
    }
  })

  it('scrolls the demo form into view from the nav CTA instead of navigating', () => {
    const navCta = [...container.querySelectorAll('button')].find(
      (button) => button.textContent === 'Request a demo',
    )!
    act(() => navCta.click())

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    // A fragment link would silently fail inside this scroll container, so there must not be one.
    expect(container.querySelector('a[href^="#"]')).toBeNull()
  })

  it('links the log in CTA to the /login route via a typed router Link', () => {
    const loginLink = [...container.querySelectorAll('a')].find(
      (a) => a.textContent === 'Log in',
    )!
    expect(loginLink.getAttribute('href')).toBe('/login')
  })

  it('links the self-host and source CTAs at this repository', () => {
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('https://github.com/gabbarX/chad#get-started')
    expect(hrefs).toContain('https://github.com/gabbarX/chad')
  })

  it('stays static brand content: hardcoded wordmark, no document title takeover', () => {
    expect(renderedText()).toContain('Chad')
    // `index.html` already ships `<title>Chad</title>`; this page must not reach for it.
    expect(document.title).toBe('')
  })

  it('owns its own scroll container, since body and #root are overflow:hidden', () => {
    const rootElement = container.firstElementChild!
    expect(rootElement.className).toContain('overflow-y-auto')
    expect(rootElement.className).toContain('h-full')
  })

  it('renders the demo form twice: once mid-page and once in the footer', () => {
    expect(container.querySelectorAll('form')).toHaveLength(2)
  })
})
