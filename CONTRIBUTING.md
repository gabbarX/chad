# Contributing to Chad

Chad is a private, commercial product. This repository is not public and does not take
outside contributions — everyone with push access is on the team.

## Working on Chad

- Branch off `main` and keep branches short-lived.
- Open a pull request for anything non-trivial. Push straight to `main` only for
  mechanical fixes.
- Put the change *and its rationale* in the PR description. Future-you is the audience.

## What CI runs on your pull request

Lint, build and tests ([`ci.yml`](.github/workflows/ci.yml)) run on every pull request.

Preview deployments ([`preview.yml`](.github/workflows/preview.yml)) need a Cloudflare API
token that can create Workers and storage on our Cloudflare account, so they run only for
branches pushed to this repository.

## Licensing and attribution — please read

Chad is derived from Cloudflare OS, which is licensed under the Apache License, Version 2.0.
Two rules here are not optional:

- **Never delete or edit `LICENSE`.**
- **Never delete or restructure `NOTICE`.** This repository's history was squashed to a single
  commit, so `NOTICE` is the only surviving record that the work derives from Cloudflare OS,
  and it carries our Section 4(b) notice of changes. If you make a change worth recording,
  *append* to its "Modifications" list rather than rewriting the file.

Both files are also deliberately excluded from any rebranding pass — they are supposed to
still say "Cloudflare OS".

## Cloudflare references are not leftovers

The product rename from "Cloudflare OS" to "Chad" is finished, and it was deliberately narrow.
Of roughly four thousand occurrences of "cloudflare" in this codebase, only about a hundred
were the product name. The rest are references to Cloudflare *the platform we run on*:

- `@cloudflare/*` dependencies — workerd, wrangler, vitest-pool-workers, kumo
- `packages/gatekeeper-cloudflare` — an integration *with* the Cloudflare API
- `CloudflareLogo.tsx` — vendor mark shown in the AI Gateway billing UI
- links to `developers.cloudflare.com` and `dash.cloudflare.com`
- the Dependabot `@cloudflare/*` grouping and `CF_AI_GATEWAY_*` secrets

**Leave all of these alone.** Renaming them does not make the product more ours; it breaks the
build and severs working integrations.
