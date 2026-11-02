import Head from "next/head";
import DecorationCatPage from "@/components/Decoration/DecorationCatPage";
import { getDecorationCatServerSideProps } from "@/utils/decorationCatGetServerSideProps";
import { getDecorationCatOrganizationSchema } from "@/utils/schema";

export async function getServerSideProps(context) {
  return getDecorationCatServerSideProps(context);
}

export default function ThemePage({
  catValue,
  city,
  locality,
  initialCatalogueData,
  initialCatId,
  initialHasMore,
}) {
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
    </>
  );
}
