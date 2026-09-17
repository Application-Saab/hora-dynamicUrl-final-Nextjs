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

  const getCardHref = (work) => {
    if (!work) return "#";

    const slug = slugify(work.name);
    const categorySlug = slugify(work.categoryValue || "photography");

    const city = cityProps?.city || router.query?.city;
    const locality = cityProps?.locality || router.query?.locality;

    let basePath = `/photography-page/${categorySlug}/product/${slug}`;

    if (city && locality) {
      basePath = `/${String(city).toLowerCase()}/${String(
        locality
      ).toLowerCase()}${basePath}`;
    } else if (city) {
      basePath = `/${String(city).toLowerCase()}${basePath}`;
    }

    // pehle query: { id: work._id } tha
    if (work._id) {
      return `${basePath}?id=${work._id}`;
    }
    return basePath;
  };

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
              <a
                type="button"
                href={getCardHref(item)}
                className="premium-wrapper"
                style={{ display: "block", position: "relative" }}
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
              </a>

              <div className="premium-content">
                <p className="premium-title">{item.name}</p>
                <div className="premium-price-wrapper">
                  <span className="premium-price">₹{item.price}</span>
                  <span className="premium-original">
                    ₹{item.discountedPrice}
                  </span>
                </div>
                <a
                  type="button"
                  href={getCardHref(item)}
                  className="photograpy-book-now-slider"
                >
                  View more
                </a>
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