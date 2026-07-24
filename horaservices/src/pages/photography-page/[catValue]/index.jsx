import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import "./catvaluephoto.css";
import PhotoBanner from "@/assets/PhotoBanner.jpg"
import ThumbnailGallery from "@/pages/photo-gallery/ThumbnailGallery";
import CardSkeleton from "@/components/CardSkeleton";
import Engagement from "@/assets/photographyCategories/photography9.webp";
import Wedding from "@/assets/photographyCategories/photography10.webp";
import Anniversary from "@/assets/photographyCategories/photography5.webp";
import Birthday from "@/assets/photographyCategories/birthdaybackground.webp";
import HouseWarming from "@/assets/photographyCategories/photography6.webp";
import NamingCeremony from "@/assets/photographyCategories/photography4.webp";
import BabyShower from "@/assets/photographyCategories/photography8.webp";
import Bachelorette from "@/assets/photographyCategories/photography7.webp";
import Maternity from "@/assets/photographyCategories/photography11.webp";
import NewBorn from "@/assets/photographyCategories/photography12.webp"; 
import { useSelector } from "react-redux";
import {
  BASE_URL,
  GET_DECORATION_CAT_ID,
  GET_PHOTOGRAPHY_BY_TAG,
} from "@/utils/apiconstants.js";
import ProductGrid from "@/components/productGrid";
import { getPhotographyOrganizationSchema } from "@/utils/schema";
import { SeoCategory } from "@/utils/photoGraphyHead";
import SkeletonGrid from "@/components/SkeletonGrid";
import { seoData } from "@/utils/photoCategories";
import axiosApi from "@/utils/axiosApi";
import EventDateBanner from "@/components/Eventdatebanner";


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

    // Check if exact match (case-sensitive) exists in the map
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

export default function CatValuePage() {
  const router = useRouter();
  const { catValue } = router.query;
  const { userId } = useSelector((state) => state.auth || {});

  const [catId, setCatId] = useState(null);
  const [products, setProducts] = useState([]);
  const [galleryData, setGalleryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const schemaOrg = getPhotographyOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  let { city } = router.query;
  let { locality } = router.query;
  const [open, setOpen] = useState(false);
  const content = seoData?.[catValue] || {};

const title = content.h1 || catValue?.replace(/-/g, " ");
const intro = content.description || "";
  const preview = intro?.slice(0, 60) + "...";
  const getSubCatId = useCallback(async (subCategory) => {
    try {
      const response = await axiosApi.get(
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
      const res = await axiosApi.get(`${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${categoryId}`);
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

  // router.query se nahi, asPath se parse karo
  const pathParts = router.asPath.split("?")[0].split("/").filter(Boolean);
  // e.g. ['delhi', 'dwarka', 'photography-page', 'Birthday-Photography']
  // e.g. ['delhi', 'photography-page', 'Birthday-Photography']
  // e.g. ['photography-page', 'Birthday-Photography']

  const photoIndex = pathParts.findIndex((p) => p === "photography-page");

  const city =
    photoIndex > 0 ? pathParts[0] : router.query.city || null;
  const locality =
    photoIndex > 1 ? pathParts[1] : router.query.locality || null;

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
 
  
 const normalizedCat = normalizeCatValue(catValue);
  const bannerToShow = categoryBannerMap[normalizedCat] || categoryBannerMap["default"];

const words = intro.split(' ');
const firstLine = words.slice(0, 8).join(' ');         // ~1 line
const restText = words.slice(8).join(' ');  
  return (
    <div className="featured-photo-works">
         <SeoCategory city={city} locality={locality} catValue={catValue} scriptTag={scriptTag} seoData={seoData} />
      {loading ? (
       
         <SkeletonGrid count={6} />
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
  
  <div style={{padding:"10px"}}>
               <section className="cc-banner" >
        <Image
          src={bannerToShow}
          alt={title}
          fill
          className="cc-banner-img"
          priority
        />
        <div className="cc-banner-overlay" />
        <h1 className="cc-banner-title"   style={{ color: content?.color || "#fff" }}>{title}</h1>
      </section>

      {/* Stats */}
     <div className="cc-stats">
        <div className="cc-stat">
          <div className="cc-stat-icon">
            <svg viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <div className="cc-stat-info">
            <h2>Pan India</h2>
            <p>coverage available</p>
          </div>
        </div>
      </div>

      {/* Accordion */}
      <div className="cc-accordion">
    <button className={`cc-acc-btn ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
    <span className="cc-acc-preview">
      {firstLine}{!open && '…'}
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
       <EventDateBanner userId={userId} />
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
            <div className="photo-gallery-wrapper" style={{padding:"10px"}}>
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
