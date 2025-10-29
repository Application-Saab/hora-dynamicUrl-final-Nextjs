


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

const getDiscountedPrice = (price = 0) => {
  // price here is AFTER discount
  const discountedPrice = price / 0.78; // get original (before discount)
  const discountDifference = discountedPrice - price; // how much is off
  const discount = ((discountDifference / discountedPrice) * 100).toFixed(0); // 22%
  return {
    discount: Number(discount),              // 22
    discountedPrice: Math.round(discountedPrice), // original price (before discount)
    discountDifference: Math.round(discountDifference), // amount off
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
      console.error("Error fetching category ID:", err.message);
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
      console.error("Error fetching products:", err.message);
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

    router.push({
      pathname: `/photography-page/${categorySlug}/product/${slug}`,
      query: { id: work._id },
    });
  };


return (
  <div className="featured-photo-works">
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
