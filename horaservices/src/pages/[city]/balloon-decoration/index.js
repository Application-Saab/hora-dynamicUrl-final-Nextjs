import Head from "next/head";

import DecorationCityPage from "../../../components/Decoration/DecorationCityPage";

import {
  isValidCitySlug,
  getCityNameFromSlug,
} from "../../../utils/validCities";
import { getBalloonDecorationSeo } from "@/utils/balloonDecorationSeo";

export async function getServerSideProps(context) {
  const citySlug = context.params?.city?.toLowerCase();

  if (!isValidCitySlug(citySlug)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      city: getCityNameFromSlug(citySlug),
      citySlug,
    },
  };
}

export default function BalloonDecorationCityPage({
  city,
  citySlug,
}) {
  // SEO sheet copy for this city hub (falls back to the existing copy).
  const sheetSeo = getBalloonDecorationSeo({ city: citySlug });

  return (
    <>
      <Head>
        <title>
          {sheetSeo?.title ||
            `HORA Decorations in ${city} | Balloon & Flower Decorations for Birthdays, Weddings, Baby Showers & More – Starting at ₹1199`}
        </title>

        <meta
          name="description"
          content={
            sheetSeo?.description ||
            `📸 Capture Every Moment in ${city}! ✨ HORA Decorations — Professional Balloon & Flower decorators for birthdays, weddings, baby showers & more.`
          }
        />

        <meta
          name="keywords"
          content={`balloon decoration in ${city}, birthday decoration, wedding decoration, baby shower decoration`}
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <meta
          property="og:url"
          content={`https://horaservices.com/${citySlug}/balloon-decoration`}
        />

        <meta
          property="og:type"
          content="website"
        />
      </Head>

      <DecorationCityPage
        city={city}
        citySlug={citySlug}
        locality={null}
      />
    </>
  );
}