import type { LegalPage } from "@/lib/types";
import { breadcrumbNode, graph, JsonLd, webPageNode } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Markdown } from "@/components/blocks/Markdown";
import { Container, Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ServiceView";

export function LegalView({ page }: { page: LegalPage }) {
  const crumbs = [{ name: "Home", path: "/" }, { name: page.title, path: page.path }];
  return (
    <>
      <Section className="border-b hairline bg-warm" tight>
        <Container>
          <div className="mx-auto max-w-[72ch]">
            <Breadcrumbs items={crumbs} />
            <h1 className="mt-8">{page.title}</h1>
            {page.updated && <p className="mt-3 text-sm text-grey-600">Last updated {formatDate(page.updated)}</p>}
          </div>
        </Container>
      </Section>
      <Section className="bg-white">
        <Container>
          <div className="mx-auto max-w-[72ch]"><Markdown source={page.body} /></div>
        </Container>
      </Section>
      <JsonLd data={graph([webPageNode(page.path, page.seo.title ?? page.title, page.seo.description ?? ""), breadcrumbNode(crumbs)])} />
    </>
  );
}
