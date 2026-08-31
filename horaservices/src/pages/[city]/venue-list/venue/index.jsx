import VenuePage from "@/components/VenueCommon/VenuePage";
import {
  BASE_URL,
  GET_VENUE_DETAILS_BY_ID,
  GET_VENUE_PACKAGES_BY_VENUE_ID,
  GET_VENUE_CATEGORIES_LIST,
} from "@/utils/apiconstants";

function formatCity(slug) {
  if (!slug) return null;
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

function pickVenue(json) {
  if (!json) return null;
  if (json.data && !Array.isArray(json.data) && (json.data.venueName || json.data._id))
    return json.data;
  if (Array.isArray(json.data) && json.data[0]) return json.data[0];
  if (json.venue) return json.venue;
  return null;
}

export async function getServerSideProps(context) {
  const citySlug = context.params?.city || null;
  const venueId =
    context.query?.venueid ||
    context.query?.venueId ||
    null;

  console.log("[GSSP city venue]", { citySlug, venueId, query: context.query });

  let initialEventDetails = null;
  let initialPackages = [];
  let initialCategories = [];

  if (venueId) {
    try {
      const res = await fetch(
        `${BASE_URL}${GET_VENUE_DETAILS_BY_ID}/${venueId}`,
        { headers: { Accept: "application/json" } }
      );
      const json = await res.json();
      console.log("[GSSP] details status", res.status, pickVenue(json)?.venueName);
      initialEventDetails = pickVenue(json);
    } catch (e) {
      console.error("[GSSP] details", e.message);
    }

    try {
      const res = await fetch(
        `${BASE_URL}${GET_VENUE_PACKAGES_BY_VENUE_ID}/${venueId}`,
        { headers: { Accept: "application/json" } }
      );
      const json = await res.json();
      initialPackages = Array.isArray(json?.data) ? json.data : [];
    } catch (e) {
      console.error("[GSSP] packages", e.message);
    }
  }

  try {
    const res = await fetch(`${BASE_URL}${GET_VENUE_CATEGORIES_LIST}`, {
      headers: { Accept: "application/json" },
    });
    const json = await res.json();
    initialCategories = json?.data || [];
  } catch (_) {}

  return {
    props: {
      city: formatCity(citySlug),
      venueId,
      initialEventDetails,
      initialPackages,
      initialCategories,
    },
  };
}

export default function CityVenuePage(props) {
  return <VenuePage {...props} />;
}