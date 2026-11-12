import DecorationCatCityPage from "@/components/Decoration/DecorationCatCityPage";
import { getDecorationCatServerSideProps } from "@/utils/decorationCatGetServerSideProps";

export async function getServerSideProps(context) {
  return getDecorationCatServerSideProps(context);
}

/**
 * Non-city theme page, e.g. /balloon-decoration/kids-birthday-decoration/mermaid.
 *
 * Previously this rendered a bare DecorationCatPage: no description section,
 * no FAQ section, and the theme was dropped entirely rather than passed down.
 * It now shares DecorationCatCityPage with the city theme route, so it gets
 * the same theme-specific intro, theme FAQs and FAQPage schema. The component
 * handles a missing city, so no city-only markup is rendered here.
 */
export default function ThemePage(props) {
  return <DecorationCatCityPage {...props} />;
}
