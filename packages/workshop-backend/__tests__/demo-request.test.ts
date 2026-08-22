import { describe, expect, it, vi } from "vitest";
import type { DemoRequestInput } from "@gadgets/workshop-shared/api";
import { submitDemoRequest } from "../src/demo-request.js";

const validInput: DemoRequestInput = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines Ltd",
  message: "We'd like a demo of the platform.",
};

function loggedOnlyEvents(spy: ReturnType<typeof vi.spyOn>): unknown[] {
  return spy.mock.calls
    .map(([entry]) => entry as { event?: unknown })
    .filter(entry => entry?.event === "demo_request.logged_only");
}

describe("submitDemoRequest", () => {
  it("resolves without throwing and logs the event when SEND_EMAIL isn't configured", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    try {
      await expect(submitDemoRequest({}, validInput, "203.0.113.5")).resolves.toBeUndefined();
      expect(loggedOnlyEvents(info)).toHaveLength(1);
    } finally {
      info.mockRestore();
    }
  });

  it("rejects an invalid email with a single friendly message, not a raw ZodError dump", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    try {
      const attempt = submitDemoRequest({}, { ...validInput, email: "not-an-email" }, "203.0.113.5");
      await expect(attempt).rejects.toThrow();
      const error: Error = await attempt.catch(e => e);
      // A raw ZodError's .message is a JSON dump of the full issues array (including the email
      // regex under "pattern"), not something safe to show a public, unauthenticated caller.
      expect(error.message).not.toMatch(/pattern|origin|"code"/);
      expect(error.message.includes("\n")).toBe(false);
      expect(error.message).toMatch(/email/i);
      expect(info).not.toHaveBeenCalled();
    } finally {
      info.mockRestore();
    }
  });

  it("rejects a message longer than the maximum length", async () => {
    const tooLong = "x".repeat(2001);
    await expect(submitDemoRequest({}, { ...validInput, message: tooLong }, "203.0.113.5"))
      .rejects.toThrow();
  });

  it("sends an email once with the expected recipient, reply-to, and subject when configured", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const env = {
      SEND_EMAIL: { send },
      DEMO_REQUEST_DESTINATION: "ops@chad.example",
      PUBLIC_BASE_URL: "https://chad.example",
    };

    await submitDemoRequest(env, validInput, "203.0.113.5");

    expect(send).toHaveBeenCalledOnce();
    const [message] = send.mock.calls[0];
    expect(message).toMatchObject({
      to: "ops@chad.example",
      replyTo: validInput.email,
      subject: `Demo request: ${validInput.company}`,
    });
  });

  it("throws before attempting to send when the rate limiter rejects the request", async () => {
    const send = vi.fn();
    const limit = vi.fn().mockResolvedValue({ success: false });
    const env = {
      SEND_EMAIL: { send },
      DEMO_REQUEST_DESTINATION: "ops@chad.example",
      PUBLIC_BASE_URL: "https://chad.example",
      DEMO_REQUEST_RATE_LIMITER: { limit },
    };

    await expect(submitDemoRequest(env, validInput, "203.0.113.5")).rejects.toThrow();

    expect(send).not.toHaveBeenCalled();
    expect(limit).toHaveBeenCalledWith({ key: "203.0.113.5" });
  });

  it("proceeds with the submission (fails open) when the rate limiter binding itself throws", async () => {
    const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
    try {
      const send = vi.fn().mockResolvedValue(undefined);
      const limit = vi.fn().mockRejectedValue(new Error("rate limiter unavailable"));
      const env = {
        SEND_EMAIL: { send },
        DEMO_REQUEST_DESTINATION: "ops@chad.example",
        PUBLIC_BASE_URL: "https://chad.example",
        DEMO_REQUEST_RATE_LIMITER: { limit },
      };

      // A broken limiter binding is an infrastructure failure, not evidence of abuse -- mirrors
      // client-errors.ts's best-effort posture, which never lets a limiter exception block the
      // underlying operation.
      await expect(submitDemoRequest(env, validInput, "203.0.113.5")).resolves.toBeUndefined();
      expect(send).toHaveBeenCalledOnce();
      expect(debug).toHaveBeenCalledOnce();
    } finally {
      debug.mockRestore();
    }
  });

  it("resolves without throwing and logs a warning when SEND_EMAIL/DEMO_REQUEST_DESTINATION are set but PUBLIC_BASE_URL isn't", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const send = vi.fn();
      const env = {
        SEND_EMAIL: { send },
        DEMO_REQUEST_DESTINATION: "ops@chad.example",
        // PUBLIC_BASE_URL intentionally omitted.
      };

      // A misconfigured deployment (email delivery opted into but incomplete) must degrade to
      // "log only", not throw a raw internal-config error out to the public, unauthenticated
      // caller and silently drop the submission.
      await expect(submitDemoRequest(env, validInput, "203.0.113.5")).resolves.toBeUndefined();
      expect(send).not.toHaveBeenCalled();
      expect(loggedOnlyEvents(warn)).toHaveLength(1);
    } finally {
      warn.mockRestore();
    }
  });

  it("resolves without throwing and logs a warning when PUBLIC_BASE_URL is set but isn't a valid URL", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const send = vi.fn();
      const env = {
        SEND_EMAIL: { send },
        DEMO_REQUEST_DESTINATION: "ops@chad.example",
        PUBLIC_BASE_URL: "not-a-url",
      };

      // new URL() throws a TypeError on a malformed value; that's the same class of
      // misconfiguration as a missing PUBLIC_BASE_URL and must degrade the same way.
      await expect(submitDemoRequest(env, validInput, "203.0.113.5")).resolves.toBeUndefined();
      expect(send).not.toHaveBeenCalled();
      expect(loggedOnlyEvents(warn)).toHaveLength(1);
    } finally {
      warn.mockRestore();
    }
  });
});
