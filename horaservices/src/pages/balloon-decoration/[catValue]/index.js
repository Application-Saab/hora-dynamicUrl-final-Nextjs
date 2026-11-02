import Head from "next/head";
import DecorationCatPage from "@/components/Decoration/DecorationCatPage";
import SectionDescription from "@/components/Description";
import FAQSection from "@/components/FAQSection";
import { getDecorationCatServerSideProps } from "@/utils/decorationCatGetServerSideProps";
import { getCategoryContent } from "@/utils/Decorationcategorycontent";
import { getDecorationCatOrganizationSchema } from "@/utils/schema";

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
  const catSchema = getDecorationCatOrganizationSchema(catValue);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(catSchema) }}
        />
      </Head>

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
    </>
  );
}
