// import { useRouter } from "next/router";
// import { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import Image from "next/image";
// import "./catvaluephoto.css"
// import ThumbnailGallery from "@/pages/photo-gallery/ThumbnailGallery";

// const getDiscountedPrice = (price) => {
//   const discount = 20;
//   const discountedPrice = price - (price * discount) / 100;
//   return {
//     discount,
//     discountedPrice,
//     discountDifference: price - discountedPrice,
//   };
// };

// const slugToIdMap = {
//   "Engagement-Photography": "68c3ab87c9c67cc47cedbf93",
//   "Wedding-Photography": "68c3abc3c9c67cc47cedc01b",
//   "Anniversary-Photography": "68c3aae9c9c67cc47cedbe6d",
//   "Birthday-Photography": "68c3aa8ac9c67cc47cedbdec",
//   "House-warming-Photography": "68c3aaf1c9c67cc47cedbe76",
//   "Naming-ceremony-Photography": "68c3ab42c9c67cc47cedbefc",
//   "Baby-Shower-Photography": "68c3ab2ec9c67cc47cedbede",
//   "Bachelorette-Photography": "68c3abe5c9c67cc47cedc05c",
//   "Maternity-Photography": "68c3ab97c9c67cc47cedbfb4",
//   "New-Born-Baby-Photography": "68c3abd1c9c67cc47cedc044"
// };

// export default function CatValuePage() {
//   const router = useRouter();
//   const { catValue } = router.query;
//   const [galleryData, setGalleryData] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);



//   const fetchData = useCallback(async (tagId) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `https://horaservices.com:3000/api/photography/searchByTag/${tagId}`
//       );
//       const productData = response.data.data.map((item) => {
//         const { discount, discountedPrice, discountDifference } =
//           getDiscountedPrice(item.price);
//         return {
//           ...item,
//           discountPercentage: discount,
//           discountedPrice,
//           discountDifference,
//         };
//       });
//       setProducts(productData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);
  
//    useEffect(() => {
//     if (catValue) {
//       const tagId = slugToIdMap[catValue];
//       // const gallery = categoryToGallery[catValue] || null;
//       // setGalleryData(gallery);

//       if (tagId) {
//         fetchData(tagId);
//       }
//     }
//   }, [catValue, fetchData]);

// // const categoryToGallery = {
// //   "Engagement-Photography": {
// //     folderName: "Engagement",
// //     customerId: "6683e5d43e33c54c0ebde8f2",
// //   },
// //   "Wedding-Photography": {
// //     folderName: "Wedding",
// //     customerId: "6683e5d43e33c54c0ebde8f2",
// //   },
// //   "Anniversary-Photography": {
// //     folderName: "Anniversary",
// //     customerId: "6683e5d43e33c54c0ebde8f2",
// //   },
// //   "Birthday-Photography": {
// //     folderName: "birthday poses",
// //     customerId: "6683e5d43e33c54c0ebde8f2",
// //   },
// //   "House-warming-Photography": {
// //     folderName: "House-warming",
// //     customerId: "6683e5d43e33c54c0ebde8f2",
// //   },
// //   "Naming-ceremony-Photography": {
// //     folderName: "Naming-ceremony",
// //     customerId: "6683e5d43e33c54c0ebde8f2",
// //   },
// //   "Baby-Shower-Photography": {
// //     folderName: "Baby-Shower",
// //     customerId: "6683e5d43e33c54c0ebde8f2",
// //   },
// //   "Bachelorette-Photography": {
// //     folderName: "Bachelorette",
// //     customerId: "6683e5d43e33c54c0ebde8f2",
// //   },
// //   "Maternity-Photography": {
// //     folderName: "maternity poses",
// //     customerId: "6683e5d43e33c54c0ebde8f2",
// //   },
// //   "New-Born-Baby-Photography": {
// //     folderName: "New-Born-Baby",
// //     customerId: "6683e5d43e33c54c0ebde8f2",
// //   },

// // };
//   useEffect(() => {
//     if (catValue) {
//       const tagId = slugToIdMap[catValue];
//       if (tagId) {
//         fetchData(tagId);
//       }
//     }
//   }, [catValue, fetchData]);

//   const handleViewMore = (work) => {
//     if (!work?._id) return; // safety check

//     const tagId = slugToIdMap[catValue]; // get tagId dynamically

//     router.push({
//       pathname: `/photography-page/product/${work._id}`,
//       query: {
//         product: JSON.stringify(work),
//         tagId: tagId,
//       },
//     });

//     // push analytics
//     window.dataLayer = window.dataLayer || [];
//     window.dataLayer.push({
//       event: 'photography_view_more_click',
//       eventCategory: 'photography',
//       eventAction: 'view_more_click',
//       eventLabel: work?.title || work?.name || 'Unknown Product',
//       productId: work?._id,
//       tagId: tagId,
//     });
//   };
// // const { folderName, customerId } = categoryToGallery[catValue] || {};

//   return (
//     <div className="featured-works">
//       <p className="ProductHeading">{catValue}</p>

//       {loading ? (
//         <div className="loader-container">
//           <div className="spinner"></div>
//         </div>
//       ) : products.length > 0 ? (
//         <div className="work-container">
//           {products.map((work, index) => (
//             <div className="work-item" key={index}>
//               <div className="discount-badge">
//                 ₹ {work.discountDifference.toFixed(0)} off
//               </div>
//               <div className="work-image-wrapper">
//                 <div className="work-image">
//                   <Image
//                     src={work.imageUrl || "/default.jpg"}
//                     alt={work.name}
//                     width={300}
//                     height={200}
//                     className="work-img"
//                   />
//                   <div className="work-image-overlay" />
//                   <h5 className="work-title">{work.name}</h5>
//                 </div>
//               </div>

//               <div className="work-card-info">
//                 <p className="Prefred">
//                   <span className="old-price">₹ {work.price}</span>
//                   <span className="new-price">
//                     ₹{Math.floor(work.discountedPrice)}
//                   </span>
//                 </p>
//                 <button
//                   onClick={() => handleViewMore(work)}
//                   className="photograpy-book-now"
//                 >
//                   Book Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No products found.</p>
//       )}
//  {/* {galleryData && galleryData.folderName && galleryData.customerId && (
//         <ThumbnailGallery
//           folderName={galleryData.folderName}
//           customerId={galleryData.customerId}
//         />
//       )} */}


//     </div>
//   );
// }
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import "./catvaluephoto.css";
import { BASE_URL, GET_DECORATION_CAT_ID ,GET_PHOTOGRAPHY_BY_NAME} from "@/utils/apiconstants.js";

const getDiscountedPrice = (price = 0) => {
  const discount = 20;
  const discountedPrice = price - (price * discount) / 100;
  return {
    discount,
    discountedPrice,
    discountDifference: price - discountedPrice,
  };
};

export default function CatValuePage() {
  const router = useRouter();
  const { catValue } = router.query;

  const [catId, setCatId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Only meals API to get category _id
  const getSubCatId = useCallback(async (subCategory) => {
    try {
      const response = await axios.get(
        `${BASE_URL}${GET_DECORATION_CAT_ID}${encodeURIComponent(subCategory)}`
      );

      const categoryId = response.data?.data?._id;
      console.log("Category ID:", categoryId);

      if (categoryId) {
        setCatId(categoryId); // ✅ only this
      } else {
        setError("No category found");
      }
    } catch (err) {
      console.error("Error fetching category ID:", err.message);
      setError("Failed to fetch category");
    }
  }, []);

  useEffect(() => {
    if (catValue) getSubCatId(catValue);
  }, [catValue, getSubCatId]);

const fetchProducts = useCallback(async (categoryId) => {
  if (!categoryId) return;
  setLoading(true);
  try {
    // ✅ Correct API endpoint
    const res = await axios.get(`${BASE_URL}${GET_PHOTOGRAPHY_BY_NAME}${categoryId}`);
    const data = res.data?.data || [];

    // Apply discount calculation
    const productsWithDiscount = data.map((item) => {
      const { discount, discountedPrice, discountDifference } = getDiscountedPrice(item.price || 0);
      return { ...item, discount, discountedPrice, discountDifference };
    });

    setProducts(productsWithDiscount);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    setProducts([]);
    setError("Failed to fetch products");
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    if (catId) fetchProducts(catId);
  }, [catId, fetchProducts]);

  const handleViewMore = (work) => {
    if (!work?._id) return;
    router.push({
      pathname: `/photography-page/product/${work._id}`,
      query: { product: JSON.stringify(work) },
    });
  };

  return (
    <div className="featured-works">
      <p className="ProductHeading">{catValue}</p>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : products.length > 0 ? (
        // <div className="work-container">
        //   {products.map((work) => (
        //     <div className="work-item" key={work._id}>
        //       <div className="discount-badge">
        //         ₹ {work.discountDifference.toFixed(0)} off
        //       </div>
        //       <div className="work-image-wrapper">
        //         <Image
        //           src={work.imageUrl || "/default.jpg"}
        //           alt={work.name}
        //           width={300}
        //           height={200}
        //           className="work-img"
        //         />
        //         <h5 className="work-title">{work.name}</h5>
        //       </div>
        //       <div className="work-card-info">
        //         <p className="Prefred">
        //           <span className="old-price">₹ {work.price}</span>
        //           <span className="new-price">₹ {Math.floor(work.discountedPrice)}</span>
        //         </p>
        //         <button onClick={() => handleViewMore(work)} className="photograpy-book-now">
        //           Book Now
        //         </button>
        //       </div>
        //     </div>
        //   ))}
        // </div>
        <div className="work-container">
  {products.map((work) => {
    // ✅ Build local image path (fallback to default)
    const imagePath = work.featured_image
      ? `/photographyImages/${work.featured_image}`
      : "/default.jpg";

    return (
      <div className="work-item" key={work._id}>
        <div className="discount-badge">
          ₹ {work.discountDifference?.toFixed(0)} off
        </div>

        <div className="work-image-wrapper">
            <div className="work-image">
          <Image
            src={imagePath}
            alt={work.name || "Photography"}
            width={300}
            height={200}
            className="work-img"
          />
 <div className="work-image-overlay" />
           <h5 className="work-title">{work.name}</h5>  
           </div>
        </div>

        <div className="work-card-info">
          <p className="Prefred">
            <span className="old-price">₹ {work.price}</span>
            <span className="new-price">
              ₹ {Math.floor(work.discountedPrice)}
            </span>
          </p>
          <button
            onClick={() => handleViewMore(work)}
            className="photograpy-book-now"
          >
            Book Now
          </button>
        </div>
      </div>
    );
  })}
</div>

      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
