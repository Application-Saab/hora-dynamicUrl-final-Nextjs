import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

import "./catvaluephoto.css";

import PhotoBanner from "@/assets/PhotoBanner.jpg";
import Engagement from "../../../assets/photographyCategories/Photography9.webp";
import Wedding from "../../../assets/photographyCategories/Photography10.webp";
import Anniversary from "../../../assets/photographyCategories/Photography5.webp";
import Birthday from "../../../assets/photographyCategories/birthdaybackground.webp";
import HouseWarming from "../../../assets/photographyCategories/Photography6.webp";
import NamingCeremony from "../../../assets/photographyCategories/Photography4.webp";
import BabyShower from "../../../assets/photographyCategories/Photography8.webp";
import Bachelorette from "../../../assets/photographyCategories/Photography7.webp";
import Maternity from "../../../assets/photographyCategories/Photography11.webp";
import NewBorn from "../../../assets/photographyCategories/Photography12.webp";
import PreWeddingImg from "@/assets/pre-wedding.webp";
import HaldiMahandiImg from "@/assets/haldi-mahandi.webp";
import Weddings from "@/assets/wedding.webp";

import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_PHOTOGRAPHY_BY_TAG,
} from "@/utils/apiconstants.js";
import { getPhotographyOrganizationSchema } from "@/utils/schema";
import { SeoCategory } from "@/utils/photoGraphyHead";
import { seoData } from "@/utils/photoCategories";
import axiosApi from "@/utils/axiosApi";

import EventDateBanner from "@/components/Eventdatebanner";
import PhotoPackageGrid from "@/components/PhotoPackageGrid";
import ChooseYourMoment from "@/components/Chooseyourmoment";
import DecorationBanner from "@/components/CategoryDecorationBanner";
import PhotographyCardSkeleton from "@/components/PhotographyCardSkeleton";
import PhotoGallery from "@/pages/photo-gallery";

// ---------- constants / helpers (same as before) ----------
const isWeddingCategory = (category) => {
  if (typeof category !== "string") return false;
  const val = category.trim();
  return /(^|-)wedding(-|$)/i.test(val) && !/(^|-)pre-wedding(-|$)/i.test(val);
};

const MOMENT_SLUG_TO_KEY = {
  "pre-wedding": "pre-wedding",
  "haldi-mehndi": "haldi-mahandi",
  wedding: "wedding",
};

const MOMENT_KEY_TO_SLUG = {
  "pre-wedding": "pre-wedding",
  "haldi-mahandi": "haldi-mehndi",
  wedding: "wedding",
};

const MOMENT_NAME_FILTERS = {
  "pre-wedding": (name) => /pre[\s-]?wedding/i.test(name),
  "haldi-mahandi": (name) => /haldi|mehandi|mehndi|mahandi|sangeet/i.test(name),
  wedding: (name) =>
    /wedding/i.test(name) && !/pre[\s-]?wedding/i.test(name),
};

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

export const categoryBannerMap = {
  "Engagement-Photography": Engagement,
  "Wedding-Photography": Wedding,
  "Anniversary-Photography": Anniversary,
  "Birthday-Photography": Birthday,
  "House-Warming-Photography": HouseWarming,
  "Naming-Ceremony-Photography": NamingCeremony,
  "Baby-Shower-Photography": BabyShower,
  "Bachelorette-Photography": Bachelorette,
  "Maternity-Photography": Maternity,
  "New-Born-Baby-Photography": NewBorn,
};

export const normalizeCatValue = (val) => {
  if (!val) return "";
  const exactMatch = Object.keys(categoryBannerMap).find(
    (key) => key.toLowerCase() === val.toLowerCase()
  );
  return exactMatch || val.toLowerCase().replace(/ /g, "-");
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
    folderName: "Candid",
    customerId: "63edb239d680d47d95870fa0",
  },
  "House-warming-Photography": {
    folderName: "House warming weblink",
    customerId: "64137625549b58e3dc39a685",
  },
  "Naming-ceremony-Photography": {
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

// ---------- SSR ----------
export async function getServerSideProps(context) {
  const { catValue, city, locality } = context.params || {};
  const query = context.query || {};

  const finalCatValue = catValue || query.catValue || null;
  const finalCity = city || query.city || null;
  const finalLocality = locality || query.locality || null;

  // Moment slug → Wedding-Photography
  const effectiveCatValue =
    typeof finalCatValue === "string" && MOMENT_SLUG_TO_KEY[finalCatValue]
      ? "Wedding-Photography"
      : finalCatValue;

  const initialActiveMoment =
    typeof finalCatValue === "string" && MOMENT_SLUG_TO_KEY[finalCatValue]
      ? MOMENT_SLUG_TO_KEY[finalCatValue]
      : null;

  let catId = null;
  let products = [];
  let error = "";

  if (effectiveCatValue) {
    try {
      // 1) Category ID
      const catRes = await axiosApi.get(
        `${BASE_URL}${GET_DECORATION_CAT_ID}${encodeURIComponent(effectiveCatValue)}`
      );
      catId = catRes.data?.data?._id || null;

      if (!catId) {
        error = "No category found";
      } else {
        // 2) Products
        const prodRes = await axiosApi.get(
          `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${catId}`
        );
        const data = prodRes.data?.data || [];

        products = data.map((item) => {
          const { discount, discountedPrice, discountDifference } =
            getDiscountedPrice(item.price || 0);
          return { ...item, discount, discountedPrice, discountDifference };
        });
      }
    } catch (err) {
      console.error("SSR category page error:", err.message);
      error = "Failed to fetch category / products";
      products = [];
    }
  }

  const galleryData = categoryToGallery[effectiveCatValue] || null;

  return {
    props: {
      initialCatValue: finalCatValue,
      effectiveCatValue: effectiveCatValue || null,
      city: finalCity,
      locality: finalLocality,
      initialCatId: catId,
      initialProducts: products,
      initialGalleryData: galleryData,
      initialActiveMoment,
      ssrError: error,
    },
  };
}

// ---------- Page ----------
export default function CatValuePage({
  initialCatValue,
  effectiveCatValue: ssrEffectiveCat,
  city: ssrCity,
  locality: ssrLocality,
  initialCatId,
  initialProducts,
  initialGalleryData,
  initialActiveMoment,
  ssrError,
}) {
  const router = useRouter();
  const { userId } = useSelector((state) => state.auth || {});

  // Prefer SSR props; fallback to router for client navigations
  const catValue = router.query.catValue || initialCatValue;
  const city = ssrCity || router.query.city || null;
  const locality = ssrLocality || router.query.locality || null;

  const effectiveCatValue =
    typeof catValue === "string" && MOMENT_SLUG_TO_KEY[catValue]
      ? "Wedding-Photography"
      : catValue || ssrEffectiveCat;

  const [catId, setCatId] = useState(initialCatId);
  const [products, setProducts] = useState(initialProducts || []);
  const [galleryData, setGalleryData] = useState(initialGalleryData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(ssrError || "");
  const [open, setOpen] = useState(false);
  const [activeMoment, setActiveMoment] = useState(initialActiveMoment);

  const schemaOrg = getPhotographyOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);

  const content = seoData?.[effectiveCatValue] || {};
  const title = content.h1 || effectiveCatValue?.replace(/-/g, " ");
  const intro = content.description || "";
  const words = intro.split(" ");
  const firstLine = words.slice(0, 8).join(" ");
  const restText = words.slice(8).join(" ");

  // Client-side only when user navigates to a different catValue
  // (SSR already hydrated current route)
  useEffect(() => {
    if (!router.isReady || !catValue) return;

    // Same as SSR payload → skip refetch
    if (catValue === initialCatValue && initialProducts?.length >= 0 && initialCatId) {
      setActiveMoment(
        MOMENT_SLUG_TO_KEY[catValue] ? MOMENT_SLUG_TO_KEY[catValue] : null
      );
      return;
    }

    const run = async () => {
      setLoading(true);
      setError("");

      const nextEffective =
        MOMENT_SLUG_TO_KEY[catValue] ? "Wedding-Photography" : catValue;

      setActiveMoment(
        MOMENT_SLUG_TO_KEY[catValue] ? MOMENT_SLUG_TO_KEY[catValue] : null
      );
      setGalleryData(categoryToGallery[nextEffective] || null);

      try {
        const catRes = await axiosApi.get(
          `${BASE_URL}${GET_DECORATION_CAT_ID}${encodeURIComponent(nextEffective)}`
        );
        const categoryId = catRes.data?.data?._id;
        if (!categoryId) {
          setError("No category found");
          setProducts([]);
          setCatId(null);
          return;
        }
        setCatId(categoryId);

        const prodRes = await axiosApi.get(
          `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${categoryId}`
        );
        const data = prodRes.data?.data || [];
        const withDiscount = data.map((item) => {
          const { discount, discountedPrice, discountDifference } =
            getDiscountedPrice(item.price || 0);
          return { ...item, discount, discountedPrice, discountDifference };
        });
        setProducts(withDiscount);
      } catch (err) {
        setProducts([]);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [router.isReady, catValue, initialCatValue, initialProducts, initialCatId]);

  const slugify = (text) =>
    text.replace(/[^a-zA-Z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleViewMore = (work) => {
    const slug = slugify(work.name);
    const categorySlug = slugify(effectiveCatValue || "photography");

    const pathParts = router.asPath.split("?")[0].split("/").filter(Boolean);
    const photoIndex = pathParts.findIndex((p) => p === "photography-page");

    const cityFromPath =
      photoIndex > 0 ? pathParts[0] : city || router.query.city || null;
    const localityFromPath =
      photoIndex > 1 ? pathParts[1] : locality || router.query.locality || null;

    let basePath = `/photography-page/${categorySlug}/product/${slug}`;

    if (cityFromPath && localityFromPath) {
      basePath = `/${cityFromPath.toLowerCase()}/${localityFromPath.toLowerCase()}${basePath}`;
    } else if (cityFromPath) {
      basePath = `/${cityFromPath.toLowerCase()}${basePath}`;
    }

    router.push({
      pathname: basePath,
      query: { id: work._id },
    });
  };

  const handleSelectMoment = (key) => {
    const slug = MOMENT_KEY_TO_SLUG[key] || "Wedding-Photography";
    const pathParts = router.asPath.split("?")[0].split("/").filter(Boolean);
    const photoIndex = pathParts.findIndex((p) => p === "photography-page");
    if (photoIndex === -1) return;

    pathParts[photoIndex + 1] = slug;
    router.push("/" + pathParts.join("/"));
  };

  const normalizedCat = normalizeCatValue(effectiveCatValue);
  const bannerToShow =
    categoryBannerMap[normalizedCat] || categoryBannerMap["default"];
  const showMomentPicker = isWeddingCategory(normalizedCat);

  const displayedProducts =
    showMomentPicker && activeMoment && MOMENT_NAME_FILTERS[activeMoment]
      ? products.filter((item) =>
          MOMENT_NAME_FILTERS[activeMoment](item.name || "")
        )
      : products;

  return (
    <div className="featured-photo-works">
      <SeoCategory
        city={city}
        locality={locality}
        catValue={effectiveCatValue}
        scriptTag={scriptTag}
        seoData={seoData}
      />

      {loading ? (
        <PhotographyCardSkeleton count={6} />
      ) : error && products.length === 0 ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          <div style={{ padding: "clamp(4px, 1.27vw, 5px)" }}>
            {showMomentPicker ? (
              <DecorationBanner
                category={normalizedCat}
                title="Choose Your Moment"
              />
            ) : (
              <section className="cc-banner">
                <Image
                  src={bannerToShow}
                  alt={title}
                  fill
                  className="cc-banner-img"
                  priority
                />
                <div className="cc-banner-overlay" />
                <h1
                  className="cc-banner-title"
                  style={{ color: content?.color || "#fff" }}
                >
                  {title}
                </h1>
              </section>
            )}

            {showMomentPicker ? (
              <ChooseYourMoment
                category={normalizedCat}
                activeMoment={activeMoment}
                onSelectMoment={handleSelectMoment}
                moments={[
                  {
                    key: "pre-wedding",
                    label: "Pre Wedding",
                    image: PreWeddingImg,
                    accent: "purple",
                  },
                  {
                    key: "haldi-mahandi",
                    label: "Haldi & Mahandi",
                    image: HaldiMahandiImg,
                    accent: "amber",
                  },
                  {
                    key: "wedding",
                    label: "Wedding",
                    image: Weddings,
                    accent: "rose",
                  },
                ]}
              />
            ) : null}

            <div className="cc-stats">
              <div className="cc-stat">
                <div className="cc-stat-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="cc-stat-info">
                  <h2>1000+</h2>
                  <p>Verified photographers</p>
                </div>
              </div>

              <div className="cc-stat">
                <div className="cc-stat-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </div>
                <div className="cc-stat-info">
                  <h2>Pan India</h2>
                  <p>coverage available</p>
                </div>
              </div>
            </div>

            <div className="cc-accordion">
              <button
                className={`cc-acc-btn ${open ? "open" : ""}`}
                onClick={() => setOpen(!open)}
              >
                <span className="cc-acc-preview">
                  {firstLine}
                  {!open && "…"}
                </span>
                <span className={`cc-acc-icon ${open ? "open" : ""}`}>
                  <svg viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
              <div className={`cc-acc-body ${open ? "open" : ""}`}>
                <p className="cc-acc-text">{restText}</p>
              </div>
            </div>
          </div>

          {/* User-specific — client only, no hydration issue */}
          <EventDateBanner userId={userId} />

          {displayedProducts.length > 0 ? (
            <PhotoPackageGrid
              data={displayedProducts}
              onCardClick={handleViewMore}
              categoryType="photography"
            />
          ) : showMomentPicker && activeMoment ? (
            <p className="cc-no-results">
              No packages found for this moment yet.
            </p>
          ) : (
            <div className="skeleton-wrapper">
              {Array.from({ length: 6 }).map((_, index) => (
                <PhotographyCardSkeleton key={index} />
              ))}
            </div>
          )}

          <div className="suggested-poses">
            <div className="suggested-poses-section">
              <Image
                src={PhotoBanner}
                alt="Camera Holding"
                className="suggested-image"
              />
            </div>
          </div>

          {galleryData?.folderName && galleryData?.customerId && (
            <div className="photo-gallery-wrapper">
              <PhotoGallery
                folderName={galleryData.folderName}
                customerId={galleryData.customerId}
                embedded={true}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}