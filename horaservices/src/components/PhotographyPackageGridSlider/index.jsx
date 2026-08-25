import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import "./PhotographyPackageGridSlider.css";
import { BASE_URL, GET_PHOTOGRAPHY_BY_TAG } from "@/utils/apiconstants.js";
import axiosApi from "@/utils/axiosApi";

export default function PhotographyPackageGridSlider({
  title,
  tagId,
}) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (!tagId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosApi.get(
          `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${tagId}`
        );

        const data =
          res.data?.data?.map((item) => {
            const { discountedPrice, discountDifference } =
              getDiscountedPrice(item.price || 0);

            return { ...item, discountedPrice, discountDifference };
          }) || [];

        setProducts(data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tagId]);

  const slugify = (text) =>
    text
      ?.toLowerCase()
      ?.replace(/[^a-z0-9]+/g, "-")
      ?.replace(/(^-|-$)/g, "");

  const handleCardClick = (work) => {
    if (!work) return;

    const slug = slugify(work.name);
    const categorySlug = slugify(work.categoryValue || "photography");

    const city = router.query.city;
    const locality = router.query.locality;

    let basePath = `/photography-page/${categorySlug}/product/${slug}`;

    if (city && locality) {
      basePath = `/${city?.toLowerCase()}/${locality?.toLowerCase()}${basePath}`;
    } else if (city) {
      basePath = `/${city?.toLowerCase()}${basePath}`;
    }

    router.push({
      pathname: basePath,
      query: { id: work._id },
    });
  };

  return (
    <section className="premium-slider-decor">
      <div className="premium-slider-decor-header">
        <h2>{title}</h2>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner" />
        </div>
      ) : (
        <div className="premium-scroll">
          {products.length > 0 ? (
            products.map((item, i) => (
          <div
  key={item._id || i}
  className="premium-card"
>
  <div className="premium-wrapper" onClick={() => handleCardClick(item)}>
    <Image
      src={`https://horaservices.com/api/uploads/compressed_webp/${item.featured_image
        ?.split(".")[0]}.webp`}
      alt={`photography ${item.name}`}
      fill
      sizes="150px"
      className="premium-img"
    />
  </div>

  <div className="premium-content">
   <p className="premium-title">
  {item.name}
</p>

    <div className="premium-price-wrapper">
      <span className="premium-price">₹{item.price}</span>
      <span className="premium-original">
        ₹{item.discountedPrice}
      </span>
    </div>

    <button
      className="photograpy-book-now-slider"
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
      )}
    </section>
  );
}
