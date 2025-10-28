
// import { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import Image from "next/image";
// import { useRouter } from "next/router";
// import "./photographyslider.css";

// import traditionalImg from "@/assets/traditionalphoto.webp";

// export default function PhotographysliderSection({
//   title,
//   tagId,
//   city = "",
//   locality = "",
//   hasCityPageParam = false,
// }) {
//   const router = useRouter();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ Discount Calculation
//   const getDiscountedPrice = (price) => {
//     let discount = 0;
//     if (price < 3000) discount = 20;
//     else if (price >= 3000 && price <= 5000) discount = 27;
//     else discount = 35;

//     const discountedPrice = price * (1 - discount / 100);
//     const discountDifference = price - discountedPrice;
//     return { discount, discountedPrice, discountDifference };
//   };

//   // ✅ Fetch products
//   const fetchData = useCallback(async () => {
//     if (!tagId) return;
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `https://horaservices.com:3000/api/photography/searchByTag/${tagId}`
//       );
//       const productData = response.data?.data?.map((item) => {
//         const { discount, discountedPrice, discountDifference } =
//           getDiscountedPrice(item.price || 0);
//         return { ...item, discount, discountedPrice, discountDifference };
//       });
//       setProducts(productData || []);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [tagId]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // ✅ Slugify helper
//   const slugify = (text) =>
//     text?.toLowerCase()?.replace(/[^a-z0-9]+/g, "-")?.replace(/(^-|-$)/g, "");

//   // ✅ Handle card click / View More
//   const handleCardClick = (work) => {
//     if (!work) return;

//     const slug = slugify(work.name);
//     const categorySlug = slugify(work.categoryValue || "photography");

//     // Google Tag event
//     window.dataLayer = window.dataLayer || [];
//     window.dataLayer.push({
//       event: hasCityPageParam
//         ? "title_and_viewmore_photography_citypage_clicked"
//         : "title_and_viewmore_photography_page_clicked",
//       categoryName: work.name,
//       subCategory: work.categoryValue,
//       catValue: work.categoryValue,
//       imgAlt: work.imgAlt || "",
//       city: city || "default",
//       locality: locality || "default",
//     });

//     // Navigate to product detail page
//     router.push({
//       pathname: `/photography-page/${categorySlug}/product/${slug}`,
//       query: { id: work._id },
//     });
//   };

//   return (
//     <section className="premium-slide-decor-slider">
//       <div className="premium-slide-decor-header-slider">
//         <h2>{title}</h2>
//       </div>

//       {loading ? (
//         <div className="loader-container">
//           <div className="spinner"></div>
//         </div>
//       ) : (
//         <div className="premium-scroll-wrapper-slider">
//           {products.length > 0 ? (
//             products.map((item, index) => {
//               const imageUrl = item.featured_image || traditionalImg;

//               return (
//                 <div
//                   key={index}
//                   className="work-container-slider"
//                   onClick={() => handleCardClick(item)} // ✅ full object pass
//                   style={{ cursor: "pointer" }}
//                 >
//                   <div className="work-item-slider">
//                     <div className="discount-badge-slider">
//                       ₹{Math.floor(item.discountDifference)} off
//                     </div>

//                     <div className="work-image-wrapper-slider">
//                       <div className="work-image-slider">
//                         <Image
//                           src={imageUrl}
//                           alt={item.name}
//                           width={300}
//                           height={200}
//                           className="work-img-slider"
//                         />
//                         <div className="work-image-overlay-slider" />
//                         <h5 className="work-title-slider">{item.name}</h5>
//                       </div>
//                     </div>

//                     <div className="work-card-info-slider">
//                       <p className="Prefred-occ-slider">
//                         <span className="old-price-slider">₹{item.price}</span>
//                         <span className="new-price-slider">
//                           ₹{Math.floor(item.discountedPrice)}
//                         </span>
//                       </p>

//                       <button
//                         className="photograpy-book-now-slider"
//                         onClick={(e) => {
//                           e.stopPropagation(); // 🔹 Stop parent click
//                           handleCardClick(item);
//                         }}
//                       >
//                         View More
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <p className="no-products">No products found.</p>
//           )}
//         </div>
//       )}
//     </section>
//   );
// }

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
  const discountedPrice = price * 0.78; // 22% discount
  const discountDifference = price - discountedPrice; // how much is off
  const discount = ((discountDifference / price) * 100).toFixed(0); // 22%
  return {
    discount: Number(discount),
    discountedPrice,
    discountDifference,
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
                    <span className="premium-price">₹{Math.floor(item.discountedPrice)}</span>
                    <span className="premium-original">₹{item.price}</span>
                  </div>
{/* 
                  <button
                    className="photograpy-book-now-slider"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(item);
                    }}
                  >
                    View More
                  </button> */}
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
