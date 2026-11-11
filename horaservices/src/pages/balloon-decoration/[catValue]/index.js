import Link from "next/link";
import DecorationCatPage from "@/components/Decoration/DecorationCatPage";
import SectionDescription from "@/components/Description";
import FAQSection from "@/components/FAQSection";
import { getDecorationCatServerSideProps } from "@/utils/decorationCatGetServerSideProps";
import { getCategoryContent } from "@/utils/Decorationcategorycontent";
import { getBlogArticlesForCatValue } from "@/utils/blogServiceLinks";

export async function getServerSideProps(context) {
  return getDecorationCatServerSideProps(context);
}

export default function BalloonDecorationCatPage({
  catValue,
  city,
  locality,
  initialCatalogueData,
  initialCatId,
  initialHasMore,
}) {

  const categoryContent = getCategoryContent(catValue);
  const relatedBlogs = getBlogArticlesForCatValue(catValue);

  return (
    <>
      <DecorationCatPage
        catValue={catValue}
        city={city}
        locality={locality}
        initialCatalogueData={initialCatalogueData}
        initialCatId={initialCatId}
        initialHasMore={initialHasMore}
      />

      {categoryContent && (
        <>
          <SectionDescription sections={categoryContent.description} />

          <div className="tab-section-details-productpage">
            <FAQSection faqData={categoryContent.faqData()} />
          </div>
        </>
      )}

      {/* Blog cross-links — service → blog */}
      {relatedBlogs.length > 0 && (
        <div style={{ padding: "16px 16px 24px", maxWidth: "600px" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#97538c", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            From our blog
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {relatedBlogs.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/balloon-decoration/${article.slug}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  textDecoration: "none",
                  background: "#faf5fd",
                  border: "1px solid #e8d5f0",
                  borderRadius: "10px",
                  padding: "12px 14px",
                }}
              >
                <span style={{ fontSize: "18px", lineHeight: 1, marginTop: "2px" }}>📖</span>
                <span style={{ flex: 1 }}>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#2d2d2d", display: "block", lineHeight: "1.4" }}>
                    {article.title}
                  </span>
                  <span style={{ fontSize: "12px", color: "#888", marginTop: "2px", display: "block" }}>
                    {article.readingTime} min read
                  </span>
                </span>
                <span style={{ fontSize: "14px", color: "#97538c", fontWeight: 500, marginTop: "2px" }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}