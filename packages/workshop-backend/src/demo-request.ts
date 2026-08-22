// Handles PublicApi.submitDemoRequest(): validation, best-effort IP rate limiting, and email
// delivery that degrades gracefully to logging when SEND_EMAIL isn't configured. Mirrors the
// zod-validation style in gadget-export.ts and the optional-binding degradation posture in
// client-errors.ts.

import { createLogger } from "@gadgets/backend-utils/logger";
import type { DemoRequestInput } from "@gadgets/workshop-shared/api";
import { z } from "zod";

const MAX_NAME = 128;
const MAX_EMAIL = 254;
const MAX_COMPANY = 128;
const MAX_MESSAGE = 2000;

const DEMO_REQUEST_SCHEMA = z.object({
  name: z.string().trim().min(1).max(MAX_NAME),
  email: z.string().trim().min(1).max(MAX_EMAIL).email(),
  company: z.string().trim().min(1).max(MAX_COMPANY),
  message: z.string().trim().max(MAX_MESSAGE).optional(),
});

type DemoRequestLogFields = { email?: string; company?: string };
const logger = createLogger<DemoRequestLogFields>({ component: "workshop.demo-request" });

/** Optional bindings needed to deliver "request a demo" submissions. */
export type DemoRequestEnv = Readonly<{
  SEND_EMAIL?: Pick<SendEmail, "send">;
  DEMO_REQUEST_RATE_LIMITER?: Pick<RateLimit, "limit">;
  DEMO_REQUEST_DESTINATION?: string;
  /**
   * Used only to derive the notification email's sending domain (see below). Required once
   * SEND_EMAIL is actually configured: there's no existing base-URL helper in this codebase to
   * reuse, and hardcoding a domain would silently send from a domain the deployment doesn't own.
   */
  PUBLIC_BASE_URL?: string;
}>;

/**
 * Validates and delivers a "request a demo" submission from the public marketing page.
 *
 * Validation failures and rate-limit rejections propagate to the caller (an RPC boundary lets
 * them surface as RPC errors). When SEND_EMAIL isn't configured, the submission is accepted and
 * logged rather than dropped, so self-hosted deployments that haven't set up Email Routing still
 * get a record of demo requests.
 */
export async function submitDemoRequest(
  env: DemoRequestEnv,
  input: DemoRequestInput,
  rateLimitKey: string,
): Promise<void> {
  const parsed = DEMO_REQUEST_SCHEMA.parse(input); // throws on invalid input

  if (env.DEMO_REQUEST_RATE_LIMITER) {
    const outcome = await env.DEMO_REQUEST_RATE_LIMITER.limit({ key: rateLimitKey });
    if (!outcome.success) throw new Error("Too many requests. Please try again later.");
  }

  if (!env.SEND_EMAIL || !env.DEMO_REQUEST_DESTINATION) {
    logger.info("demo request received (SEND_EMAIL not configured; logging only)", {
      event: "demo_request.logged_only", email: parsed.email, company: parsed.company,
    });
    return;
  }

  // Cloudflare Email Routing requires the `from` address to be on a domain the deployment
  // actually controls, so this can't fall back to a hardcoded placeholder domain. PUBLIC_BASE_URL
  // is the deployment's own public origin (also used to build OAuth redirect URIs elsewhere), so
  // it's the only value in scope that's both configured out-of-band and guaranteed to name a
  // domain the operator owns.
  if (!env.PUBLIC_BASE_URL) {
    throw new Error(
      "SEND_EMAIL and DEMO_REQUEST_DESTINATION are configured, but PUBLIC_BASE_URL is not set; " +
      "cannot determine a sending domain for demo-request email notifications.");
  }

  await env.SEND_EMAIL.send({
    from: `no-reply@${new URL(env.PUBLIC_BASE_URL).hostname}`,
    to: env.DEMO_REQUEST_DESTINATION,
    replyTo: parsed.email,
    subject: `Demo request: ${parsed.company}`,
    text: `Name: ${parsed.name}\nEmail: ${parsed.email}\nCompany: ${parsed.company}\n\n${
      parsed.message ?? ""}`,
  });
}
