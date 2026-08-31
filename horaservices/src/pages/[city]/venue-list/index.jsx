// import VenuelandMainPage from "@/pages/venue-list"; 
// // 👆 apne actual venuelandMainPage.js ke path se replace karo

// function VenuelandCityPage() {
//   return <VenuelandMainPage />;
// }

// export default VenuelandCityPage;


// import VenuelandMainPage from "@/pages/venue-list";
// import { BASE_URL, VENUE_PUBLIC_LISTING } from "@/utils/apiconstants";
// import { fetchWithError } from "@/utils/fetchWithError";

// function formatCityDisplay(slug) {
//   if (!slug) return "";
//   return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
// }

// export async function getServerSideProps(context) {
//   const { city } = context.params || {};
//   const citySlug = (city || "").toLowerCase();

//   if (!citySlug) {
//     return { notFound: true };
//   }

//   const cityDisplay = formatCityDisplay(citySlug);

//   // Default filters (page pe pehle se Birthday / all)
//   const defaultEventType = "Birthday";
//   const defaultVenueType = "all";

//   let initialVenues = [];

//   try {
//     const params = new URLSearchParams();
//     params.append("eventType", defaultEventType);
//     params.append("city", cityDisplay);
//     // venueType "all" → param mat bhejo (client jaisa)

//     const res = await fetchWithError(
//       `${BASE_URL}${VENUE_PUBLIC_LISTING}?${params.toString()}`
//     );
//     const json = await res.json();
//     initialVenues = json?.data || [];
//   } catch (err) {
//     console.error("SSR venue list error:", err.message);
//     initialVenues = [];
//   }

//   return {
//     props: {
//       city: cityDisplay,
//       citySlug,
//       initialVenues,
//       initialEventType: defaultEventType,
//       initialVenueType: defaultVenueType,
//     },
//   };
// }

// function VenuelandCityPage({
//   city,
//   citySlug,
//   initialVenues,
//   initialEventType,
//   initialVenueType,
// }) {
//   return (
//     <VenuelandMainPage
//       city={city}
//       citySlug={citySlug}
//       initialVenues={initialVenues}
//       initialEventType={initialEventType}
//       initialVenueType={initialVenueType}
//     />
//   );
// }

// export default VenuelandCityPage;



// pages/[city]/venue-list/index.jsx
import VenuelandMainPage from "@/components/VenueCommon/VenueLandingPage";
import { BASE_URL, VENUE_PUBLIC_LISTING } from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";

function formatCityDisplay(slug) {
  if (!slug) return "";
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

export async function getServerSideProps(context) {
  const { city } = context.params || {};
  const citySlug = (city || "").toLowerCase();
  if (!citySlug) return { notFound: true };

  const cityDisplay = formatCityDisplay(citySlug);
  const defaultEventType = "Birthday";
  const defaultVenueType = "all";

  let initialVenues = [];
  try {
    const params = new URLSearchParams();
    params.append("eventType", defaultEventType);
    params.append("city", cityDisplay);

    const res = await fetchWithError(
      `${BASE_URL}${VENUE_PUBLIC_LISTING}?${params.toString()}`
    );
    const json = await res.json();
    initialVenues = json?.data || [];
  } catch (err) {
    console.error("SSR venue list error:", err.message);
  }

  return {
    props: {
      city: cityDisplay,
      citySlug,
      initialVenues,
      initialEventType: defaultEventType,
      initialVenueType: defaultVenueType,
    },
  };
}

export default function VenuelandCityPage(props) {
  return <VenuelandMainPage {...props} />;
}