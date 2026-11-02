import Head from "next/head";
import DecorationCatCityPage from "@/components/Decoration/DecorationCatCityPage";
import { getDecorationCatServerSideProps } from "@/utils/decorationCatGetServerSideProps";
import { getDecorationCatOrganizationSchema } from "@/utils/schema";

export async function getServerSideProps(context) {
  return getDecorationCatServerSideProps(context, { includeCity: true });
}

export default function DecorationLocalityCatPage(props) {
  const catSchema = getDecorationCatOrganizationSchema(props.catValue);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(catSchema) }}
        />
      </Head>
      <DecorationCatCityPage {...props} />
    </>
  );
}
