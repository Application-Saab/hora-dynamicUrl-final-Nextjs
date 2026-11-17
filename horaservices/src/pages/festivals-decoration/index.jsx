import { useState, useMemo } from "react";
import Head from "next/head";
import { getPageTitleCategory, getPageMetaDescriptionCategory } from "@/utils/Decorationcatseo";
import { festivalsDecorationFAQData } from "@/utils/FestivalsDecorationFAQData";
import { festivalsDecorationDescription } from "@/utils/Festivalsdecorationdescription";
import { decorateCatalogueItem, getSubCategory } from "@/utils/decorationCatHelpers";
import FAQSection from "@/components/FAQSection";
import SectionDescription from "@/components/Description";
import SmallCardGrid from "@/components/SmallCardGrid";
import { festivalCat } from "@/utils/FestivalCat";

const SITE = "https://horaservices.com";
const CAT = "festivals-decoration";
const API = `${SITE}/api`;

// har card ko categorySlug do, taaki link bane: /festivals-decoration/ganpati-decoration
const FESTIVAL_CARDS = festivalCat.map((c) => ({ ...c, categorySlug: CAT }));

export async function getServerSideProps() {
  try {
  
    // TODO: yahan wahi endpoint lagao jo baaki category pages me products laata hai.
    // subCategory = "Festivals" (getSubCategory(CAT) se aata hai)
    const res = await fetch(`${API}/catalogue?subCategory=${getSubCategory(CAT)}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.items || [];

    // rating / discount server par hi bante hain, isliye hydration mismatch nahi hoga
    const products = list.map(decorateCatalogueItem).map((item) => ({
      id: String(item._id || item.id),
      slug: item.slug || String(item._id || item.id), // TODO: apna product url field
      name: item.name || item.title,                  // TODO: apna name field
      image: item.image,                              // TODO: apna image field
      badge: item.badge || "",                        // e.g. "On Square Stand"
      price: item.price,
      mrp: Math.round(item.discountedPrice),          // cut price (jo upar dikhta hai)
      customizable: true,
    }));

    return { props: { products } };
  } catch (e) {
    return { props: { products: [] } };
  }
}

export default function FestivalsDecorationPage({ products }) {
  const title = getPageTitleCategory(CAT);
  const description = getPageMetaDescriptionCategory(CAT);
  const canonical = `${SITE}/${CAT}`;
  const faqs = festivalsDecorationFAQData();

  const [query, setQuery] = useState(""); // apne search bar se setQuery(...) call karo

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link
          rel="icon"
          href="https://horaservices.com/api/uploads/logo-icon.png"
          type="image/x-icon"
        />
      </Head>

      {/* Yahan aapka existing search bar / sort aayega */}

      <SmallCardGrid
        categories={FESTIVAL_CARDS}
        decCat={FESTIVAL_CARDS}
        firstRowCount={Math.ceil(FESTIVAL_CARDS.length / 2)}
      />

      <SectionDescription sections={festivalsDecorationDescription} />

      <div className="tab-section-details-productpage">
        <FAQSection faqData={faqs} />
      </div>
    </>
  );
}