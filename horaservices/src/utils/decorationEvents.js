"use client";
import { useRouter } from "next/navigation";

export const useDecorationEvents = (
  city,
  hasCityPageParam = false,
  decCat = [],
  locality = ""
) => {
  const router = useRouter();

  const formatPath = (path) => {
    const cityPath = city ? `/${city.toLowerCase()}` : "";
    const localityPath = locality ? `/${locality.toLowerCase()}` : "";
    return `${cityPath}${localityPath}${path}`;
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
      categoryName: item.categoryName,
      subCategory: item.subCategory,
      catValue: item.catValue,
      imgAlt: item.imgAlt,
      city: city || "default",
      locality: locality || "default",
    });
  };

  return {
    openCatItems,
    handleViewMore,
    handleSliderViewMore,
    handleItemClick,
  };
};
