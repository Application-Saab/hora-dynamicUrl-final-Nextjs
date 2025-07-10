import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from "next/router";
import Head from 'next/head';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons"
import { BASE_URL, GET_DECORATION_CAT_ID, GET_DECORATION_CAT_ITEM, API_SUCCESS_CODE } from '../../../../../utils/apiconstants';
import { CardSkeleton } from "../../../../../components/CardSkeleton";
import { getDecorationCatOrganizationSchema } from "../../../../../utils/schema";
import { setState } from '../../../../../actions/action';
import Image from "next/image";
import Link from "next/link";
import { decCat } from "@/utils/decorationCategories"; // 🔁 make sure this path is correct
import '../../../../../css/decoration.css';

const DecorationCatPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { city, catValue, locality } = router.query;
  const [orderType, setOrderType] = useState(1);
  const [catId, setCatId] = useState("");
  const [loading, setLoading] = useState(true);
  const [catalogueData, setCatalogueData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const hasCityPageParam = !!city;

  // 🔁 Use decCat lookup for exact match
  const matched = decCat.find(item => item.catValue === catValue);
  const subCategory = matched?.subCategory || '';
  const selCat = matched?.name || '';
  const imgAlt = matched?.imgAlt || 'default alt text';

  const schemaOrg = getDecorationCatOrganizationSchema(catValue);
  const scriptTag = JSON.stringify(schemaOrg);

  const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomRating = () => (Math.random() * (4.8 - 4.1) + 4.1).toFixed(1);

  useEffect(() => {
    setCatId("");
    setCatalogueData([]);
    setLoading(true);
  }, [catValue]);

  useEffect(() => {
    if (subCategory) {
      getSubCatId(subCategory);
      window.addEventListener('scroll', handleScroll);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [subCategory]);

  const handleScroll = () => {
    const filterElement = document.querySelector('.filterdropdown');
    if (filterElement) {
      filterElement.classList.toggle('sticky', window.scrollY > 50);
    }
  };

  const getSubCatId = async (subCategory) => {
    try {
      const response = await axios.get(BASE_URL + GET_DECORATION_CAT_ID + subCategory);
      const categoryId = response.data.data?._id;
      setCatId(categoryId);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    if (catId) {
      getSubCatItems();
    }
  }, [catId]);

  const getSubCatItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL + GET_DECORATION_CAT_ITEM + catId);
      if (response.status === API_SUCCESS_CODE) {
        const decoratedData = response.data.data.map(item => ({
          ...item,
          rating: getRandomRating(),
          userCount: getRandomNumber(20, 500)
        }));
        setCatalogueData(decoratedData);
      }
    } catch (error) {
      console.log('Error Fetching Data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = catalogueData.filter(item => {
    let priceCondition = true;
    let themeCondition = true;

    if (priceFilter === "under2000") priceCondition = item.price < 2000;
    else if (priceFilter === "2000to5000") priceCondition = item.price >= 2000 && item.price <= 5000;
    else if (priceFilter === "above5000") priceCondition = item.price > 5000;

    if (themeFilter !== "all") {
      const formattedFilter = themeFilter.toLowerCase().split('-')[0];
      const itemName = item.name.toLowerCase().split('-')[0];
      themeCondition = itemName.includes(formattedFilter);
    }

    return priceCondition && themeCondition;
  });

  const handleViewDetails = (subCategory, catValue, product) => {
    const productName = product.name.replace(/ /g, "-");
    dispatch(setState(subCategory, orderType, catValue, product));
    const path = hasCityPageParam
      ? `/${city}/${locality}/balloon-decoration/${catValue}/product/${productName}`
      : `/balloon-decoration/${catValue}/product/${productName}`;
    router.push(path);
  };

  const themeFilters = [
    { label: 'Select Design', value: 'all' },
    { label: 'Astronaut space theme', value: 'Astronaut-space' },
    { label: 'Avengers theme', value: 'Avengers' },
    { label: 'Boss baby theme', value: 'Boss' },
    { label: 'Baby shark theme', value: 'shark' },
    { label: 'Barbie theme', value: 'Barbie' },
    { label: 'Cocomelon Theme', value: 'Cocomelon' },
    { label: 'Car Theme', value: 'car' },
    { label: 'Circus Theme', value: 'Circus' },
    { label: 'Dinosaur Theme', value: 'Dinosaur' },
    { label: 'Elsa Theme', value: ' Elsa' },
    { label: 'Flamingo Theme', value: 'Flamingo' },
    { label: 'Jungle Theme', value: 'Jungle' },
    { label: 'Kitty Theme', value: 'Kitty' },
    { label: 'Lion King', value: 'Lion' },
    { label: 'Mickey Mouse Theme', value: 'Mickey-Mouse' },
    { label: 'Mickey and Minnie Theme', value: 'Mickey-Minnie' },
    { label: 'Minecraft Theme', value: 'Minecraft' },
    { label: 'Mermaid Theme', value: 'Mermaid' },
    { label: 'Pokemon and Pikachu theme', value: 'Pikachu-Pokemon' },
    { label: 'Princess Theme', value: 'Princess' },
    { label: 'Panda Theme', value: 'Panda' },
    { label: 'Traffic Theme', value: 'Traffic' },
    { label: 'Super dogs theme', value: 'dogs' },
    { label: 'Super Hero theme', value: 'Hero' },
    { label: 'Sport Football theme', value: 'Football' },
    { label: 'Unicorn Theme', value: 'Unicorn' },
  ];

  const trimText = (text) => (text.length > 60 ? text.slice(0, 60) + '...' : text);

  const PageTitle = () => {
    if (catValue === "kids-birthday-decoration") return "Kids' Birthday Balloon Decoration by Professionals Decorators, Starting at ₹1199";
    if (catValue === "birthday-decoration") return "Birthday Balloon Decoration at Home by Professionals  Decorators, Starting at ₹1199";
    if (catValue === "anniversary-decoration") return "Anniversary Decorations with Balloon & Rose Petals, Starting at ₹1199";
    if (catValue === "first-night-decoration") return "First Night Decorations with Balloon & Rose Petals, Starting at ₹1199";
    if (catValue === "baby-shower-decoration") return "Baby Shower with Latest Designs by Professionals  Decorators Starting at ₹1199";
    if (catValue === "welcome-baby-decoration") return "Baby Welcome Decoration at home by Professionals  Decorators, Starting at ₹1199";
    if (catValue === "haldi-mehendi-decoration") return "Haldi Decoration with Latest Designs starting at ₹3000";
    return "Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199";
  };

  const getPageMetaDescription = () => {
    if (catValue === "kids-birthday-decoration") return "At Hora, 🎉Explore popular themes like jungle 🌴, Cocomelon 🍉, candy 🍭, unicorn 🦄...";
    if (catValue === "birthday-decoration") return "At Hora, 🎈 Explore our wide range of balloon and flower decorations for birthday parties...";
    if (catValue === "anniversary-decoration") return "🎉 Explore top-notch anniversary decoration designs and book directly from our website 💖...";
    if (catValue === "first-night-decoration") return "🌟 Explore our selection of elegant decoration designs for your first night event 💖...";
    if (catValue === "haldi-mehendi-decoration") return "Brighten up your Haldi ceremony with vibrant and elegant décor! 🌼✨ Explore...";
    return "Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199";
  };

  return (
    <div style={{ backgroundColor: "#EDEDED" }} className="decCatPage">
      <Head>
        <title>{PageTitle()}</title>
        <meta name="description" content={getPageMetaDescription()} />
        <meta name="keywords" content="Balloon and Flower Decoration @999" />
        <meta property="og:title" content="Balloon and Flower Decoration by Professional Decorators" />
        <meta property="og:description" content="Celebrate Anniversary, Birthday & other Occasions..." />
        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
        <meta property="og:url" content={`https://horaservices.com/balloon-decoration/${catValue}`} />
        <script type="application/ld+json">{scriptTag}</script>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
      </Head>

      <>
        <div style={{ textAlign: "center", justifyContent: "center", alignItems: "center" }}>
          <div style={{ marginTop: "0px" }}>
            <h1 style={{ fontSize: "16px", color: "#000", padding: "14px 0 0", color: '#9252AA' }}>{selCat} {'Balloon Decoration'} </h1>
            <p style={{ padding: "0px 0px 16px", margin: "0px" }} className="subheading">{trimText('Balloon Decoration and Room Decoration Services for Anniversary, Birthdays, Kids Parties, Baby Showers and more!')}</p>
            <div style={{ marginBottom: "15px" }} className="filterdropdown d-flex flex-column flex-lg-row align-items-center justify-content-center gap-3" >
              <div className="d-flex gap-lg-4 gap-2">
                <div className="py-1 rounded-5 d-flex justify-content-center align-itmes-center filter-tag" style={priceFilter === 'all' ? { backgroundColor: '#9252AA', cursor: 'pointer' } : { backgroundColor: '#D9D9D9', cursor: 'pointer' }} onClick={() => setPriceFilter('all')}>
                  <p className="m-0 p-0 fw-bold filter-price-tag" style={priceFilter === 'all' ? { color: "#fff" } : { color: '#9252AA' }}>All</p>
                </div>
                <div className="py-1 rounded-5 d-flex justify-content-center align-itmes-center filter-tag" style={priceFilter === 'under2000' ? { backgroundColor: '#9252AA', cursor: 'pointer' } : { backgroundColor: '#D9D9D9', cursor: 'pointer' }} onClick={() => setPriceFilter('under2000')}>
                  <p className="m-0 p-0 fw-bold filter-price-tag" style={priceFilter === 'under2000' ? { color: "#fff" } : { color: '#9252AA' }}>Under ₹ 2000</p>
                </div>
                <div className="py-1 rounded-5 d-flex justify-content-center align-itmes-center filter-tag" style={priceFilter === '2000to5000' ? { backgroundColor: '#9252AA', cursor: 'pointer' } : { backgroundColor: '#D9D9D9', cursor: 'pointer' }} onClick={() => setPriceFilter('2000to5000')}>
                  <p className="m-0 p-0 fw-bold filter-price-tag" style={priceFilter === '2000to5000' ? { color: "#fff" } : { color: '#9252AA' }}>₹ 2000 - ₹ 5000</p>
                </div>
                <div className="py-1 rounded-5 d-flex justify-content-center align-itmes-center filter-tags" style={priceFilter === 'above5000' ? { backgroundColor: '#9252AA', cursor: 'pointer' } : { backgroundColor: '#D9D9D9', cursor: 'pointer' }} onClick={() => setPriceFilter('above5000')}>
                  <p className="m-0 p-0 fw-bold filter-price-tag" style={priceFilter === 'above5000' ? { color: "#fff" } : { color: '#9252AA' }}>Above ₹ 5000</p>
                </div>
              </div>

              {/* Theme filter */}
              {selCat === "Kids Birthday" ? <select value={themeFilter} onChange={(e) => setThemeFilter(e.target.value)}
                style={{ fontSize: "16px", color: 'rgb(157, 74, 147)', padding: "7px 10px", borderWidth: 1, borderColor: "rgb(157, 74, 147)", borderRadius: "5px", marginLeft: "5px" }}>
                {themeFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select> : null}
            </div>
          </div>
        </div>
        <div style={styles.decContainer} className="decContainer">
          {loading ? ([1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <div className="decimagecontainer" key={index} style={styles.imageContainer}>
              <CardSkeleton />
            </div>
          ))) :
            (
              (filteredData.length > 0) ? (
                filteredData.map((item, index) => (
                  <div
                    key={item._id}
                    style={{
                      ...styles.imageContainer,
                      cursor: "pointer",
                      ...(hoveredIndex === index && styles.zoomedContainer) // Apply zoom effect when hovered
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => handleViewDetails(subCategory, catValue, item)}
                    className="decimagecontainer"
                  >
                    <div style={{ position: "relative" }}>
                      <Image src={`https://horaservices.com/api/uploads/${item?.featured_image}`} alt={imgAlt} style={styles.decCatimage} width={300} height={300} />
                      {/* Watermark */}
                      <div style={{ position: "absolute", bottom: 20, right: 20, borderRadius: "50%", padding: 10 }}>
                        <span style={{ color: "rgba(157, 74, 147, 0.6)", fontWeight: "600" }}>Hora</span>
                      </div>
                    </div>
                    {/* End of Watermark */}
                    <div className='px-2 py-2'>
                      <p
                        style={{
                          marginHorizontal: 3,
                          textAlign: 'left',
                          fontWeight: '600',
                          fontSize: "16px",
                          marginTop: "4px",
                          color: '#9252AA',

                          lineHeight: "18px",
                          marginBottom: "0px",
                          textAlign: "left",
                        }}
                        className="pro_name"
                      >
                        {item.name}
                      </p>
                      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "top" }} className="pri_details">
                        <div style={{ flexDirection: 'row', alignItems: 'left', justifyContent: 'space-between' }} className="pro_price">
                          <p style={{
                            color: '#9252AA',
                            fontWeight: '700',
                            fontSize: 17,
                            textAlign: "left",
                            margin: "10px 0px 7px",
                          }}
                            className="pro_price"
                          > ₹ {item.price}</p>
                        </div>
                        <div className="d-flex align-items-center rating-sec">
                          <p className="m-0 p-0" style={{ fontWeight: '500', fontSize: 17, margin: "0px", color: '#9252AA' }}>{item.rating}<span className='px-1 m-0 py-0 img-fluid' style={{ color: '#ffc107' }}><FontAwesomeIcon style={{ margin: 0, height: "14px" }} icon={faStar} /></span></p>
                          <p style={{ color: '#9252AA', fontWeight: '600', fontSize: 17, margin: "0px", padding: "0 0 0 2px" }}>({item.userCount})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", width: "100%", padding: "20px 0" }}>
                  <span>Reach out to our support team for this</span>
                  <span style={{ marginLeft: "10px" }}>
                    <Link className="conactus" href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services" target="_blank">Click here</Link>
                  </span>
                </div>
              )
            )
          }
          |<div>
            {/* <div>
                      {
                         filteredData.map((item, index) => (
                         
                          <url>
                            <loc>
                            {`https://horaservices.com/balloon-decoration/${catValue}/product/${item.name}`}
                            </loc>
                            <priority>1.00</priority>
                        </url>
                         )
                      )}
                   
                    </div> */}
          </div>
        </div>
      </>
    </div>
  );
}

const styles = {
  decContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    display: "inline-flex",
    flexWrap: "wrap",
  },
  decCatimage: {
    width: "100%",
    height: "300px",
    borderRadius: "5px",
    objectFit: "cover",
  },
  imageContainer: {
    position: "relative",
    width: '270px',
    backgroundColor: "#fff",
    marginBottom: 40,
    boxShadow: "0 6px 16px 0 rgba(0,0,0,.14)",
    borderRadius: "5px",
    overflow: "hidden", // Ensure the image stays within the container
    transition: "transform 0.3s ease-in-out", // Smooth transition effect for zoom
    margin: "10px 12px 20px",
    padding: "6px 5px 10px",
  },
  zoomedContainer: {
    transform: "scale(1.1)", // Scale the container by 10% on hover
  },
  itemName: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "500",
    color: "#444",
    padding: "10px",
  },
  priceContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    fontSize: "17px",
    fontWeight: "500",
    color: "#444",
    margin: "0",
  },
};

export default DecorationCatPage;