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

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const handleViewMore = (work) => {
  const slug = slugify(work.name);
  const categorySlug = slugify(work.categoryValue || "photography");

  router.push({
    pathname: `/photography-page/${categorySlug}/product/${slug}`,
    query: { id: work._id }, // internal _id for API fetch
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
