import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import "./catvaluephoto.css";
import PhotoBanner from "@/assets/PhotoBanner.jpg"
import ThumbnailGallery from "@/pages/photo-gallery/ThumbnailGallery";
import CardSkeleton from "@/components/CardSkeleton";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_PHOTOGRAPHY_BY_NAME,
} from "@/utils/apiconstants.js";
import ProductGrid from "@/components/productGrid";
import Head from "next/head";
import { getPhotographyOrganizationSchema } from "@/utils/schema";



const getDiscountedPrice = (price = 0) => {
  const discountedPrice = price / 0.78; 
  const discountDifference = discountedPrice - price; 
  const discount = ((discountDifference / discountedPrice) * 100).toFixed(0); 
  return {
    discount: Number(discount),            
    discountedPrice: Math.round(discountedPrice), 
    discountDifference: Math.round(discountDifference), 
  };
};




const categoryToGallery = {
  "Engagement-Photography": {
    folderName: "engagement weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Wedding-Photography": {
    folderName: "Wedding",
    customerId: "6683e5d43e33c54c0ebde8f2",
  },
  "Anniversary-Photography": {
    folderName: "anniversary poses web link",
    customerId: "64137625549b58e3dc39a685",
  },
  "Birthday-Photography": {
    folderName: "birthday poses",
    customerId: "6683e5d43e33c54c0ebde8f2",
  },
  "House-Warming-Photography": {
    folderName: "House warming weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Naming-Ceremony-Photography": {
    folderName: "naming ceremony weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Baby-Shower-Photography": {
    folderName: "baby shower weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Bachelorette-Photography": {
    folderName: "bacherrolerate",
    customerId: "64137625549b58e3dc39a685",
  },
  "Maternity-Photography": {
    folderName: "maternity poses",
    customerId: "6683e5d43e33c54c0ebde8f2",
  },
  "New-Born-Baby-Photography": {
    folderName: "new born ",
    customerId: "64137625549b58e3dc39a685",
  },
};

export default function CatValuePage() {
  const router = useRouter();
  const { catValue } = router.query;

  const [catId, setCatId] = useState(null);
  const [products, setProducts] = useState([]);
  const [galleryData, setGalleryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const schemaOrg = getPhotographyOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  let { city } = router.query;
  let { locality } = router.query;
  const getSubCatId = useCallback(async (subCategory) => {
    try {
      const response = await axios.get(
        `${BASE_URL}${GET_DECORATION_CAT_ID}${encodeURIComponent(subCategory)}`
      );
      const categoryId = response.data?.data?._id;
      if (categoryId) {
        setCatId(categoryId);
      } else {
        setError("No category found");
      }
    } catch (err) {
      setError("Failed to fetch category");
    }
  }, []);

  useEffect(() => {
    if (catValue) {
      getSubCatId(catValue);
      const gallery = categoryToGallery[catValue] || null;
      setGalleryData(gallery);
    }
  }, [catValue, getSubCatId]);

  const fetchProducts = useCallback(async (categoryId) => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}${GET_PHOTOGRAPHY_BY_NAME}${categoryId}`);
      const data = res.data?.data || [];

      const productsWithDiscount = data.map((item) => {
        const { discount, discountedPrice, discountDifference } = getDiscountedPrice(item.price || 0);
        return { ...item, discount, discountedPrice, discountDifference };
      });

      setProducts(productsWithDiscount);
    } catch (err) {
      setProducts([]);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (catId) fetchProducts(catId);
  }, [catId, fetchProducts]);

  const slugify = (text) =>
    text.replace(/[^a-zA-Z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleViewMore = (work) => {
    const slug = slugify(work.name);
    const categorySlug = slugify(catValue || "photography");
    const city = router.query.city;
    const locality = router.query.locality;

    let basePath = `/photography-page/${categorySlug}/product/${slug}`;

    if (city && locality) {
      basePath = `/${city.toLowerCase()}/${locality.toLowerCase()}${basePath}`;
    } else if (city) {
      basePath = `/${city.toLowerCase()}${basePath}`;
    }

    router.push({
      pathname: basePath,
      query: { id: work._id },
    });
  };


  return (
    <div className="featured-photo-works">
      <Head>
        <title>
          {city

            ? `HORA Photography ${city} ${catValue} by Professionals Photographer, Starting at ₹3500`
            : `HORA Photography ${catValue} by Professionals Photographer, Starting at ₹3500`}
        </title>
        <meta
          name="description"
          content={
            city
              ? `  📸 Capture Every Moment, Forever! ✨
Welcome to HORA ${city} ${catValue}— where every click tells your story! 😊 Whether it's a dreamy wedding, a cute baby welcome, or a rocking birthday bash 🎉, our professional photographers are here to make your moments look as magical as they felt. Specialized packages for:
Weddings Photoshoot👰‍♀️; 
Maternity photoshoot;
Baby Shoots 🤰👼; 
Birthdays photoshoot; 
Newborn photography;
Couples photography
Anniversaries photographer 🎂❤️; 
Newborn photography
Housewarming & Corporate Events; 
Pre wedding photoshoot & Couple Photographer; 
Freelancer Photographer; Photographer near me,`
              : `   📸 Capture Every Moment, Forever! ✨
Welcome to HORA ${catValue}— where every click tells your story! 😊 Whether it's a dreamy wedding, a cute baby welcome, or a rocking birthday bash 🎉, our professional photographers are here to make your moments look as magical as they felt. Specialized packages for:
Weddings Photoshoot👰‍♀️; 
Maternity photoshoot;
Baby Shoots 🤰👼; 
Birthdays photoshoot; 
Newborn photography;
Couples photography
Anniversaries photographer 🎂❤️; 
Newborn photography
Housewarming & Corporate Events; 
Pre wedding photoshoot & Couple Photographer; 
Freelancer Photographer; Photographer near me, `

          }
        />
        <meta
          name="keywords"
          content="couple photoshoot, romantic photoshoot for couples, pre wedding photoshoot, pre wedding photography, couple pre wedding photography, candid pre wedding shoot, pre bridal photography, pre wedding shoot price, pre wedding shoot in bangalore, 
    couples photography, maternity photoshoot, maternity photoshoot near me, maternity photo sessions, maternity photoshoot in bangalore, maternity couple photoshoot, mother to be photoshoot, maternity shoot near me, pregnancy photoshoot near me, 
    pregnancy photo shoot, photography in pregnancy, pregnant women photoshoot, motherhood photoshoot, pregnant ladies photoshoot, couple pregnancy photoshoot, seemantham photoshoot, pregnancy photoshoot in bangalore, newborn photography, infant photography,
     baby photography near me, newborn photography near me, newborn photoshoot, infant photographers near me, newborn portraits near me, newborn family photoshoot, family photography with newborn, cake smash photoshoot, first birthday cake smash photoshoot, 
     engagement photo shoot, engagement photoshoot, engagement couple photography, engagement photography, wedding photographer, wedding photographer near me, wedding photoshoot, photographer wedding, candid wedding photography, marriage photoshoot, post wedding photoshoot, 
     bridal photoshoot, traditional photography, wedding photographers in bangalore, marriage photographers in bangalore, birthday photoshoot, first birthday photoshoot, pre birthday photoshoot, birthday celebration photoshoot, birthday photo session, 18th photoshoot, 
     birthday party photographer, event photography, photoshoot for wedding anniversary, anniversary photoshoot, candid photography, cinematic photography, fashion photography, model photography, black and white photography, landscape photography, portrait photography, 
     photographers near me, professional photographer near me, professional photographer, freelance photographer, best photographers near me, photoshoot near me, photographer in bangalore, photography in bangalore, bangalore photoshoot, photography services"
        />
        <meta property="og:title" content="HORA Photography : Professional photography for all events" />
        <meta
          property="og:description"
          content="Professional event photography for weddings, birthdays, baby showers, and more. Book today for stunning, affordable memories — starting at just ₹3500!"
        />
        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
        <meta property="og:url" content="https://horaservices.com/photography" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
        <script type="application/ld+json">{scriptTag}</script>
      </Head>
      {loading ? (
        <div className="skeleton-wrapper">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          <p className="PhotoHeading">{catValue}</p>

          {products.length > 0 ? (
            <ProductGrid
              data={products}
              onCardClick={handleViewMore}
              categoryType="photography"
            />
          ) : (
            <div className="skeleton-wrapper">
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Suggested Banner */}
          <div className="suggested-poses">
            <div className="suggested-poses-section">
              <Image
                src={PhotoBanner}
                alt="Camera Holding"
                className="suggested-image"
              />
            </div>
          </div>

          {/* Gallery Section */}
          {galleryData && galleryData.folderName && galleryData.customerId && (
            <div className="photo-gallery-wrapper">
              <ThumbnailGallery
                folderName={galleryData.folderName}
                customerId={galleryData.customerId}
                disablePopup={true}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
