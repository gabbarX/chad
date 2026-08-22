/**
 * Six short answers, as a ruled and indexed two-column definition list.
 *
 * Deliberately not an accordion. Kumo does ship a `Collapsible` primitive, so a disclosure would be
 * available without a new dependency, but six answers of two or three lines each are shorter than
 * the click it would cost to read them: collapsing them would hide the reassurance the section
 * exists to give.
 *
 * Every item now opens on a hairline and carries a mono index, which is what turns a loose two-
 * column list into something that reads as a grid; the rail holding the section number and the h2
 * sticks so the reader keeps their place through all six.
 */
const FAQS = [
  {
    question: 'Do I need to know how to code?',
    answer:
      'No. Describe what you want in plain language — the agent writes and runs the code for you. If you do want to tweak something yourself, you can.',
  },
  {
    question: "Can it see everything in my company's tools?",
    answer:
      'No. Every agent and app starts with zero access. You explicitly introduce it to only the specific account or file it needs, through a Gatekeeper — every action is logged, and sensitive ones can require your approval first.',
  },
  {
    question: "Isn't this just like ChatGPT / Copilot?",
    answer:
      "Not quite. Most AI tools give you a chat window and an answer. Chad's agent actually builds and hosts working, private apps for you — each one its own secure instance, not a shared chatbot session.",
  },
  {
    question: 'Can we self-host it? Is it open source?',
    answer: 'Yes — Chad is open source and can run entirely on your own infrastructure.',
  },
  {
    question: 'What does it cost?',
    answer:
      "Self-hosting is free. Pricing for a managed or enterprise deployment depends on your team's needs — request a demo and we'll walk you through it.",
  },
  {
    question: 'What AI models does it work with?',
    answer: 'Most major providers and self-hosted models — bring your own keys, or use ours.',
  },
]

export default function MarketingFAQ() {
  return (
    <section className="border-t border-kumo-line">
      <div className="mx-auto w-full max-w-300 px-5 py-14 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10">
          <div className="col-span-12 lg:sticky lg:top-20 lg:col-span-3 lg:self-start">
            <div aria-hidden="true" className="mb-3 h-0.5 w-8 bg-kumo-contrast dark:bg-kumo-line" />
            <p className="font-mono text-[11px] tracking-[0.14em] text-kumo-subtle uppercase">
              05 — FAQ
            </p>
            <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.025em] text-kumo-default">
              Common questions
            </h2>
          </div>

          <dl className="col-span-12 mt-8 grid gap-x-12 md:grid-cols-2 lg:col-span-9 lg:mt-0">
            {FAQS.map(({ question, answer }, index) => (
              <div
                key={question}
                className="grid grid-cols-[1.75rem_1fr] gap-x-3 border-t border-kumo-line py-5"
              >
                <span
                  aria-hidden="true"
                  className="row-span-2 pt-1 font-mono text-[11px] text-kumo-subtle"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <dt className="text-[15px] font-semibold text-kumo-default">{question}</dt>
                <dd className="col-start-2 mt-2 text-[14px] leading-[1.6] text-kumo-subtle">
                  {answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
