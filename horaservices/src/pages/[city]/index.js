// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState, useCallback } from "react";
// import cityData from "@/utils/cityData";
// import LocalitiesSection from "@/components/LocalitiesSection";
// import HomeContent from "@/components/HomeContent";
// import Head from "next/head";


// function getCitySlugFromPath(pathname) {
//   if (!pathname) return "";
//   const parts = pathname.split("/").filter(Boolean);
//   return parts[0] || "";
// }

// export default function CityPage() {
//   const router = useRouter();

//   const [citySlug, setCitySlug] = useState("");

//   const syncCityFromUrl = useCallback((overridePathname) => {
//     if (typeof window === "undefined") return;
//     const path = overridePathname || window.location.pathname;
//     setCitySlug(getCitySlugFromPath(path));
//   }, []);


//   useEffect(() => {
//     syncCityFromUrl();
//   }, [syncCityFromUrl]);


//   useEffect(() => {
//     const handleCityChanged = (e) => syncCityFromUrl(e?.detail?.path);
//     window.addEventListener("city:changed", handleCityChanged);
//     return () => window.removeEventListener("city:changed", handleCityChanged);
//   }, [syncCityFromUrl]);


//   useEffect(() => {
//     const handlePopState = () => syncCityFromUrl();
//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, [syncCityFromUrl]);

//   const normalizedCity = citySlug.toLowerCase();
//   const city = citySlug
//     ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1)
//     : "";

//   const [localities, setLocalities] = useState([]);

//   useEffect(() => {
//     if (normalizedCity && cityData[normalizedCity]) {
//       setLocalities(cityData[normalizedCity].cityLocalitiesList || []);
//     } else {
//       setLocalities([]);
//     }
//   }, [normalizedCity]);

//   const localityHandleClick = (localityName) => {
//     const formattedLocality = localityName.replace(/\s+/g, "-").toLowerCase();
//     router.push(`/${normalizedCity}/${formattedLocality}`);
//   };


//   if (!city) return null;

//   return (
//     <>
//       <Head>
//         <title>
//           {`Party Services in ${city} | Decoration, Catering, Photography & More | HORA`}
//         </title>

//         <meta
//           name="description"
//           content={`Book party decoration, catering, photography, chef at home, live catering, birthday decoration, anniversary decoration and event services in ${city}. Verified vendors, 1000+ designs & easy booking with HORA.`}
//         />

//         <meta name="robots" content="index,follow" />

//         <link
//           rel="canonical"
//           href={`https://horaservices.com/${normalizedCity}`}
//         />

//         <meta
//           property="og:title"
//           content={`Party Services in ${city} | Decoration, Catering & More | HORA`}
//         />

//         <meta
//           property="og:description"
//           content={`Book decoration, catering, photography and chef services in ${city} for birthdays, anniversaries and special events.`}
//         />

//         <meta
//           property="og:url"
//           content={`https://horaservices.com/${normalizedCity}`}
//         />

//         <meta property="og:type" content="website" />

//         <meta
//           property="og:image"
//           content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
//         />

//         <meta name="twitter:card" content="summary_large_image" />

//         <meta
//           name="twitter:title"
//           content={`Party Services in ${city} | HORA`}
//         />

//         <meta
//           name="twitter:description"
//           content={`Book decoration, catering, photography and chef services in ${city}.`}
//         />
//       </Head>

//       <HomeContent />

   
//       <LocalitiesSection
//         key={city}
//         title={`${city} Localities`}
//         localities={localities}
//         handleClick={localityHandleClick}
//       />
//     </>
//   );
// }



// import { useRouter } from "next/router";
// import Head from "next/head";

// import cityData from "@/utils/cityData";
// import { slugToCityName } from "@/utils/validCities";

// import LocalitiesSection from "@/components/LocalitiesSection";
// import HomeContent from "@/components/HomeContent";

// // Server-side validation
// export async function getServerSideProps({ params }) {
//   const citySlug = params?.city?.toLowerCase();

//   // Check 1: URL slug allowed cities me hai ya nahi
//   if (!citySlug || !slugToCityName[citySlug]) {
//     return {
//       notFound: true,
//     };
//   }

//   // Check 2: cityData me bhi city available hai ya nahi
//   if (!cityData[citySlug]) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       citySlug,
//       cityName: slugToCityName[citySlug],
//     },
//   };
// }

// export default function CityPage({ citySlug, cityName }) {
//   const router = useRouter();

//   const localities = cityData[citySlug]?.cityLocalitiesList || [];

//   const localityHandleClick = (localityName) => {
//     const formattedLocality = localityName
//       .replace(/\s+/g, "-")
//       .toLowerCase();

//     router.push(`/${citySlug}/${formattedLocality}`);
//   };

//   return (
//     <>
//       <Head>
//         <title>
//           {`Party Services in ${cityName} | Decoration, Catering, Photography & More | HORA`}
//         </title>

//         <meta
//           name="description"
//           content={`Book party decoration, catering, photography, chef at home, live catering, birthday decoration, anniversary decoration and event services in ${cityName}. Verified vendors, 1000+ designs & easy booking with HORA.`}
//         />

//         <meta name="robots" content="index,follow" />

//         <link
//           rel="canonical"
//           href={`https://horaservices.com/${citySlug}`}
//         />

//         <meta
//           property="og:title"
//           content={`Party Services in ${cityName} | Decoration, Catering & More | HORA`}
//         />

//         <meta
//           property="og:description"
//           content={`Book decoration, catering, photography and chef services in ${cityName} for birthdays, anniversaries and special events.`}
//         />

//         <meta
//           property="og:url"
//           content={`https://horaservices.com/${citySlug}`}
//         />

//         <meta property="og:type" content="website" />

//         <meta
//           property="og:image"
//           content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
//         />

//         <meta name="twitter:card" content="summary_large_image" />

//         <meta
//           name="twitter:title"
//           content={`Party Services in ${cityName} | HORA`}
//         />

//         <meta
//           name="twitter:description"
//           content={`Book decoration, catering, photography and chef services in ${cityName}.`}
//         />
//       </Head>

//       <HomeContent />

//       <LocalitiesSection
//         key={citySlug}
//         title={`${cityName} Localities`}
//         localities={localities}
//         handleClick={localityHandleClick}
//       />
//     </>
//   );
// }




// import { useRouter } from "next/router";
// import Head from "next/head";

// import cityData from "@/utils/cityData";
// import {
//   slugToCityName,
//   isValidCitySlug,
// } from "@/utils/validCities";

// import LocalitiesSection from "@/components/LocalitiesSection";
// import HomeContent from "@/components/HomeContent";

// export async function getServerSideProps({ params }) {
//   const citySlug = String(params?.city || "")
//     .trim()
//     .toLowerCase();

//   /**
//    * Validate city slug
//    */
//   if (!isValidCitySlug(citySlug)) {
//     return {
//       notFound: true,
//     };
//   }

//   /**
//    * Validate city exists in cityData
//    */
//   if (!cityData?.[citySlug]) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       citySlug,
//       cityName: slugToCityName[citySlug],
//     },
//   };
// }

// export default function CityPage({
//   citySlug,
//   cityName,
// }) {
//   const router = useRouter();

//   const localities =
//     cityData?.[citySlug]?.cityLocalitiesList || [];

//   const localityHandleClick = (localityName) => {
//     const formattedLocality = localityName
//       .replace(/\s+/g, "-")
//       .toLowerCase();

//     router.push(
//       `/${citySlug}/${formattedLocality}`
//     );
//   };

//   return (
//     <>
//       <Head>
//         <title>
//           {`Party Services in ${cityName} | Decoration, Catering, Photography & More | HORA`}
//         </title>

//         <meta
//           name="description"
//           content={`Book party decoration, catering, photography, chef at home, live catering, birthday decoration, anniversary decoration and event services in ${cityName}. Verified vendors, 1000+ designs & easy booking with HORA.`}
//         />

//         <meta
//           name="robots"
//           content="index,follow"
//         />

//         <link
//           rel="canonical"
//           href={`https://horaservices.com/${citySlug}`}
//         />

//         <meta
//           property="og:title"
//           content={`Party Services in ${cityName} | Decoration, Catering & More | HORA`}
//         />

//         <meta
//           property="og:description"
//           content={`Book decoration, catering, photography and chef services in ${cityName} for birthdays, anniversaries and special events.`}
//         />

//         <meta
//           property="og:url"
//           content={`https://horaservices.com/${citySlug}`}
//         />

//         <meta
//           property="og:type"
//           content="website"
//         />

//         <meta
//           property="og:image"
//           content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
//         />

//         <meta
//           name="twitter:card"
//           content="summary_large_image"
//         />

//         <meta
//           name="twitter:title"
//           content={`Party Services in ${cityName} | HORA`}
//         />

//         <meta
//           name="twitter:description"
//           content={`Book decoration, catering, photography and chef services in ${cityName}.`}
//         />
//       </Head>

//       <HomeContent />

//       <LocalitiesSection
//         key={citySlug}
//         title={`${cityName} Localities`}
//         localities={localities}
//         handleClick={localityHandleClick}
//       />
//     </>
//   );
// }


import { useRouter } from "next/router";
import Head from "next/head";

import cityData from "@/utils/cityData";
import {
  isValidCitySlug,
  getCityNameFromSlug,
} from "@/utils/validCities";

import LocalitiesSection from "@/components/LocalitiesSection";
import HomeContent from "@/components/HomeContent";

export async function getServerSideProps({ params }) {
  const citySlug = params?.city?.toLowerCase();

  // Invalid city => 404
  if (!isValidCitySlug(citySlug)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      citySlug,
      cityName: getCityNameFromSlug(citySlug),
    },
  };
}

export default function CityPage({ citySlug, cityName }) {
  const router = useRouter();

  const localities = cityData[citySlug]?.cityLocalitiesList || [];

  const localityHandleClick = (localityName) => {
    const formattedLocality = localityName
      .replace(/\s+/g, "-")
      .toLowerCase();

    router.push(`/${citySlug}/${formattedLocality}`);
  };

  return (
    <>
      <Head>
        <title>
          {`Party Services in ${cityName} | Decoration, Catering, Photography & More | HORA`}
        </title>

        <meta
          name="description"
          content={`Book party decoration, catering, photography, chef at home, live catering, birthday decoration, anniversary decoration and event services in ${cityName}. Verified vendors, 1000+ designs & easy booking with HORA.`}
        />

        <meta name="robots" content="index,follow" />

        <link
          rel="canonical"
          href={`https://horaservices.com/${citySlug}`}
        />

        <meta
          property="og:title"
          content={`Party Services in ${cityName} | Decoration, Catering & More | HORA`}
        />

        <meta
          property="og:description"
          content={`Book decoration, catering, photography and chef services in ${cityName} for birthdays, anniversaries and special events.`}
        />

        <meta
          property="og:url"
          content={`https://horaservices.com/${citySlug}`}
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content={`Party Services in ${cityName} | HORA`}
        />

        <meta
          name="twitter:description"
          content={`Book decoration, catering, photography and chef services in ${cityName}.`}
        />
      </Head>

      <HomeContent />

      <LocalitiesSection
        key={citySlug}
        title={`${cityName} Localities`}
        localities={localities}
        handleClick={localityHandleClick}
      />
    </>
  );
}