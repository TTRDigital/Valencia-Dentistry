import assert from "node:assert/strict";
import { test } from "node:test";
import { stripRatings } from "./jsonld-guard.ts";

test("aggregateRating, review and Review/Rating nodes are removed", () => {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": ["Dentist", "LocalBusiness"], name: "X", aggregateRating: { "@type": "AggregateRating", ratingValue: 4.9 }, review: [{ "@type": "Review" }] },
      { "@type": "Review", reviewRating: { "@type": "Rating", ratingValue: 5 } },
      { "@type": "https://schema.org/AggregateRating", ratingValue: 5 },
      { "@type": "WebPage", name: "Home", about: { "@type": "Rating" } },
    ],
  };
  assert.deepEqual(stripRatings(graph), {
    "@context": "https://schema.org",
    "@graph": [{ "@type": ["Dentist", "LocalBusiness"], name: "X" }, { "@type": "WebPage", name: "Home" }],
  });
});

test("everything else is left as it is", () => {
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "Rated?", acceptedAnswer: { "@type": "Answer", text: "4.9 stars" } }] };
  assert.deepEqual(stripRatings(faq), faq);
});
