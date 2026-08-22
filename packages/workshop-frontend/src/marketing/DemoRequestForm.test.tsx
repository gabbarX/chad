// @vitest-environment jsdom
/* eslint-disable react/react-in-jsx-scope */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import type { RpcStub } from 'capnweb'
import type { DemoRequestInput, PublicApi } from '@gadgets/workshop-shared/api'

import DemoRequestForm from './DemoRequestForm'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

/**
 * React tracks the last value it wrote to an input, so assigning `.value` directly is ignored on the
 * next change. Going through the prototype setter and then dispatching `input` is what makes React
 * see a real edit.
 */
function type(field: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const prototype =
    field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(field, value)
  field.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('DemoRequestForm', () => {
  let container: HTMLDivElement
  let root: Root
  let submitDemoRequest: Mock<(request: DemoRequestInput) => Promise<void>>
  let rpcStub: RpcStub<PublicApi>

  const field = (name: string) =>
    container.querySelector<HTMLInputElement>(`[name="${name}"]`)!

  const submitButton = () =>
    container.querySelector<HTMLButtonElement>('button[type="submit"]')!

  const render = async (variant?: 'section' | 'footer') => {
    await act(async () => {
      root.render(<DemoRequestForm rpcStub={rpcStub} variant={variant} />)
    })
  }

  const fillRequiredFields = async () => {
    await act(async () => {
      type(field('name'), 'Priya Raghunathan')
      type(field('email'), 'priya@northwindlogistics.com')
      type(field('company'), 'Northwind Logistics')
    })
  }

  const submit = async () => {
    await act(async () => {
      container
        .querySelector('form')!
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
  }

  beforeEach(() => {
    submitDemoRequest = vi.fn<(request: DemoRequestInput) => Promise<void>>(async () => undefined)
    rpcStub = { submitDemoRequest } as unknown as RpcStub<PublicApi>
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    vi.clearAllMocks()
  })

  it('submits the entered values as a DemoRequestInput and shows a success state', async () => {
    await render()
    await fillRequiredFields()
    await act(async () => {
      type(
        container.querySelector<HTMLTextAreaElement>('[name="message"]')!,
        'We move freight for 40 depots and want to stop waiting on IT for dashboards.',
      )
    })
    await submit()

    expect(submitDemoRequest).toHaveBeenCalledTimes(1)
    expect(submitDemoRequest.mock.calls[0][0]).toEqual({
      name: 'Priya Raghunathan',
      email: 'priya@northwindlogistics.com',
      company: 'Northwind Logistics',
      message: 'We move freight for 40 depots and want to stop waiting on IT for dashboards.',
    })

    // The form is replaced by the confirmation, so the visitor can't submit twice.
    expect(container.querySelector('form')).toBeNull()
    expect(container.textContent).toContain('Request received')
  })

  it('submits with an empty message when the optional field is left alone', async () => {
    await render()
    await fillRequiredFields()
    await submit()

    expect(submitDemoRequest).toHaveBeenCalledTimes(1)
    expect(submitDemoRequest.mock.calls[0][0].message).toBe('')
  })

  it("shows the thrown error's message and keeps the form up for a retry", async () => {
    submitDemoRequest.mockRejectedValueOnce(new Error('Too many requests. Try again in a minute.'))

    await render()
    await fillRequiredFields()
    await submit()

    expect(container.textContent).toContain('Too many requests. Try again in a minute.')
    expect(container.querySelector('form')).not.toBeNull()
    expect(submitButton().disabled).toBe(false)
  })

  it('holds submit until the required fields are filled', async () => {
    await render()
    expect(submitButton().disabled).toBe(true)

    // Name and email alone are not enough; company is required too.
    await act(async () => {
      type(field('name'), 'Priya Raghunathan')
      type(field('email'), 'priya@northwindlogistics.com')
    })
    expect(submitButton().disabled).toBe(true)

    await act(async () => type(field('company'), 'Northwind Logistics'))
    expect(submitButton().disabled).toBe(false)
  })

  it('marks the required fields required and types the email field for native validation', async () => {
    await render()

    expect(field('name').required).toBe(true)
    expect(field('email').required).toBe(true)
    expect(field('company').required).toBe(true)
    expect(field('email').type).toBe('email')

    // Native constraint validation must stay on: no `noValidate` escape hatch.
    expect(container.querySelector('form')!.hasAttribute('novalidate')).toBe(false)
  })

  it('shares all submit behaviour across both variants', async () => {
    await render('footer')
    await fillRequiredFields()
    await submit()

    expect(submitDemoRequest).toHaveBeenCalledTimes(1)
    expect(container.textContent).toContain('Request received')
  })
})
