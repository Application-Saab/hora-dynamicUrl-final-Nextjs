import DecorationCatCityPage from "@/components/Decoration/DecorationCatCityPage";
import { getDecorationCatServerSideProps } from "@/utils/decorationCatGetServerSideProps";

export async function getServerSideProps(context) {
  return getDecorationCatServerSideProps(context, { includeCity: true });
}

export default function BalloonDecorationCityCatPage(props) {
  return <DecorationCatCityPage {...props} />;
}
