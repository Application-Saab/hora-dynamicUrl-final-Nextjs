"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import axiosApi from "@/utils/axiosApi";
import ProductGrid from "@/components/productGrid";
import CardSkeleton from "@/components/CardSkeleton";
import SearchSortBar from "@/components/SearchSortBar";
import SeoHead from "@/utils/SeoHead";
import boosterBanner from "@/assets/celebrationboosters.webp"
import "./celebrationbooster.css";

// Ideally move this to utils/apiconstants.js alongside your other endpoints
// (BASE_URL, GET_DECORATION_CAT_ITEM, etc.) instead of hardcoding it here.
const CELEBRATION_BOOSTER_API =
  "https://horaservices.com/api/celebration-booster/celebrationBoostersList";

// Celebration booster images are served as raw uploads, not through the
// compressed-webp CDN (COMPRESSED_WEBP_IMG_URL) used by other categories.
const BOOSTER_IMAGE_BASE_URL = "https://horaservices.com/api/uploads/";

// Used to build the product-detail route — adjust to match your actual route
const CATEGORY_SLUG = "celebration-booster";

const CelebrationBoosterPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [catalogueData, setCatalogueData] = useState([]);
  const [defaultCatalogueData, setDefaultCatalogueData] = useState([]);

  const [sortOption, setSortOption] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const isSearchActive = !!searchQuery.trim();

  const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getRandomRating = () => (Math.random() * (4.8 - 4.1) + 4.1).toFixed(1);

  // Same tiered-discount logic used on the multi-category decoration page —
  // the booster API only returns a flat `price` field, no discount info.
  const getDiscountedPrice = (price) => {
    let discount;
    if (price < 3000) {
      discount = 20;
    } else if (price >= 3000 && price <= 5000) {
      discount = 27;
    } else {
      discount = 35;
    }
    const discountedPrice = price * (1 + discount / 100);
    const discountDifference = Math.abs(price - discountedPrice);
    return { discount, discountedPrice, discountDifference };
  };

  useEffect(() => {
    fetchBoosters();
  }, []);

  const fetchBoosters = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosApi.get(CELEBRATION_BOOSTER_API);

      if (response.data?.error) {
        throw new Error(
          response.data.message || "Failed to fetch celebration boosters"
        );
      }

      const decoratedData = (response.data?.data || []).map((item) => {
        const numericPrice = Number(item.price);
        const { discount, discountedPrice, discountDifference } =
          getDiscountedPrice(numericPrice);

        return {
          ...item,
          price: numericPrice,
          rating: getRandomRating(),
          userCount: getRandomNumber(20, 500),
          discountPercentage: discount,
          discountedPrice,
          discountDifference,
          // Full raw-upload URL — ProductGrid will detect this is already
          // an absolute URL and use it as-is (no webp/CDN transform).
          featured_image: item.featured_image
            ? `${BOOSTER_IMAGE_BASE_URL}${item.featured_image}`
            : null,
        };
      });

      setCatalogueData(decoratedData);
      setDefaultCatalogueData(decoratedData);
    } catch (err) {
      setError(err.message || "Something went wrong while fetching boosters");
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (id) => setSortOption(id);

  const handleSearchChange = (query) => {
    setSearchQuery(query?.trim() || "");
  };

  const handleViewDetails = (item) => {
    if (!item?.slug && !item?.name) return;

    const productSlug =
      item.slug || item.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/${CATEGORY_SLUG}/product/${productSlug}`);
  };

  // The booster API returns its full flat list in one shot — no server-side
  // pagination/sort/search params — so search + sort happen client-side here.
  const displayData = useMemo(() => {
    let data = [...catalogueData];

    if (isSearchActive) {
      const q = searchQuery.toLowerCase();
      data = data.filter((item) => item.name?.toLowerCase().includes(q));
    }

    switch (sortOption) {
      case "lowToHigh":
        data.sort((a, b) => a.price - b.price);
        break;
      case "highToLow":
        data.sort((a, b) => b.price - a.price);
        break;
      case "newArrival":
        data.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      default:
        break; // "popularity" — keep original API order
    }

    return data;
  }, [catalogueData, sortOption, searchQuery, isSearchActive]);

  return (
    <div className="celebrationBoosterPage">
      <SeoHead catValue={CATEGORY_SLUG} />
   <section className="celebrationBoosterBanner">
        <Image
          src={boosterBanner}
          alt="Celebration Boosters"
          width={1200}
          height={400}
          className="celebrationBoosterBanner-img"
          priority
        />
      </section>
      

      <SearchSortBar
        sortOption={sortOption}
        onSortChange={handleSortChange}
        searchCategoryList={[]}
        products={catalogueData}
        onProductSelect={handleViewDetails}
        onSearchChange={handleSearchChange}
      />

      {loading ? (
        <div className="skeleton-wrapper">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="boosterStateMsg boosterError">{error}</div>
      ) : displayData.length === 0 ? (
        <div className="noProductsWrapper">
          <h2>
            {isSearchActive
              ? "No boosters match your search"
              : "No celebration boosters available"}
          </h2>
        </div>
      ) : (
        <ProductGrid
          data={displayData}
          onCardClick={handleViewDetails}
          catValue={CATEGORY_SLUG}
        />
      )}

    
    </div>
  );
};

export default CelebrationBoosterPage;