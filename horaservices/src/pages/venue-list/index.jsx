import VenuelandMainPage from "@/components/VenueCommon/VenueLandingPage";
import { BASE_URL, VENUE_PUBLIC_LISTING } from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";

export async function getServerSideProps() {
  const defaultEventType = "Birthday";
  const defaultVenueType = "all";

  let initialVenues = [];

  try {
    const params = new URLSearchParams();
    params.append("eventType", defaultEventType);

    const res = await fetchWithError(
      `${BASE_URL}${VENUE_PUBLIC_LISTING}?${params.toString()}`
    );
    const json = await res.json();
    initialVenues = json?.data || [];
  } catch (err) {
    console.error("SSR venue-list (non-city) error:", err.message);
  }

  return {
    props: {
      city: null,
      citySlug: null,
      initialVenues,
      initialEventType: defaultEventType,
      initialVenueType: defaultVenueType,
    },
  };
}

export default function VenueListPage(props) {
  return <VenuelandMainPage {...props} />;
}