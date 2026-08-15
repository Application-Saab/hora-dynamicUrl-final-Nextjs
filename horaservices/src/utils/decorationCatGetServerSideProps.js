import { fetchDecorationCatPageData } from "./fetchDecorationCatData";

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

  if (!catValue) {
    return { notFound: true };
  }

  const citySlug = rawCity ? rawCity.toLowerCase() : "";
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
