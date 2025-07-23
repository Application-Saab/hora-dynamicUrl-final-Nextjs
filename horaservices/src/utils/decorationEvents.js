"use client";
import {useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setState } from "@/actions/action";
export const useDecorationEvents = (
  city,
  hasCityPageParam = false,
  decCat = [],
  locality = ""
) => {
    const [orderType, setOrderType] = useState(1);
  const router = useRouter();
  const dispatch = useDispatch();
  const formatPath = (path) => {
    let basePath = "";
    if (city) basePath += `/${city.toLowerCase()}`;
    if (locality) basePath += `/${locality.toLowerCase()}`;
    return `${basePath}${path}`;
  };

  const openCatItems = (item) => {
    if (!item?.catValue) return;
    const path = formatPath(`/balloon-decoration/${item.catValue}`);
    router.push(path);
  };

  const handleViewMore = (categoryTitle) => {
    const categoryItem = decCat.find(
      (cat) => cat.subCategory === categoryTitle || cat.name === categoryTitle
    );
    if (categoryItem) {
      const eventName = hasCityPageParam
        ? "title_and_viewmore_decoration_citypage_clicked"
        : "title_and_viewmore_decoration_page_clicked";

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        categoryName: categoryItem.name,
        subCategory: categoryItem.subCategory,
        catValue: categoryItem.catValue,
        imgAlt: categoryItem.imgAlt,
        city: city || "default",
        locality: locality || "default",
      });

      openCatItems(categoryItem);
    }
  };

  const handleSliderViewMore = (link, title) => {
    const normalizedLink = link.startsWith("/") ? link : `/${link}`;
    const path = formatPath(normalizedLink);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: hasCityPageParam
        ? "slider_view_all_citypage_clicked"
        : "slider_view_all_clicked",
      viewAllTitle: title,
      viewAllLink: path,
      city: city || "default",
      locality: locality || "default",
    });

    router.push(path);
  };

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
const handleViewDetails = (subCategory, catValue, product) => {
  const productName = product.name.replace(/ /g, "-");

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
    imgAlt: product.imgAlt || "",
  });

  const path = hasCityPageParam
    ? `/${city}/balloon-decoration/${catValue}/product/${productName}`
    : `/balloon-decoration/${catValue}/product/${productName}`;

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
