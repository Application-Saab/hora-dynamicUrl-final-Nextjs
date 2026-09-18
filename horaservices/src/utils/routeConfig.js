import { decCat } from "./decorationCategories";
import { validCitySlugs } from "./validCities";
import {photoCat} from './photoCategories'

export const DIRECT_ROUTES = [
  "/balloon-decoration",
  "/balloon-decoration-google-ads",
  "/balloon-decoration-instagram",
  "/balloon-decoration-youtube",
  "/book-chef-cook-for-party",
  "/party-food-delivery-live-catering-buffet",
  "/photography-page",
  "/venue-list",
];

export const CITY_ROUTES = [
  "/",
  "/venue-list",
  "/balloon-decoration",
  "/photography-page",
  "/book-chef-cook-for-party",
  "/balloon-decoration-google-ads",
  "/balloon-decoration-instagram",
  "/balloon-decoration-youtube",
];

export const CITY_LOCALITY_ROUTES = [
  "/",
  "/balloon-decoration",
  "/book-chef-cook-for-party",
  "/photography-page",
];

export const normalizeRoutePath = (pathname = "") => {
  let path = String(pathname).trim();

  if (!path) return "/";

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  return path.toLowerCase();
};

export const isCityRouteAllowed = (pathname) => {
  const path = normalizeRoutePath(pathname);

  return CITY_ROUTES.some(
    (route) => normalizeRoutePath(route) === path
  );
};

export const isCityLocalityRouteAllowed = (pathname) => {
  const path = normalizeRoutePath(pathname);

  return CITY_LOCALITY_ROUTES.some(
    (route) => normalizeRoutePath(route) === path
  );
};

export const isDirectRouteAllowed = (pathname) => {
  const path = normalizeRoutePath(pathname);

  return DIRECT_ROUTES.some(
    (route) => normalizeRoutePath(route) === path
  );
};

export const getRouteWithoutCity = (
  pathname = ""
) => {
  const path = normalizeRoutePath(pathname);

  const segments = path
    .split("/")
    .filter(Boolean);

  if (
    segments.length > 0 &&
    validCitySlugs.includes(segments[0])
  ) {
    segments.shift();
  }

  return `/${segments.join("/")}`;
};

export function isValidDecorationCategorySlug(catValue) {
  if (!catValue) return false;

  const slug = catValue.toLowerCase();

  return decCat.some((item) => {
    const itemSlug =
      item.slug ||
      item.catValue?.toLowerCase().replace(/\s+/g, "-");

    return itemSlug?.toLowerCase() === slug;
  });
}

export function isValidPhotographyCategorySlug(catValue) {
  if (!catValue) return false;

  const slug = catValue.toLowerCase();

  return photoCat.some((item) => {
    const itemSlug =
      item.slug ||
      item.catValue?.toLowerCase().replace(/\s+/g, "-");

    return itemSlug?.toLowerCase() === slug;
  });
}