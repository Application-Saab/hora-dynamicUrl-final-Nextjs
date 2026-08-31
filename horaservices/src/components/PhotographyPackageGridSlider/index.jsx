import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import "./PhotographyPackageGridSlider.css";
import { BASE_URL, GET_PHOTOGRAPHY_BY_TAG } from "@/utils/apiconstants.js";
import axiosApi from "@/utils/axiosApi";

export default function PhotographyPackageGridSlider({
  title,
  tagId,
  cityProps = {},
  initialProducts = null,
}) {
  const router = useRouter();

  // SSR data ho to turant use karo — loading false
  const hasSSRData = Array.isArray(initialProducts);
  const [products, setProducts] = useState(hasSSRData ? initialProducts : []);
  const [loading, setLoading] = useState(!hasSSRData);

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

  useEffect(() => {
    // SSR se data aa chuka hai → client pe dubara fetch mat karo
    if (hasSSRData) return;
    if (!tagId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosApi.get(
          `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${tagId}`
        );
        const data =
          res.data?.data?.map((item) => {
            const { discountedPrice, discountDifference } = getDiscountedPrice(
              item.price || 0
            );
            return { ...item, discountedPrice, discountDifference };
          }) || [];
        if (!cancelled) setProducts(data);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [tagId, hasSSRData]);

  const slugify = (text) =>
    text
      ?.toLowerCase()
      ?.replace(/[^a-z0-9]+/g, "-")
      ?.replace(/(^-|-$)/g, "");

  const handleCardClick = (work) => {
    if (!work) return;

    const slug = slugify(work.name);
    const categorySlug = slugify(work.categoryValue || "photography");

    const city = cityProps?.city || router.query?.city;
    const locality = cityProps?.locality || router.query?.locality;

    let basePath = `/photography-page/${categorySlug}/product/${slug}`;

    if (city && locality) {
      basePath = `/${String(city).toLowerCase()}/${String(locality).toLowerCase()}${basePath}`;
    } else if (city) {
      basePath = `/${String(city).toLowerCase()}${basePath}`;
    }

    router.push({
      pathname: basePath,
      query: { id: work._id },
    });
  };

  // Same structure server + client — no conditional wrapper that changes DOM shape
  return (
    <section className="premium-slider-decor">
      <div className="premium-slider-decor-header">
        <h2>{title}</h2>
      </div>

      <div className="premium-scroll">
        {loading ? (
          <div className="loader-container">
            <div className="spinner" />
          </div>
        ) : products.length > 0 ? (
          products.map((item, i) => (
            <div key={item._id || i} className="premium-card">
              <div
                className="premium-wrapper"
                onClick={() => handleCardClick(item)}
              >
                <Image
                  src={`https://horaservices.com/api/uploads/compressed_webp/${
                    item.featured_image?.split(".")[0]
                  }.webp`}
                  alt={`photography ${item.name}`}
                  fill
                  sizes="150px"
                  className="premium-img"
                />
              </div>

              <div className="premium-content">
                <p className="premium-title">{item.name}</p>
                <div className="premium-price-wrapper">
                  <span className="premium-price">₹{item.price}</span>
                  <span className="premium-original">
                    ₹{item.discountedPrice}
                  </span>
                </div>
                <button
                  className="photograpy-book-now-slider"
                  type="button"
                  onClick={() => handleCardClick(item)}
                >
                  View more
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products found.</p>
        )}
      </div>
    </section>
  );
}