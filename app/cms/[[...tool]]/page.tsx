import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";
import { sanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "10vh auto", padding: 24, lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 24 }}>CMS not connected yet</h1>
        <p>The Sanity project ID has not been pinned in <code>sanity/env.ts</code>. Until it is, the site renders from the built-in content in <code>content/</code>.</p>
        <p>Setup: create the project at sanity.io/manage, set <code>projectId</code> in <code>sanity/env.ts</code>, add CORS origins, then run <code>npm run seed</code> with an Editor token. See the README.</p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
