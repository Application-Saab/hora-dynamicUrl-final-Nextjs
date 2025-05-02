// import { useState, useEffect, useCallback } from 'react'
// import './photo.css'
// import Image from 'next/image'
// import axios from 'axios';
// import { useRouter } from 'next/router';
// import photographyBanner from "../../assets/photography-landing.svg";
// import magician from "../../assets/magician.jpg";
// import triditionalPhoto from "../../assets/triditional-photo.jpg";
// import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import whatsppicon from "../../assets/whatsapp-new.webp";
// import Link from 'next/link';
// import Head from 'next/head';

// const Index = () => {
//   const [products, setProducts] = useState([]);
//   const [email, setEmail] = useState("");
//   const [discountPercentage, setDiscountPercentage] = useState(0);
//   const [discountedPrice, setDiscountedPrice] = useState(0);
//   const [discountDifference , setDiscountDifference] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();

//   const handleSubmit = useCallback((e) => {
//     e.preventDefault();
//     console.log("Email submitted:", email);
//   }, [email]);

//   const getItemInclusion = (inclusion) => {
//     if (!Array.isArray(inclusion) || inclusion.length === 0) {
//       return null;
//     }
//     const htmlString = inclusion[0];
//     const withoutTags = htmlString.replace(/<[^>]*>/g, '');
//     const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, ' ');
//     const statements = withoutSpecialChars.split('<div>');
//     const inclusionItems = statements.flatMap(statement => statement.split("-").filter(item => item.trim() !== ''));
//     const inclusionList = inclusionItems.map((item, index) => (
//       <li key={index} className="inclusionstyle">
//         {index + 1}. {item.trim()}
//       </li>
//     ));

//     return (
//       <div>
//         <ul className="work-duration">
//           {inclusionList}
//         </ul>
//       </div>
//     );
//   };

//   const getDiscountedPrice = (price) => {
//     let discount;
//     if (price < 3000) {
//       discount = 20;
//     } else if (price >= 3000 && price <= 5000) {
//       discount = 27;
//     } else {
//       discount = 35;
//     }
//     const discountedPrice = price * (1 + discount / 100);
//     const discountDifference = Math.abs(price - discountedPrice);
//     return { discount, discountedPrice, discountDifference };
//   };

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         'https://horaservices.com:3000/api/photography/searchByTag/66c96b4e22ed47b72117e09a'
//       );
//       const productData = response.data.data.map(item => {
//         const { discount, discountedPrice, discountDifference } = getDiscountedPrice(item.price);
//         return {
//           ...item,
//           discountPercentage: discount,
//           discountedPrice,
//           discountDifference
//         };
//       });
//       setProducts(productData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const sendToCheckoutPage = (product) => {
//     // window.dataLayer = window.dataLayer || [];
//     // window.dataLayer.push({
//     //   event: "book_now_click",
//     //   product_name: product.name,
//     // });
//     console.log("Data sent to dataLayer:",product.name);
//     router.push({
//       pathname: `/photography-page/${product.name}`,
//       query: {
//         from: window.location.pathname,
//         product: JSON.stringify(product),
//         // totalAmount: product.price,
//       }
//     });
//   };

//   return (
//     <>
//     <Head>
//         <title>Hora: Professional Photographers starting @‌3600 Rs</title>
//     <meta name="description" content="Find the best photographers in your city. Check pricing, portfolio and reviews. Photography for every event. Tradional Photography, Candid Photography & Videography photoshoots for your big day. Photography for Birthday, Photography for Baby Shower, Photography for MaternityPhotography for New Born, Photography for Engagement, Photography for House warming, Photography for Pre-wedding, Photography for Wedding, Photography for Coorporate event, Photography for Portfolio Shoot, Photography for Naming Ceremony, Photography for Family Shoot, Photography for Post Wedding, Photography for Upanayana Ceremony, Photography for Anniversary, Photography for Anaprashaman, Photography for Cradle Ceremony, Photography for E-commerse photoshoot, Photography for Photo- restoration, Photography for Shastipurthi, Photography for Christian wedding, Photography for Muslim Wedding, Photography for Puberty function, Photography for Drone Photography, Photography for Corporate Video Production, Photography for Personalized coffee mug printing Service, Photography for Freelance photographers, Photography for Elements Resort Pre-wedding Shoot, Photography for Fashion shoot, Photography for Baby’s backyard Studio, Photography for Holy Communion Baptism Photoshoot Portfolio" />
//     <meta name="keywords" content="Personal chef, private chef to cook in home in India, home chef, book a cook near you, chef at home, Private cook in Mumbai, Book a cook for home near you, Hire Chef in Bangalore, Private Chef in Delhi, Catering service, balloon, decoration, celebration, party, birthday, anniversary, decorator, candle light dinner,  surprises, couples, bouquets , online caterers, catering services, best caterers, birthday party catering, birthday caterers, party catering, home catering, corporate catering, caterers for small parties, wedding caterers" />

//     <meta property="og:title" content="Hora: Professional Photographers starting @‌3600 Rs" />
//     <meta property="og:description" content="Find the best photographers in your city. Check pricing, portfolio and reviews. Photography for every event. Tradional Photography, Candid Photography & Videography photoshoots for your big day. Photography for Birthday, Photography for Baby Shower, Photography for MaternityPhotography for New Born, Photography for Engagement, Photography for House warming, Photography for Pre-wedding, Photography for Wedding, Photography for Coorporate event, Photography for Portfolio Shoot, Photography for Naming Ceremony, Photography for Family Shoot, Photography for Post Wedding, Photography for Upanayana Ceremony, Photography for Anniversary, Photography for Anaprashaman, Photography for Cradle Ceremony, Photography for E-commerse photoshoot, Photography for Photo- restoration, Photography for Shastipurthi, Photography for Christian wedding, Photography for Muslim Wedding, Photography for Puberty function, Photography for Drone Photography, Photography for Corporate Video Production, Photography for Personalized coffee mug printing Service, Photography for Freelance photographers, Photography for Elements Resort Pre-wedding Shoot, Photography for Fashion shoot, Photography for Baby’s backyard Studio, Photography for Holy Communion Baptism Photoshoot Portfolio" />
// </Head>
//       <div>
//         <div className="party-services homeslider">
//           <div className="home-slider-inner">
//             <img src="../../../assets/photography-landing.svg" alt="Decoration services, Balloon decoration , decoration for birthday party" />
//           </div>
//         </div>
//       </div>

//       <div className="featured-works">
//         <div className="works-container products">
//           <div className="section-small-header-sec">
//             Kids, Birthday, House Warming, Naming Ceremony, Corporate,
//             Baby Shower, New Born baby, Maternity Shoot
//           </div>
//           <div className="section-small-header">Services: Less than 100 Guest</div>
//           <img
//             src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
//             alt=""
//             className="section-separator"
//           />

//           {loading ? (
//               <div className="custom-spinner">
//             <div className="spinner-border" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <div style={{ color: "#9252AA", textAlign: "center" }}>
//               <h4 style={{ fontSize:"16px"}}>Loading Products...</h4>
//             </div>
//             </div>
//           ) : (
//             <div className='sec-prod'>
//               {products.map((work, index) => (
//                 <div className="work-item" key={index}>
//                   <div className="work-card-info">
//                     <div className="work-details">
//                       <h5 className="work-title">{work.name}</h5>
//                       <p className="Prefred-occ">
//                         <span>₹ {work.price}</span>
//                         <span> ₹{Math.floor(work.discountedPrice.toFixed(2))}</span>
//                         <span className='photograpty-disconut'>
//                           ₹ {work.discountDifference.toFixed(0)} off
//                         </span>
//                       </p>
//                       <b className="inclusion-heading">Inclusion:</b>
//                       <div>{getItemInclusion(work.inclusion)}</div>
//                       <p className="work-duration">
//                         <b>Duration:</b> 2-4 Hours (After 4 hours, 650 Rs extra per hour)
//                       </p>
//                       <button onClick={() => sendToCheckoutPage(work)} className="photograpy-ook-now">Book Now</button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="works-container products preweddng">
//         <div className="section-small-header">Wedding and preWedding Services</div>
//         <Link href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20wedding%20photography%20&%20pPrewedding%20services" target="_blank">
//           <div className="section-small-header-sec">Please connect with us on Whatsapp</div>
//         </Link>
//       </div>
//     </>
//   );
// };

// export default Index;



import { useState, useEffect, useCallback } from 'react'
import './photo.css'
import Image from 'next/image'
import axios from 'axios';
import { useRouter } from 'next/router';
import photographyBanner from "../../assets/photography-landing.svg";
import magician from "../../assets/magician.jpg";
import triditionalPhoto from "../../assets/triditional-photo.jpg";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import whatsppicon from "../../assets/whatsapp-new.webp";
import Link from 'next/link';


const index = () => {
  const [products, setProducts] = useState([]); // State to store product
  const [email, setEmail] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0); // State for the discount percentage
  const [discountedPrice, setDiscountedPrice] = useState(0); // State for the discounted price
  const [discountDifference , setDiscountDifference] = useState(0)
   
  const router = useRouter();
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  }, [email]);

  const getItemInclusion = (inclusion) => {
      if (!Array.isArray(inclusion) || inclusion.length === 0) {
        return null;
      }
      const htmlString = inclusion[0];
      const withoutTags = htmlString.replace(/<[^>]*>/g, ''); // Remove HTML tags
      const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, ' '); // Replace &# sequences with space
      const statements = withoutSpecialChars.split('<div>');
      const inclusionItems = statements.flatMap(statement => statement.split("-").filter(item => item.trim() !== ''));
      const inclusionList = inclusionItems.map((item, index) => (
        <li key={index} className="inclusionstyle">
          {index + 1}{'.'} {item.trim()}
        </li>
      ));

      return (
        <div>
          <ul class="work-duration">
            {inclusionList}
          </ul>
        </div>
  
      );
    };

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
      const discountDifference =   Math.abs(price - discountedPrice);;
      return { discount, discountedPrice , discountDifference }; // Return both discount percentage and discounted price
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        'https://horaservices.com:3000/api/photography/searchByTag/66c96b4e22ed47b72117e09a'
      );
      const productData = response.data.data.map(item => {
        const { discount, discountedPrice , discountDifference} = getDiscountedPrice(item.price); // Destructure the return value
        return {
            ...item,
            discountPercentage: discount, // Add discount percentage
            discountedPrice: discountedPrice ,// Add discounted price
            discountDifference: discountDifference
        };
    });
    setProducts(productData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setProducts([]); // Set to empty array in case of an error
    }
  }, []);
  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);
  const sendToCheckoutPage = (product) => {
    window.dataLayer = window.dataLayer || [];
     window.dataLayer.push({
       event: "book_now_click",
       product_name: product.name,
     });
     console.log("Data sent to dataLayer:");
    router.push({
      pathname: 'photography-checkout',
      query: {
        from: window.location.pathname,
        product: JSON.stringify(product),
        totalAmount: product.price,
      }
    });
  };
  return (<>
    <div>
 <div className="party-services homeslider">
      <div className="home-slider-inner">
                <img src="../../../assets/photography-landing.svg" alt="Decoration services, Balloon decoration , decoration for birthday party"
                 />
              </div>
          </div>
    </div>
    <div className="featured-works">
      <div className="works-container products">
      <div className="section-small-header-sec">Kids, Birthday, House Warming, Naming Ceremony, Corporate,
      Baby Shower, New Born baby, Maternity Shoot</div>
        <div className="section-small-header">  Services: Less than 100 Guest</div>
        <img
          src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
          alt=""
          className="section-separator"
        />
        <div className='sec-prod'>
          {products.map((work, index) => (
            <div className="work-item" key={index}  >
              <div className="work-card-info">
                <div className="work-details">
                  <h5 className="work-title">{work.name}</h5>
                  <p className="Prefred-occ">
                    <span>₹ {work.price}</span><span> ₹{Math.floor(work.discountedPrice.toFixed(2))} </span>
                    <span className='photograpty-disconut'>
                    ₹ {work.discountDifference.toFixed(0)} {'off'} 
                  </span>  
                  </p>
                  <b class="inclusion-heading">Inclusion:</b>
                  <div> {getItemInclusion(work.inclusion)}</div>
                  <p className="work-duration">
                    <b>Duration:</b> 2-4 Hours (After 4 hours, 650 Rs extra per hour)
                  </p>
                  {/* <button >View Sample Work</button> */}
                  <button onClick={() => sendToCheckoutPage(work)} class="photograpy-ook-now">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>

    <div className="works-container products preweddng">
        <div className="section-small-header">Wedding and preWedding Services</div>
       
        <Link href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20wedding%20photography%20&%20pPrewedding%20services" target="_blank">
        <div className="section-small-header-sec">Please connect with us on Whatsapp </div> 
        </Link>

        
      
    </div>



  </>)
}



export default index;
