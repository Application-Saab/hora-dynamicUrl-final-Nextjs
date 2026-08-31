import Head from "next/head";
import DecorationCityPage from "../../../components/Decoration/DecorationCityPage";

export async function getServerSideProps(context) {
  const { city } = context.params;
  const { locality } = context.query;

  if (!city) {
    return { notFound: true };
  }

  const citySlug = city.toLowerCase();
  const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  return {
    props: {
      city: cityName,
      citySlug,
      locality: locality || null,
    },
  };
}

export default function BalloonDecorationCityPage({ city, citySlug, locality }) {
  return (
    <>
      <Head>
        <title>
          {locality
            ? `HORA Decorations in ${locality}, ${city} | Balloon & Flower Decorations – Starting at ₹1199`
            : `HORA Decorations in ${city} | Balloon & Flower Decorations for Birthdays, Weddings, Baby Showers & More – Starting at ₹1199`}
        </title>
        <meta
          name="description"
          content={
            locality
              ? `📸 Capture Every Moment in ${locality}, ${city}! ✨ HORA Decorations makes every celebration magical.`
              : `📸 Capture Every Moment in ${city}! ✨ HORA Decorations — Professional Balloon & Flower decorators for birthdays, weddings, baby showers & more.`
          }
        />
        <meta
          name="keywords"
          content={`balloon decoration in ${city}, birthday decoration, wedding decoration, baby shower decoration`}
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:url"
          content={
            locality
              ? `https://horaservices.com/${citySlug}/${locality.toLowerCase()}/balloon-decoration`
              : `https://horaservices.com/${citySlug}/balloon-decoration`
          }
        />
        <meta property="og:type" content="website" />
      </Head>

      <DecorationCityPage city={city} citySlug={citySlug} locality={locality} />
    </>
  );
}