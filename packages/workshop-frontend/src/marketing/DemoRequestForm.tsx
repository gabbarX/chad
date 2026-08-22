import { useState, type FormEvent } from 'react'
import { RpcStub } from 'capnweb'
import { PublicApi } from '@gadgets/workshop-shared/api'
import { CheckCircle } from '@phosphor-icons/react'
import { Input, InputArea, Button, Banner } from '@cloudflare/kumo'

interface DemoRequestFormProps {
  rpcStub: RpcStub<PublicApi>
  /**
   * Styling only. `"section"` is the mid-page instance and draws its own panel; `"footer"` sits on
   * the footer surface and drops the panel so it doesn't read as a card inside a card. All state,
   * validation, and submit behaviour is shared.
   */
  variant?: 'section' | 'footer'
}

/**
 * The "Request a demo" form, instantiated twice on the page.
 *
 * Validation is the same lightweight bar `SignupPage` uses: native HTML5 `required` plus
 * `type="email"` on the fields, and a submit button disabled until the three required fields have
 * something in them. No custom validation messages, and no `noValidate`, so the browser's own
 * constraint UI still fires. The server validates independently regardless.
 *
 * Inputs and buttons are Kumo components even though the surrounding page chrome is far more
 * expressive than the app's: a visitor typing their work email should be typing into the same
 * control they'd meet everywhere else in the product.
 */
export default function DemoRequestForm({ rpcStub, variant = 'section' }: DemoRequestFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = Boolean(name && email && company) && !submitting

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)

    try {
      await rpcStub.submitDemoRequest({ name, email, company, message })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const isSection = variant === 'section'
  const shellClass = isSection
    ? 'themed-prompt-card-shadow rounded-2xl border border-kumo-line bg-kumo-base p-6 sm:p-8'
    : ''

  if (submitted) {
    // The whole form is replaced, which is a change a screen reader would otherwise miss entirely.
    return (
      <div role="status" aria-live="polite" className={shellClass}>
        <Banner
          variant="secondary"
          title="Request received"
          description="Thanks. We'll be in touch shortly."
          icon={<CheckCircle size={20} className="text-kumo-brand" weight="fill" />}
        />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={shellClass}>
      <div className="space-y-4">
        {/* Name and email pair up on the wider mid-page panel; the footer column stays single-file. */}
        <div className={isSection ? 'grid gap-4 sm:grid-cols-2' : 'space-y-4'}>
          <Input
            className="w-full"
            label="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            disabled={submitting}
          />
          <Input
            className="w-full"
            type="email"
            label="Work email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@company.com"
            required
            disabled={submitting}
          />
        </div>

        <Input
          className="w-full"
          label="Company"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
          required
          disabled={submitting}
        />

        <InputArea
          className="w-full"
          label="Message (optional)"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          disabled={submitting}
        />

        {error && <Banner variant="error" title={error} />}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!canSubmit}
          loading={submitting}
          className="w-full justify-center"
        >
          Request a demo
        </Button>
      </div>
    </form>
  )
}
