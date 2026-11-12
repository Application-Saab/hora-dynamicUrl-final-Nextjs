import Head from "next/head";
import DecorationCatPage from "@/components/Decoration/DecorationCatPage";
import SectionDescription from "@/components/Description";
import FAQSection from "@/components/FAQSection";
import { getDecorationCatServerSideProps } from "@/utils/decorationCatGetServerSideProps";
import { getCategoryContent } from "@/utils/Decorationcategorycontent";
import {
  getThemeIntro,
  getThemeFaqs,
  getThemeFaqSchema,
  getThemeLabel,
  getThemeLinks,
} from "@/utils/themePageContent";
import ThemeLinks from "@/components/Decoration/ThemeLinks";

export async function getServerSideProps(context) {
  return getDecorationCatServerSideProps(context);
}

/**
 * Non-city theme page, e.g. /balloon-decoration/kids-birthday-decoration/mermaid.
 *
 * Same shape as the sibling /balloon-decoration/[catValue] page, with two
 * additions: the description and FAQ sections were missing here entirely, and
 * the theme-specific intro and FAQs below are what keep this page distinct
 * from the category page it sits under.
 */
export default function ThemePage({
  catValue,
  city,
  locality,
  theme = null,
  initialCatalogueData,
  initialCatId,
  initialHasMore,
}) {
  const categoryContent = getCategoryContent(catValue);

  // Theme copy — empty when the route somehow resolves without a theme.
  const themeIntro = getThemeIntro(theme, catValue, city);
  const themeFaqs = getThemeFaqs(theme, catValue, city);
  const themeLabel = theme ? getThemeLabel(theme) : "";
  const themeFaqSchema = getThemeFaqSchema(themeFaqs);

  // Category FAQs, same source the sibling [catValue] page uses. Guarded
  // because not every entry in AllCategoryDescriptions defines faqData.
  const categoryFaqs =
    typeof categoryContent?.faqData === "function"
      ? categoryContent.faqData()
      : [];

  const faqData = [...themeFaqs, ...categoryFaqs];

  // Descriptive links to the sibling theme pages, self excluded.
  const themeLinks = getThemeLinks({
    catValue,
    city: null,
    citySlug: null,
    currentTheme: theme,
  });

  return (
    <>
      {themeFaqSchema && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(themeFaqSchema) }}
          />
        </Head>
      )}

      <DecorationCatPage
        catValue={catValue}
        city={city}
        locality={locality}
        serverTheme={theme}
        initialCatalogueData={initialCatalogueData}
        initialCatId={initialCatId}
        initialHasMore={initialHasMore}
      />

      {(categoryContent || themeIntro) && (
        <SectionDescription
          title={themeLabel ? `About ${themeLabel} Decoration` : "Description"}
          intro={themeIntro}
          sections={categoryContent ? categoryContent.description : []}
        />
      )}

      <ThemeLinks links={themeLinks} heading="Other Themes" />

      {faqData.length > 0 && (
        <div className="tab-section-details-productpage">
          <FAQSection faqData={faqData} />
        </div>
      )}
    </>
  );
}
