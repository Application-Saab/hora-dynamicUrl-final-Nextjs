
"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { setState } from "@/actions/action";
import { getCategorySlugFromPath } from "@/utils/getCategorySlugFromPath";

export const useDecorationEvents = (
  city,
  hasCityPageParam = false,
  decCat = [],
  locality = ""
) => {
  const [orderType] = useState(1);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  // 🔹 city + locality path builder
  const formatPath = (path) => {
    let basePath = "";
    if (city) basePath += `/${city.toLowerCase()}`;
    if (locality) basePath += `/${locality.toLowerCase()}`;
    return `${basePath}${path}`;
  };
const toSlug = (text = "") =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

  // 🔹 dynamic category slug (balloon-decoration / balloon-decoration-instagram / etc.)
  const getCategorySlug = () =>
    getCategorySlugFromPath(pathname, city, locality);

  // ================= CATEGORY CLICK =================
  const openCatItems = (item) => {
    if (!item?.catValue) return;

    const categorySlug = getCategorySlug();
    const path = formatPath(`/${categorySlug}/${item.catValue}`);
    router.push(path);
  };

  // ================= TITLE VIEW MORE =================
  const handleViewMore = (categoryTitle) => {
    const categoryItem = decCat.find(
      (cat) => cat.subCategory === categoryTitle || cat.name === categoryTitle
    );

    if (!categoryItem) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: hasCityPageParam
        ? "title_and_viewmore_decoration_citypage_clicked"
        : "title_and_viewmore_decoration_page_clicked",
      categoryName: categoryItem.name,
      subCategory: categoryItem.subCategory,
      catValue: categoryItem.catValue,
      city: city || "default",
      locality: locality || "default",
    });

    openCatItems(categoryItem);
  };

  // ================= SLIDER VIEW ALL =================
  
const handleSliderViewMore = (title) => {
  const categoryItem = decCat.find(
    (cat) => cat.subCategory === title || cat.name === title
  );

  if (!categoryItem) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: hasCityPageParam
      ? "slider_view_all_citypage_clicked"
      : "slider_view_all_clicked",
    viewAllTitle: title,
    catValue: categoryItem.catValue,
    city: city || "default",
    locality: locality || "default",
  });

  openCatItems(categoryItem); // ✅ SAME slug logic
};



  // ================= ITEM CLICK =================
// const handleItemClick = (item) => {
//   if (!item?.slug || !item?.catValue) {
//     console.warn("Missing slug or catValue", item);
//     return;
//   }

//   const categorySlug = getCategorySlug(); 
//   // balloon-decoration / balloon-decoration-instagram

//   const subCategorySlug = item.catValue; 
//   // anniversary-decoration / birthday-decoration / premium-decoration

//   // 🔹 Analytics
//   window.dataLayer = window.dataLayer || [];
//   window.dataLayer.push({
//     event: "decoration_item_clicked",
//     event_category: "SliderSection",
//     event_label: item.title,
//     subCategory: subCategorySlug,
//     productSlug: item.slug,
//     city: city || "default",
//     locality: locality || "default",
//     price: item.price || "unknown",
//   });

//   // 🔹 Navigation
//   const path = formatPath(
//     `/${categorySlug}/${subCategorySlug}/product/${item.slug}`
//   );

//   router.push(path);
// };

const handleItemClick = (item) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "decoration_item_clicked",
      event_category: "SliderSection",
      event_label: item.title,
      categoryName: item.categoryName || item.title,
      subCategory: item.subCategory || "unknown",
      catValue: item.catValue || "unknown",
      imgAlt: item.imgAlt || "",
      city: city || "default",
      locality: locality || "default",
    });

    if (item?.link) {
      const path = formatPath(item.link);
      router.push(path);
    } else if (item?.catValue) {
      openCatItems(item);
    }
  };


  // ================= PRODUCT VIEW DETAILS =================
  const handleViewDetails = (subCategory, catValue, product) => {
    const productName = product.name.replace(/ /g, "-");
    const categorySlug = getCategorySlug();

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: hasCityPageParam
        ? "product_view_details_citypage_clicked"
        : "product_view_details_clicked",
      event_category: "ProductCard",
      event_label: productName,
      productName: product.name,
      subCategory,
      catValue,
      city: city || "default",
      locality: locality || "default",
      price: product.price || "unknown",
    });

    const path = formatPath(
      `/${categorySlug}/${catValue}/product/${productName}`
    );

    dispatch(setState(subCategory, orderType, catValue, product));
    router.push(path);
  };

  return {
    openCatItems,
    handleViewMore,
    handleSliderViewMore,
    handleItemClick,
    handleViewDetails,
  };
};
