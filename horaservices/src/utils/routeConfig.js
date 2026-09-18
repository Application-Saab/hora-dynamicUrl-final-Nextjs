// utils/routeConfig.js

import { decCat } from "./decorationCategories";
import { validCitySlugs } from "./validCities";
import {photoCat} from './photoCategories'

/**
 * Routes which exist without city/locality.
 *
 * Example:
 * /balloon-decoration
 */
export const DIRECT_ROUTES = [
  "/balloon-decoration",
  "/balloon-decoration-google-ads",
  "/balloon-decoration-instagram",
  "/balloon-decoration-youtube",
  "/book-chef-cook-for-party",
  // "/chef-near-me",
  "/party-food-delivery-live-catering-buffet",
  "/photography-page",
  "/venue-list",

  // Add your other direct routes here
];

/**
 * Routes which support city.
 *
 * Example:
 * /ghaziabad/balloon-decoration
 */
export const CITY_ROUTES = [
  "/",
  "/venue-list",
  "/balloon-decoration",
  "/photography-page",
  // "/chef-near-me",
  "/book-chef-cook-for-party",
  "/balloon-decoration-google-ads",
  "/balloon-decoration-instagram",
  "/balloon-decoration-youtube",
//   "/party-food-delivery-live-catering-buffet",

  // Add your other city routes here
];

/**
 * Routes which support city + locality.
 *
 * Example:
 * /ghaziabad/indirapuram/balloon-decoration
 */
export const CITY_LOCALITY_ROUTES = [
  "/",
  "/balloon-decoration",
  "/book-chef-cook-for-party",
  // "/chef-near-me",
  "/party-food-delivery-live-catering-buffet",
  "/photography-page",
  // Add your other city + locality routes here
];

/**
 * Normalize pathname
 */
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

/**
 * Check whether route supports city.
 */
export const isCityRouteAllowed = (pathname) => {
  const path = normalizeRoutePath(pathname);

  return CITY_ROUTES.some(
    (route) => normalizeRoutePath(route) === path
  );
};

/**
 * Check whether route supports city + locality.
 */
export const isCityLocalityRouteAllowed = (pathname) => {
  const path = normalizeRoutePath(pathname);

  return CITY_LOCALITY_ROUTES.some(
    (route) => normalizeRoutePath(route) === path
  );
};

/**
 * Check whether direct route exists.
 */
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