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
import { SeoCategory } from "@/utils/photoGraphyHead";



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
         <SeoCategory city={city} catValue={catValue} scriptTag={scriptTag} />
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
