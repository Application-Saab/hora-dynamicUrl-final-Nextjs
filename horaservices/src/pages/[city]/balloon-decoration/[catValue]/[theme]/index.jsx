// import DecorationCatPage from "@/components/Decoration/DecorationCatPage";
// import { getDecorationCatServerSideProps } from "@/utils/decorationCatGetServerSideProps";

// export async function getServerSideProps(context) {
//   return getDecorationCatServerSideProps(context);
// }

// export default function ThemePage({
//   catValue,
//   city,
//   locality,
//   initialCatalogueData,
//   initialCatId,
//   initialHasMore,
// }) {
//   return (
//     <DecorationCatPage
//       catValue={catValue}
//       city={city}
//       locality={locality}
//       initialCatalogueData={initialCatalogueData}
//       initialCatId={initialCatId}
//       initialHasMore={initialHasMore}
//       isDirectProductPage={true}
//     />
//   );
// }



import DecorationCatCityPage from "@/components/Decoration/DecorationCatCityPage";
import { getDecorationCatServerSideProps } from "@/utils/decorationCatGetServerSideProps";

export async function getServerSideProps(context) {
  return getDecorationCatServerSideProps(context, { includeCity: true });
}

export default function BalloonDecorationCityCatPage(props) {
  return <DecorationCatCityPage {...props} isDirectProductPage={true} />;
}
