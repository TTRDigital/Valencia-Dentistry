/**
 * Valencia Smile Expert Sanity project.
 *
 * The project ID is pinned here on purpose: this build environment sets a
 * global NEXT_PUBLIC_SANITY_PROJECT_ID that belongs to another site, and it
 * must never be read. Replace PROJECT_ID_PENDING with the practice's project
 * ID (sanity.io/manage) once it is created; until then the site renders from
 * the built-in content in content/ (see lib/content/source.ts).
 */
export const projectId = "PROJECT_ID_PENDING";
export const dataset = "production";
export const apiVersion = "2024-01-01";
export const studioBasePath = "/cms";
/** True once a real project ID is pinned above. */
export const sanityConfigured = /^[a-z0-9]{8,}$/.test(projectId) && projectId !== "PROJECT_ID_PENDING".toLowerCase();
