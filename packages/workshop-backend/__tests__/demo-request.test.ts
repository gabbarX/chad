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

  it("rejects an invalid email without logging or attempting to send", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    try {
      await expect(submitDemoRequest({}, { ...validInput, email: "not-an-email" }, "203.0.113.5"))
        .rejects.toThrow();
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
});
