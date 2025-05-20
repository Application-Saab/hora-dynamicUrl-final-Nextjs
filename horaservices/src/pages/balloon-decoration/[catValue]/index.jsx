import { useEffect, useState, useRef } from 'react';
import { BASE_URL, GET_DECORATION_CAT_ID, GET_DECORATION_CAT_ITEM, API_SUCCESS_CODE } from '../../../utils/apiconstants';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { CardSkeleton } from "../../../components/CardSkeleton";
import { setState } from '../../../actions/action';
import { useDispatch } from 'react-redux';
import { useRouter } from "next/router";
import Link from "next/link";
import DecorationCatDescriptionData from "@/utils/decorationCatDescritionData";
import DecorationCard from '@/component/Cards/DecorationCard/DecorationCard';
import { CategorySeoHead } from '../components/CategorySeoHead';
import { PriceFilter } from '@/util/DecorationMockData/PriceFilter';
import { getSubCategory } from '@/util/getSubCategory';
import { themeFilters } from '@/util/DecorationMockData/ThemeFilter';
import { getDiscountedPrice } from '@/util/getDiscountedPrice';


const DecorationCatPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [city, setCity] = useState('');
  const [catValue, setCatValue] = useState('');
  useEffect(() => {
    if (router.isReady) {
      const { catValue: queryCatValue, city: queryCity } = router.query;
      if (queryCatValue) {
        setCatValue(queryCatValue);
      }
      if (queryCity) {
        setCity(queryCity);
      }
    }
    else {
      const path = window.location.pathname; // e.g., /balloon-decoration/kids-birthday-decoration
      const parts = path.split('/'); // Split by '/'
      const dynamicValue = parts[2];
      setCatValue(dynamicValue);
    }
  }, [router.isReady, router.query]);

  const [orderType, setOrderType] = useState(1);
  const containerRef = useRef(null);
  const [selCat, setSelCat] = useState("");
  const [catId, setCatId] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [currentCategoryContent, setCurrentCategoryContent] = useState(DecorationCatDescriptionData[catValue])
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [catalogueData, setCatalogueData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [priceFilter, setPriceFilter] = useState('all'); // Default: Show all
  const [themeFilter, setThemeFilter] = useState("all"); // Default: Show all


  // UseSelector to get state from Redux
  const { subCategory: stateSubCategory, imgAlt: stateImgAlt } = useSelector((state) => state.state || {});
  // Determine the value for subCategory and imgAlt
  const subCategory = getSubCategory(catValue) || stateSubCategory;
 
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Function to generate a random rating between 4.1 to 4.8
  const getRandomRating = () => {
    return (Math.random() * (4.8 - 4.1) + 4.1).toFixed(1);
  };


  useEffect(() => {
    addSpaces(subCategory);
    getSubCatId(subCategory);
  }, [subCategory]);

  useEffect(() => {
    const handleStickyScroll = () => {
      const filterElement = document.querySelector('.filterdropdown');
      if (filterElement) {
        filterElement.classList.toggle('sticky', window.scrollY > 100)
      }
    };

    window.addEventListener('scroll', handleStickyScroll);
    return () => window.removeEventListener('scroll', handleStickyScroll);
  }, []);

  const sentinelRef = useRef(null);

  useEffect(() => {
    if (loading || !hasMore) return;

    // Adjust rootMargin based on screen size
    const isMobile = window.innerWidth <= 768;
    const rootMargin = isMobile ? '400px' : '1000px';

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setCurrentPage(prev => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: rootMargin,
        threshold: 0,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [loading, hasMore]);

  // Fetch more data when page increases
  useEffect(() => {
    //console.log("UseEffect4")
    if (catValue && currentPage !== 1) {
      getSubCatItems(currentPage);
    }
  }, [currentPage]);

  // Filter change
  useEffect(() => {
    console.log(DecorationCatDescriptionData[catValue])
    //console.log("useEffect6")
    if (catValue) {
      setCatalogueData([]);
      setCurrentPage(1);
      getSubCatItems(1); // explicitly fetch again
      if (!currentCategoryContent) {
        setCurrentCategoryContent(DecorationCatDescriptionData[catValue])
      }
    }
  }, [catValue, priceFilter, themeFilter]);



  function addSpaces(subCategory) {
    let result = "";
    for (let i = 0; i < subCategory.length; i++) {
      if (i !== 0 && subCategory[i] === subCategory[i].toUpperCase()) {
        result += " ";
      }
      result += subCategory[i];
    }

    setSelCat(result);
  }

  const getSubCatId = async (subCategory) => {
    try {
      const response = await axios.get(BASE_URL + GET_DECORATION_CAT_ID + subCategory);
      const categoryId = response.data.data?._id;
      if (categoryId) {
        setCatId(categoryId);
        setCatValue(subCategory); // triggers the filter effect
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const getSubCatItems = async (page) => {
    console.log('catId', catId);
    if (!catId) return;
    try {
      setLoading(true);

      let newPriceFilter = priceFilter;
      let newSortFilter = 'asc';

      if (priceFilter === 'lowToHigh') {
        newPriceFilter = '';
        newSortFilter = 'asc';
      } else if (priceFilter === 'highToLow') {
        newPriceFilter = '';
        newSortFilter = 'desc';
      }

      const apiUrl = `${BASE_URL + GET_DECORATION_CAT_ITEM}v2/${catId}?page=${page}&priceFilter=${newPriceFilter}&sortBy=${newSortFilter}&theme=${themeFilter}`;
      console.log("Calling API:", apiUrl);

      const response = await axios.get(apiUrl);

      if (response.status === API_SUCCESS_CODE) {
        const decoratedData = response.data.data.map((item) => {
          const { discount, discountedPrice, discountDifference } = getDiscountedPrice(item.price);
          return {
            ...item,
            rating: getRandomRating(),
            userCount: getRandomNumber(20, 500),
            discountPercentage: discount,
            discountedPrice,
            discountDifference,
          };
        });

        setCatalogueData((prevData) => page === 1 ? decoratedData : [...prevData, ...decoratedData]);
        setHasMore(page < response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error Fetching Data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (subCategory, catValue, product) => {
    const productName = product.name.replace(/ /g, "-");
    dispatch(setState(subCategory, orderType, catValue, product));
    if (city) {
      router.push(`/${city}/balloon-decoration/${catValue}/product/${productName}`);
    }
    else {
      router.push(`/balloon-decoration/${catValue}/product/${productName}`);
    }
  };


  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div style={{ backgroundColor: "#EDEDED" }} className="decCatPage">
      <CategorySeoHead catValue={catValue} />
      <>
        <div style={{ textAlign: "center", justifyContent: "center", alignItems: "center" }}>
          <div style={{ marginTop: "0px" }}>
            <h1 style={{ fontSize: "16px", padding: "14px 0 0", color: '#9252AA' }}>{selCat} {'Balloon Decoration'} </h1>
            <div className="filterdropdown d-flex flex-row flex-lg-row align-items-center justify-content-center gap-3">
              <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}
                style={{ fontSize: "16px", color: 'rgb(157, 74, 147)', padding: "7px 10px", borderWidth: 1, borderColor: "rgb(157, 74, 147)", borderRadius: "5px", marginLeft: "5px", background: 'white' }}>
                {
                  PriceFilter.map((item) => <option value={item.value}>{item.label}</option>)
                }
              </select>

              {/* Theme filter */}
              {(selCat === "Kids Birthday" || selCat === "Kidsbirthday") ? (
                <select value={themeFilter} onChange={(e) => setThemeFilter(e.target.value)}
                  style={{ fontSize: "16px", color: 'rgb(157, 74, 147)', padding: "7px 10px", borderWidth: 1, borderColor: "rgb(157, 74, 147)", borderRadius: "5px", marginLeft: "5px", background: 'white' }}>
                  {themeFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
              ) : null}
            </div>

          </div>
        </div>
        <div  className="px-2 row mt-lg-4" ref={containerRef}>
          {
            catalogueData.length > 0 ? (
              <>
                {catalogueData.map((item, index) => (
                  <div className='col-lg-3 col-6 mb-3'>
                    <DecorationCard
                      item={item}
                      onClick={() => handleViewDetails(subCategory, catValue, item)}
                    />
                  </div>
                ))}
                <div ref={sentinelRef} style={{ height: '1px' }} /> {/* Sentinel at the end */}
                {/* Show bottom skeletons when paginating */}
                {loading && currentPage > 1 && (
                  [1, 2, 3, 4].map((index) => (
                    <div className="col-lg-3 col-6 mb-2" key={`skeleton-${index}`}>
                      <CardSkeleton />
                    </div>
                  ))
                )}
              </>
            ) :
              loading ?
                <div className='row'>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                    <div className="col-lg-3 col-6 mb-2" key={index}>
                      <CardSkeleton />
                    </div>
                  ))}
                </div> :
                (
                  // No items + not loading
                  <div style={{ textAlign: "center", width: "100%", padding: "20px 0" }}>
                    <span>Reach out to our support team for this</span>
                    <span style={{ marginLeft: "10px" }}>
                      <Link className="conactus" href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services" target="_blank">
                        Click here
                      </Link>
                    </span>
                  </div>
                )
          }
        </div>


        <div className="category-content">
          {(currentCategoryContent && currentCategoryContent.length > 0) ? (
            currentCategoryContent
              .slice(0, showAll ? currentCategoryContent.length : 2)
              .map((item, index) => (
                <div key={index} className="category-item">
                  <h1>{item.title}</h1>
                  <div className="item-content" dangerouslySetInnerHTML={{ __html: item.htmlContent }} />
                </div>
              ))
          ) : (
            <p className="no-content-message">No content available for this category.</p>
          )}
          {(currentCategoryContent && currentCategoryContent.length > 2) && (
            <button onClick={toggleShowAll} className="toggle-btn">
              {showAll ? 'See Less' : 'See More'}
            </button>
          )}
        </div>
      </>
    </div>
  );
}

export default DecorationCatPage;