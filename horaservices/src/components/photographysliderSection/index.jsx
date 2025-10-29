import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import "./photographyslider.css";
import traditionalImg from "@/assets/traditionalphoto.webp";

export default function PhotographysliderSection({
  title,
  tagId,
  city = "",
  locality = "",
  hasCityPageParam = false,
}) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);



  
const getDiscountedPrice = (price = 0) => {
  // price here is AFTER discount
  const discountedPrice = price / 0.78; // get original (before discount)
  const discountDifference = discountedPrice - price; // how much is off
  const discount = ((discountDifference / discountedPrice) * 100).toFixed(0); // 22%
  return {
    discount: Number(discount),              // 22
    discountedPrice: Math.round(discountedPrice), // original price (before discount)
    discountDifference: Math.round(discountDifference), // amount off
  };
};

  // ✅ Fetch photography data
  const fetchData = useCallback(async () => {
    if (!tagId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://horaservices.com:3000/api/photography/searchByTag/${tagId}`
      );
      const data = res.data?.data?.map((item) => {
        const { discountedPrice, discountDifference } = getDiscountedPrice(item.price || 0);
        return { ...item, discountedPrice, discountDifference };
      });
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching photography data:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [tagId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const slugify = (text) =>
    text?.toLowerCase()?.replace(/[^a-z0-9]+/g, "-")?.replace(/(^-|-$)/g, "");

  const handleCardClick = (work) => {
    if (!work) return;
    const slug = slugify(work.name);
    const categorySlug = slugify(work.categoryValue || "photography");

    router.push({
      pathname: `/photography-page/${categorySlug}/product/${slug}`,
      query: { id: work._id },
    });
  };

  return (
    <section className="premium-slide-decor">
      <div className="premium-slide-decor-header">
        <h2>{title}</h2>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="premium-scroll-wrapper">
          {products.length > 0 ? (
            products.map((item, i) => {
              const imageUrl = item.featured_image || traditionalImg;
              return (
                <div
                  key={i}
                  className="premium-card"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="premium-img-wrapper">
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      width={200}
                      height={150}
                      className="premium-img"
                    />
                    <div className="premium-discount">
                      ₹{Math.floor(item.discountDifference)} off
                    </div>
                  </div>

                  <div className="premium-content">
                    <p className="premium-title">
                      {item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}
                    </p>
                  </div>

                  <div className="premium-price-wrapper">
                    <span className="premium-price">₹{item.price}</span>
                    <span className="premium-original">₹{Math.floor(item.discountedPrice)}</span>
                  </div>

                </div>
              );
            })
          ) : (
            <p className="no-products">No products found.</p>
          )}
        </div>
      )}
    </section>
  );
}
