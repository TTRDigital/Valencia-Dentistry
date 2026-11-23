/**
 * Valencia Dentistry Sanity project: wroxd44y (TTR's Sanity organization,
 * created Nov 23, TTR-2822). The older project ord9drh8 is not used.
 *
 * The project ID is pinned here on purpose: this build environment sets a
 * global NEXT_PUBLIC_SANITY_PROJECT_ID that belongs to another site, and it
 * must never be read. Until the dataset is seeded (`npm run seed`) the site
 * renders from the built-in content in content/, per collection
 * (see lib/content/index.ts).
 */
export const projectId = "wroxd44y";
export const dataset = "production";
export const apiVersion = "2024-01-01";
export const studioBasePath = "/cms";
/** True once a real project ID is pinned above. */
export const sanityConfigured = /^[a-z0-9]{8,}$/.test(projectId);
