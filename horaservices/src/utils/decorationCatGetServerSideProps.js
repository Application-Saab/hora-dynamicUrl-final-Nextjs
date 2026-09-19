import { fetchDecorationCatPageData } from "./fetchDecorationCatData";
import { isValidDecorationCategorySlug } from "./routeConfig";
import { isValidCitySlug, validateCityLocality } from "./validCities";

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
      return {
        notFound: true,
      };
    }
  }

  if (includeCity && citySlug && localitySlug) {
    const validation = validateCityLocality(citySlug, localitySlug);
    if (!validation.valid) {
      return {
        notFound: true,
      };
    }
  }

  if (!isValidDecorationCategorySlug(catValue)) {
    return {
      notFound: true,
    };
  }

  if (!catValue) {
    return { notFound: true };
  }

  const cityName = formatCityName(citySlug);

  const baseProps = {
    catValue,
    city: cityName,
    citySlug,
    locality: locality || null,
    initialCatalogueData: [],
    initialCatId: "",
    initialHasMore: false,
  };

  try {
    const data = await fetchDecorationCatPageData(catValue, {
      theme: theme && theme !== "all" ? theme : undefined,
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
