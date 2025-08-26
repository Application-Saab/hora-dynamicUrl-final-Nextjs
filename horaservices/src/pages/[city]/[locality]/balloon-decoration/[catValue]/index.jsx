import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getDecorationCatOrganizationSchema } from "../../../../../utils/schema";
import "../../../../../css/decoration.css";
import DecorationCatPage from "@/pages/balloon-decoration/[catValue]";
// import DecorationCatPage from "@/components/DecorationCatPage"; // Move component from pages to components if needed

const DecorationLocalityCatPage = () => {
  const router = useRouter();
  const { city, catValue, locality } = router.query;

  const schemaOrg = getDecorationCatOrganizationSchema(catValue);
  const scriptTag = JSON.stringify(schemaOrg);

  const pageTitle = useMemo(() => {
    switch (catValue) {
      case "kids-birthday-decoration":
        return "Kids' Birthday Balloon Decoration by Professionals Decorators, Starting at ₹1199";
      case "birthday-decoration":
        return "Birthday Balloon Decoration at Home by Professionals Decorators, Starting at ₹1199";
      case "anniversary-decoration":
        return "Anniversary Decorations with Balloon & Rose Petals, Starting at ₹1199";
      case "first-night-decoration":
        return "First Night Decorations with Balloon & Rose Petals, Starting at ₹1199";
      case "baby-shower-decoration":
        return "Baby Shower with Latest Designs by Professionals Decorators Starting at ₹1199";
      case "welcome-baby-decoration":
        return "Baby Welcome Decoration at home by Professionals Decorators, Starting at ₹1199";
      case "haldi-mehendi-decoration":
        return "Haldi Decoration with Latest Designs starting at ₹3000";
      default:
        return "Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199";
    }
  }, [catValue]);

  const metaDescription = useMemo(() => {
    switch (catValue) {
      case "kids-birthday-decoration":
        return "At Hora, 🎉 Explore popular themes like jungle 🌴, Cocomelon 🍉, candy 🍭, unicorn 🦄 and many more!";
      case "birthday-decoration":
        return "At Hora, 🎈 Explore our wide range of balloon and flower decorations for birthday parties.";
      case "anniversary-decoration":
        return "🎉 Explore top-notch anniversary decoration designs and book directly from our website 💖.";
      case "first-night-decoration":
        return "🌟 Explore our selection of elegant decoration designs for your first night event 💖.";
      case "haldi-mehendi-decoration":
        return "Brighten up your Haldi ceremony with vibrant and elegant décor! 🌼✨ Explore our curated styles.";
      default:
        return "Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199";
    }
  }, [catValue]);

  return (
    <div className="decCatPage" style={{ backgroundColor: "#EDEDED" }}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="Balloon and Flower Decoration @999" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
        />
        <meta
          property="og:url"
          content={`https://horaservices.com/${city}/${locality}/balloon-decoration/${catValue}`}
        />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link
          rel="icon"
          href="https://horaservices.com/api/uploads/logo-icon.png"
          type="image/x-icon"
        />
        {schemaOrg && (
          <script type="application/ld+json">{scriptTag}</script>
        )}
      </Head>

      <DecorationCatPage />
    </div>
  );
};

export default DecorationLocalityCatPage;
