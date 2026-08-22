/**
 * Outbound URLs used by the marketing page.
 *
 * Resolved from this repository's own metadata rather than guessed: the git `origin` remote is
 * `https://github.com/gabbarX/chad.git` and the root `package.json` name is `chad`. Both the hero's
 * secondary CTA and the footer link here so the "self-host it free" destination can never drift
 * between the two places it appears.
 */
export const REPO_URL = 'https://github.com/gabbarX/chad'

/** README anchor for `## Get Started`, which carries the deploy / run-locally instructions. */
export const SELF_HOST_URL = `${REPO_URL}#get-started`

/** The repo's `docs/` directory (public-server, blueprints, oauth-signin, and friends). */
export const DOCS_URL = `${REPO_URL}/tree/main/docs`
