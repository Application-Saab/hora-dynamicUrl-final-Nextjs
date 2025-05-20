import { getDecorationCatOrganizationSchema } from "@/utils/schema";
import Head from "next/head"

export const CategorySeoHead=(catValue)=>{
    const schemaOrg = getDecorationCatOrganizationSchema(catValue);
    const scriptTag = JSON.stringify(schemaOrg);
  
    const getPageMetaDescription = (catValue) => {
        if (catValue === "kids-birthday-decoration") {
          return "At Hora, 🎉Explore popular themes like jungle 🌴, Cocomelon 🍉, candy 🍭, unicorn 🦄, dinosaur 🦖, superhero 🦸‍♂️, princess 👑, space 🚀, pirate 🏴‍☠, under the sea 🌊, Baby Boss 👔, Barbie 💖, and cars 🚗. Explore detailed pricing and inclusions, and let our professional team bring your chosen design to life. Book your perfect party decor today! 🎈✨"
        }
        else if (catValue === "birthday-decoration") {
          return "At Hora, 🎈 Explore our wide range of balloon and flower decorations for birthday parties, featuring ring, sequin, wall, and room designs. Discover pricing and inclusions for every balloon color and variety. Customise your celebration and make it unforgettable with our stunning decor. Book your perfect party setup today! 🎉🌟";
        }
        else if (catValue === "anniversary-decoration") {
          return "🎉 Explore top-notch anniversary decoration designs and book directly from our website 💖. Find elegant and customizable decor options for your special event. Browse our selection to choose the perfect theme and make your anniversary memorable with seamless online booking. ✨"
        }
        else if (catValue === "first-night-decoration") {
          return "🌟 Explore our selection of elegant decoration designs for your first night event 💖. Choose from a variety of styles and themes, and book your perfect decor directly through our website. Make your special night unforgettable with seamless online booking and beautiful, personalised decorations. ✨"
        }
        else if (catValue === "haldi-mehendi-decoration") {
          return "Brighten up your Haldi ceremony with vibrant and elegant décor! 🌼✨ Explore our stunning Haldi decoration setups, featuring traditional elements, colorful floral arrangements, and custom designs to make your event unforgettable. 🌸💛"
        }
        else {
          return ("Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199")
        }
      }
      const PageTitle = (catValue) => {
        if (catValue === "kids-birthday-decoration") {
          return "Kids' Birthday Balloon Decoration by Professionals Decorators, Starting at ₹1199"
        }
        else if (catValue === "birthday-decoration") {
          return "Birthday Balloon Decoration at Home by Professionals  Decorators, Starting at ₹1199";
        }
        else if (catValue === "anniversary-decoration") {
          return "Anniversary Decorations with Balloon & Rose Petals, Starting at ₹1199"
        }
        else if (catValue === "first-night-decoration") {
          return "First Night Decorations with Balloon & Rose Petals, Starting at ₹1199"
        }
        else if (catValue === "baby-shower-decoration") {
          return "Baby Shower with Latest Designs by Professionals  Decorators Starting at ₹1199"
        }
        else if (catValue === "welcome-baby-decoration") {
          return "Baby Welcome Decoration at home by Professionals  Decorators, Starting at ₹1199"
        }
        else if (catValue === "haldi-mehendi-decoration") {
          return "Haldi Decoration with Latest Designs starting at ₹3000"
        }
        else {
          return ("Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199")
        }
      }
    return (
        <Head>
        <title>{PageTitle(catValue)}</title>
        <meta name="description" content={getPageMetaDescription(catValue)} />
        <meta name="keywords" content="Balloon and Flower Decoration @999" />
        <meta property="og:title" content={PageTitle(catValue)} />
        <meta property="og:description" content={getPageMetaDescription(catValue)} />
        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
        <script type="application/ld+json">{scriptTag}</script>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
        <meta property="og:url" content={`https://horaservices.com/balloon-decoration/${catValue}`} />
        <meta property="og:type" content="website" />
      </Head>
    )
}