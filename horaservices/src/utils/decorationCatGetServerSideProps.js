import { fetchDecorationCatPageData } from "./fetchDecorationCatData";
import { isValidDecorationCategorySlug } from "./routeConfig";
import { isValidCitySlug, validateCityLocality } from "./validCities";
import {
  isCategoryInService,
  getCorrectServiceForCategory,
  getServiceFromPath,
} from "@/utils/decorationCategories";

function formatCityName(citySlug) {
  if (!citySlug) return "";
  const slug = citySlug.toLowerCase();
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export async function getDecorationCatServerSideProps(context, options = {}) {
  const { includeCity = false } = options;
  const { catValue } = context.params;
  const { theme, locality } = context.query;
  const rawCity = includeCity ? context.params.city : null;
  const citySlug = rawCity ? rawCity.toLowerCase() : "";
  const localitySlug = locality ? locality.toLowerCase() : "";

  if (includeCity && citySlug && !localitySlug) {
    if (!isValidCitySlug(citySlug)) {
      return { notFound: true };
    }
  }

  if (includeCity && citySlug && localitySlug) {
    const validation = validateCityLocality(citySlug, localitySlug);
    if (!validation.valid) {
      return { notFound: true };
    }
  }

  if (!catValue) {
    return { notFound: true };
  }

  if (!isValidDecorationCategorySlug(catValue)) {
    return { notFound: true };
  }

  const cleanTheme = theme && theme !== "all" ? theme : null;

  // Is route ki service: option > URL se detect > null (guard skip)
  const currentPath = String(context.resolvedUrl || context.req?.url || "");
  const service = options.service || getServiceFromPath(currentPath);

  // ✅ SERVICE GUARD
  if (service && !isCategoryInService(catValue, service)) {
    const correctService = getCorrectServiceForCategory(catValue);

    // Kisi bhi service mein nahi -> 404
    if (!correctService) {
      return { notFound: true };
    }

    const base =
      (citySlug ? `/${citySlug}` : "") +
      (localitySlug ? `/${localitySlug}` : "");
    const themePart = cleanTheme ? `/${cleanTheme}` : "";
    const destination = `${base}/${correctService}/${catValue}${themePart}`;

    // Redirect loop se bachao: destination wahi hai jahan abhi ho -> 404
    const currentPathname = currentPath.split("?")[0].replace(/\/$/, "").toLowerCase();
    if (destination.toLowerCase() === currentPathname) {
      return { notFound: true };
    }

    return {
      redirect: {
        destination,
        permanent: false, // pehle test karo, mapping final hone par true kar dena
      },
    };
  }

  const cityName = formatCityName(citySlug);

  const baseProps = {
    catValue,
    city: cityName,
    citySlug,
    locality: locality || null,
    // SSR-safe theme — router.query is empty during the server render
    theme: cleanTheme,
    initialCatalogueData: [],
    initialCatId: "",
    initialHasMore: false,
    // undefined props Next.js mein error dete hain, isliye sirf tab jab service pata ho
    ...(service ? { categorySlug: service } : {}),
  };

  try {
    const data = await fetchDecorationCatPageData(catValue, {
      theme: cleanTheme || undefined,
    });

    return {
      props: {
        ...baseProps,
        initialCatalogueData: data.catalogueData,
        initialCatId: data.catId || "",
        initialHasMore: data.hasMore,
      },
    };
  } catch {
    return { props: baseProps };
  }
}