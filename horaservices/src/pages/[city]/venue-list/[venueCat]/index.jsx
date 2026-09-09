
import VenuelandMainPage from "@/components/VenueCommon/VenueLandingPage";
import { venueData } from "@/utils/venueCircleData.js";

export async function getServerSideProps(context) {
  const { city, venue } = context.params;

  const matched = venueData.find((v) => v.slug === venue);
  const initialVenueType = matched ? matched.id : "all";

  return {
    props: {
      citySlug: city || null,
      initialVenueType,
    },
  };
}

export default function VenuecityTypePage({ citySlug, initialVenueType }) {
  return (
    <VenuelandMainPage
      citySlug={citySlug}
      initialVenueType={initialVenueType}
    />
  );
}