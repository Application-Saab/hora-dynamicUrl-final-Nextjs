import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import "./photographyslider.css"
import traditionalImg from "@/assets/traditionalphoto.webp";
import candidImg from "@/assets/CandidphotoImg.webp";
import proImg from "@/assets/Prophotography.webp";
import videoImg from "@/assets/Videography.webp";
import {useRouter} from "next/router";
// helper fn
const getDiscountedPrice = (price) => {
  let discount;

  if (price < 3000) {
    discount = 20;
  } else if (price >= 3000 && price <= 5000) {
    discount = 27;
  } else {
    discount = 35;
  }

  const discountedPrice = price - (price * discount) / 100; // correct calc
  const discountDifference = price - discountedPrice;

  return { discount, discountedPrice, discountDifference };
};

export default function PhotographysliderSection({ title, tagId }) {
      const router = useRouter();
    const imageMap = {
  "6710f33c21847b9ca0554940": traditionalImg,
  "67c9af0c4bee1b66f0aac35d": candidImg,
  "67c9af224bee1b66f0aac35e": proImg,
  "67c9b0564bee1b66f0aac35f": videoImg,
};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const imageSize = { width: 200, height: 150 };
  const showDiscount = true;

const viewMoreProduct = (work) => {
  router.push({
    pathname: `/photography-page/product/${work._id}`,
    query: {
      product: JSON.stringify(work),
      tagId: tagId,  // use the prop directly
    },
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'photography_view_more_click',
    eventCategory: 'photography',
    eventAction: 'view_more_click',
    eventLabel: work?.title || work?.name || 'Unknown Product',
    productId: work?._id,
    tagId: tagId, // track which tag this product belongs to
  });
};


  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://horaservices.com:3000/api/photography/searchByTag/${tagId}`
      );
      const productData = response.data.data.map((item) => {
        const { discount, discountedPrice, discountDifference } =
          getDiscountedPrice(item.price);
        return {
          ...item,
          discountPercentage: discount,
          discountedPrice,
          discountDifference,
        };
      });
      setProducts(productData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [tagId]);

  useEffect(() => {
    if (tagId) fetchData();
  }, [tagId, fetchData]);

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
        {products.map((item, index) => {
  const imageUrl = imageMap[item._id] || traditionalImg; // fallback if no image found
  return (
    <div key={index} className="premium-card">
      <div className="premium-img-wrapper">
        <Image
          src={imageUrl}
          alt={item.name}
          width={imageSize.width}
          height={imageSize.height}
          className="premium-img"
        />
        {showDiscount && (
          <div className="premium-discount">
            ₹{item.discountDifference.toFixed(0)} off
          </div>
        )}
      </div>

      <div className="premium-content">
        <p className="premium-title">
          {item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}
        </p>
      </div>

      <div className="premium-price-wrapper">
        <span className="premium-price">₹{item.discountedPrice}</span>
        {showDiscount && <span className="premium-original">₹{item.price}</span>}
      </div>
<button
  className="photograpy-book-now"
  onClick={() => viewMoreProduct(item)}
>
  View More
</button>
    </div>
  );
})}

        </div>
      )}
    </section>
  );
}
