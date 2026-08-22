/**
 * Six short answers, as a plain two-column definition list.
 *
 * Deliberately not an accordion. Kumo does ship a `Collapsible` primitive, so a disclosure would be
 * available without a new dependency, but six answers of two or three lines each are shorter than
 * the click it would cost to read them: collapsing them would hide the reassurance the section
 * exists to give. Two columns rather than one long stack so the set reads at a glance, with
 * whitespace doing the separating instead of a hairline under every row.
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
      <div className="mx-auto w-full max-w-300 px-6 py-20 sm:py-24 lg:px-10 lg:py-28">
        <h2 className="text-3xl leading-tight font-semibold tracking-[-0.02em] text-kumo-default sm:text-4xl">
          Common questions
        </h2>

        <dl className="mt-10 grid grid-cols-1 gap-x-16 gap-y-10 sm:mt-12 md:grid-cols-2">
          {FAQS.map(({ question, answer }) => (
            <div key={question}>
              <dt className="text-base font-semibold text-kumo-default">{question}</dt>
              <dd className="mt-2 max-w-[54ch] text-sm leading-relaxed text-kumo-subtle">
                {answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
