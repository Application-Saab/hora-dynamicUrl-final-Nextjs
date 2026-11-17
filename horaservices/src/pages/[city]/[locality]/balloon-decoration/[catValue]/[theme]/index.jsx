import DecorationCatCityPage from "@/components/Decoration/DecorationCatCityPage";
import { getDecorationCatServerSideProps } from "@/utils/decorationCatGetServerSideProps";

export async function getServerSideProps(context) {
  return getDecorationCatServerSideProps(context, { includeCity: true });
}

/**
 * Locality theme page, e.g.
 * /gurugram/sector-57/balloon-decoration/kids-birthday-decoration/mermaid.
 *
 * This previously re-exported the component from the non-city [catValue] page,
 * which does not carry that page's getServerSideProps — so the route rendered
 * with no catalogue data, no city and no theme at all. It now matches the
 * sibling [catValue] route and renders the same theme-specific content.
 */
export default function DecorationLocalityThemePage(props) {
  return <DecorationCatCityPage {...props} />;
}
