import SectionDescription from "@/components/Description";
import FAQAccordion from "@/components/FAQs";
import LocalitiesSection from "@/components/LocalitiesSection";
import Decoration from "@/components/Decoration/Decoration";
import { decorationCityFAQData } from "@/utils//DecorationCityFAQ";
import { decorationCityDescription } from "@/utils//DecorationDescription";
import { DecorationSEOKeywords } from "@/utils/GetSEOKeywords";
import { useRouter } from "next/router";
import { decCat } from "@/utils/decorationCategories";
import FAQSection from "@/components/FAQSection";

function DecorationLocalityPage() {
  const router = useRouter();
  let { city, locality, catValue } = router.query;
  if (city) {
    city = city.charAt(0).toUpperCase() + city.slice(1);
  }
  if (catValue) {
    catValue = catValue.toLowerCase();
  }
  const cityDecorationFAQ = decorationCityFAQData(city);
  const cityDescription = decorationCityDescription(city);
  const decorationCategory = decCat.map((item) => ({
    name: `${item.name} in ${city}`,
    slug: item.slug || item.name.toLowerCase().replace(/\s+/g, "-"),
  }));

  const handleCategoryClick = (slug) => {
    router.push(`/${city.toLowerCase()}/balloon-decoration/${slug}`);
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