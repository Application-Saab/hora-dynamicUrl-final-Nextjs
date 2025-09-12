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

    // Determine the discount percentage based on the item price
    if (price < 3000) {
      discount = 20; // 20% discount
    } else if (price >= 3000 && price <= 5000) {
      discount = 27; // 27% discount
    } else {
      discount = 35; // 35% discount for prices above 5000
    }

    const discountedPrice = price * (1 + discount / 100); // Calculate the discounted price
    const discountDifference = Math.abs(price - discountedPrice);;
    return { discount, discountedPrice, discountDifference }; // Return both discount percentage and discounted price
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

const viewMoreProduct = (item) => {
  router.push({
    pathname: `/photography-page/product/${item._id}`,
    query: {
      product: JSON.stringify(item),
      tagId: tagId,  // use the prop directly
    },
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'photography_view_more_click',
    eventCategory: 'photography',
    eventAction: 'view_more_click',
    eventLabel: item?.title || item?.name || 'Unknown Product',
    productId: item?._id,
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
    <section className="premium-slide-decor-slider">
      <div className="premium-slide-decor-header-slider">
        <h2>{title}</h2>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="premium-scroll-wrapper-slider">
        {products.map((item, index) => {
  const imageUrl = imageMap[item._id] || traditionalImg; // fallback if no image found
  return (
    <div className="work-container-slider">
             <div className="work-item-slider" key={index}>
                   <div className="discount-badge-slider">
                     ₹ {item.discountDifference.toFixed(0)} off
                   </div>
                   <div className="work-image-wrapper-slider">
                     <div className="work-image-slider">
                       <Image
                         src={imageUrl}
                         alt={item.name}
                         width={300}
                         height={200}
                         className="work-img-slider"
                       />
                       <div className="work-image-overlay-slider" />
                       <h5 className="work-title-slider">{item.name}</h5>
                     </div>
                   </div>
   
                   {/* Card Info */}
                   <div className="work-card-info-slider">
                     <p className="Prefred-occ-slider">
                       <span className="old-price-slider">₹ {item.price}</span>
                       <span className="new-price-slider">
                         ₹{Math.floor(item.discountedPrice)}
                       </span>
                     </p>
                     <button
                        onClick={() => viewMoreProduct(item)}
                       className="photograpy-book-now-slider"
                     >
                       View More
                     </button>
                   </div>
                 </div>
             </div>
  );
})}

        </div>
      )}
    </section>
  );
}
