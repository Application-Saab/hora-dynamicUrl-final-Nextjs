"use client";
import { useRouter } from "next/navigation";

export const useDecorationEvents = (city, hasCityPageParam, decCat) => {
  const router = useRouter();

  const openCatItems = (item) => {
    console.log("Opening Category Items:", item);
    console.log(item.catValue, "catValue2");
    if (hasCityPageParam) {
      router.push(`/${city}/balloon-decoration/${item.catValue}`);
    } else {
      router.push(`/balloon-decoration/${item.catValue}`);
    }
  };

  
const handleViewMore = (category) => {
  const categoryItem = decCat.find((cat) => cat.subCategory === category);

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
    });

    openCatItems(categoryItem);
  } else {
    console.log("No matching category item found.");
  }
};


const handleSliderViewMore = (link, title) => {
  const normalizedLink = link.startsWith("/") ? link : `/${link}`;
  const normalizedCity = city?.toLowerCase();
  const isCityPage = hasCityPageParam && normalizedCity;

  const path = isCityPage
    ? `/${normalizedCity}${normalizedLink}` // ✅ /delhi/balloon-decoration/...
    : normalizedLink;                      // ✅ /balloon-decoration/...

  // ✅ GTM Tracking
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: isCityPage
      ? "slider_view_all_citypage_clicked"
      : "slider_view_all_clicked",
    viewAllTitle: title,
    viewAllLink: path,
  });

  router.push(path); // ✅ Navigate
};


  const handleItemClick = (item) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "decoration_item_clicked",
      event_category: "SliderSection",
      event_label: item.title,
      categoryName: item.categoryName,
      subCategory: item.subCategory,
      catValue: item.catValue,
      imgAlt: item.imgAlt,
    });

    console.log("Last Event:", window.dataLayer[window.dataLayer.length - 1]);
  };

  return {
    openCatItems,
    handleViewMore,
    handleSliderViewMore,
    handleItemClick,
  };
};
