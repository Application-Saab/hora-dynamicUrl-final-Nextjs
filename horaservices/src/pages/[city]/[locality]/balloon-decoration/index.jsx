import SectionDescription from "@/components/Description";
import FAQSection from "@/components/FAQSection";
import LocalitiesSection from "@/components/LocalitiesSection";
import Decoration from "@/components/Decoration/Decoration";

import { decorationCityFAQData } from "@/utils/DecorationCityFAQ";
import { decorationCityDescription } from "@/utils/DecorationDescription";
import { DecorationSEOKeywords } from "@/utils/GetSEOKeywords";
import { decCat } from "@/utils/decorationCategories";

import { useRouter } from "next/router";

import { validateCityLocality } from "@/utils/validCities";

export async function getServerSideProps(context) {
  const citySlug = context.params?.city?.toLowerCase();
  const localitySlug = context.params?.locality?.toLowerCase();

  const validation = validateCityLocality(citySlug, localitySlug);

  if (!validation.valid) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      city: validation.cityName,
      citySlug: validation.citySlug,
      localitySlug: validation.localitySlug,
    },
  };
}

function formatLocalityName(slug) {
  if (!slug) return "";

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function DecorationLocalityPage({ city, citySlug, localitySlug }) {
  const router = useRouter();

  const locality = formatLocalityName(localitySlug);

  const cityDecorationFAQ = decorationCityFAQData(city);

  const cityDescription = decorationCityDescription(city);

  const decorationCategory = decCat.map((item) => ({
    name: `${item.name} in ${city}`,
    slug: item.slug || item.name.toLowerCase().replace(/\s+/g, "-"),
  }));

  const handleCategoryClick = (slug) => {
    router.push(`/${citySlug}/${localitySlug}/balloon-decoration/${slug}`);
  };

  return (
    <>
      <Decoration city={city} locality={locality} />

      <div className="tab-section-details-productpage">
        <FAQSection faqData={cityDecorationFAQ} />
      </div>

      <SectionDescription paragraphs={cityDescription} />

      <LocalitiesSection
        title={`Explore Other Decoration Category In ${city}`}
        localities={decorationCategory}
        city={city}
        handleClick={handleCategoryClick}
      />

      <div className="my-4 container">
        <DecorationSEOKeywords city={city} />
      </div>
    </>
  );
}

export default DecorationLocalityPage;
