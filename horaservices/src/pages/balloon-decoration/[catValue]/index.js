import DecorationCatPage from "@/components/Decoration/DecorationCatPage";
import { getDecorationCatServerSideProps } from "@/utils/decorationCatGetServerSideProps";

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
  return (
    <DecorationCatPage
      catValue={catValue}
      city={city}
      locality={locality}
      initialCatalogueData={initialCatalogueData}
      initialCatId={initialCatId}
      initialHasMore={initialHasMore}
    />
  );
}
