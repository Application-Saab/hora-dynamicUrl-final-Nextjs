// import DecorationCatPage from "@/pages/balloon-decoration/[catValue]";

// export default function ThemePage(props) {
//   return <DecorationCatPage {...props} />;
// }



import DecorationCatPage from "@/components/Decoration/DecorationCatPage";
import { getDecorationCatServerSideProps } from "@/utils/decorationCatGetServerSideProps";

export async function getServerSideProps(context) {
  // theme segment bhi context.params mein hoga — helper ko handle karna chahiye
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