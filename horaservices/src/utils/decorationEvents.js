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
    console.log("Category Item:", categoryItem);

    if (categoryItem) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "title_and_viewmore_decoration_page_clicked",
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

  const handleSliderViewMore = (link) => {
    if (city) {
      router.push(`/${city}/${link}`);
    } else {
      router.push(`/${link}`);
    }
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
