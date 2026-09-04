import VenuePage from "@/components/VenueCommon/VenuePage";
import {
  BASE_URL,
  GET_VENUE_DETAILS_BY_ID,
  GET_VENUE_PACKAGES_BY_VENUE_ID,
  GET_VENUE_CATEGORIES_LIST,
} from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";

function pickVenue(json) {
  if (!json) return null;
  if (
    json.data &&
    !Array.isArray(json.data) &&
    (json.data.venueName || json.data._id)
  ) {
    return json.data;
  }
  if (Array.isArray(json.data) && json.data[0]) return json.data[0];
  if (json.venue) return json.venue;
  return null;
}

export async function getServerSideProps(context) {
  const venueId = context.query?.venueid || context.query?.venueId || null;

  console.log("[GSSP non-city venue]", { venueId, query: context.query });

  let initialEventDetails = null;
  let initialPackages = [];
  let initialCategories = [];

  if (venueId) {
    try {
      const res = await fetchWithError(
        `${BASE_URL}${GET_VENUE_DETAILS_BY_ID}/${venueId}`
      );
      const json = await res.json();

      if (json.error) throw new Error();

      console.log(
        "[GSSP non-city] details",
        res.status,
        pickVenue(json)?.venueName
      );

      initialEventDetails = pickVenue(json);
    } catch (e) {
      console.error("[GSSP non-city] details", e.message);
    }

    try {
      const res = await fetchWithError(
        `${BASE_URL}${GET_VENUE_PACKAGES_BY_VENUE_ID}/${venueId}`
      );
      const json = await res.json();

      if (json.error) throw new Error();

      initialPackages = Array.isArray(json?.data) ? json.data : [];
    } catch (e) {
      console.error("[GSSP non-city] packages", e.message);
    }
  }

  try {
    const res = await fetchWithError(
      `${BASE_URL}${GET_VENUE_CATEGORIES_LIST}`
    );
    const data = await res.json();

    if (data.error) throw new Error();

    initialCategories = data?.data || [];
  } catch (err) {
    console.error(err);
  }

  return {
    props: {
      city: null,
      venueId,
      initialEventDetails,
      initialPackages,
      initialCategories,
    },
  };
}

export default function VenueListPage(props) {
  return <VenuePage {...props} />;
}
