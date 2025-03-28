import React, { useState, useEffect } from "react";
import Head from 'next/head';
import axios from 'axios';
import { BASE_URL, GET_DECORATION_CAT_ID, GET_DECORATION_CAT_ITEM } from '../../../../utils/apiconstants';
import DecorationLandingSlider from '@/components/DecorationLandingSlider';
import { getDecorationOrganizationSchema, getProductFAQSchema } from '../../../../utils/schema';
import { setState } from '../../../../actions/action';
import { useRouter } from "next/router";
import Image from "next/image";
import { useDispatch } from "react-redux";
import '../../../../css/decoration.css'
import Link from "next/link";
import '../../../../app/globals.css';
import FAQs from '@/components/FAQs';

const Decoration = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  let { city, locality } = router.query;
  if (city) {
    city = city.charAt(0).toUpperCase() + city.slice(1);
  }
  if (locality) {
    locality = locality.charAt(0).toUpperCase() + locality.slice(1);
  }
  const schemaOrg = getDecorationOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  const faqSchema = getProductFAQSchema(city);
  const faqSchemaScriptTag = JSON.stringify(faqSchema);

  const hasCityPageParam = city ? true : false;
  const [showMore, setShowMore] = useState(false);
  const decCat = [
    { id: '2', image: "https://horaservices.com/api/uploads/Birthday_dec_cat.webp", name: 'Birthday', subCategory: "Birthday", catValue: "birthday-decoration", imgAlt: "A Gorgeous Candy Birthday Decoration Surprise!" , link:"birthday-decoration"},
    { id: '3', image: "https://horaservices.com/api/uploads/first_night_cat_dec.webp", name: 'First Night', subCategory: "FirstNight", catValue: "first-night-decoration", imgAlt: "Add extra happiness quotient to your wedding night with our exclusive décor package" , link:"first-night-decoration"},
    { id: '4', image: "https://horaservices.com/api/uploads/aniversary_Cat_Dec.webp", name: 'Anniversary', subCategory: "Anniversary", catValue: "anniversary-decoration", imgAlt: "Immerse yourself in a world of romance with our mesmerizing anniversary decorations.",link :"anniversary-decoration" },
    { id: '5', image: "https://horaservices.com/api/uploads/kids_birthday_decoration.webp", name: 'Kids Birthday', subCategory: "KidsBirthday", catValue: "kids-birthday-decoration", imgAlt: "Flutter into a world of whimsy with our exclusive Whimsical Flutter-themed Welcome Baby Decorations." , link:"kids-birthday-decoration"},
    { id: '6', image: "https://horaservices.com/api/uploads/baby-shower-dec-cat.webp", name: 'Baby Shower', subCategory: "BabyShower", catValue: "baby-shower-decoration", imgAlt: "Celebrate the transformation into motherhood with Our Gilded Baby Shower Decorations." ,link:"baby-shower-decoration"},
    { id: '7', image: "https://horaservices.com/api/uploads/welcome_baby_dec.webp", name: 'Welcome Baby', subCategory: "WelcomeBaby", catValue: "welcome-baby-decoration", imgAlt: "A Pastel Theme Oh Baby Decor for your Baby Shower Celebrations!" ,link:"welcome-baby-decoration" },
    { id: '8', image: "https://horaservices.com/api/uploads/preminumdecor.webp	", name: 'premium Decoration', subCategory: "PremiumDecoration", catValue: "premium-decoration", imgAlt: "Birthday party decoration ideas for adults" ,link:"premium-decoration" },
    { id: '9', image: "https://horaservices.com/api/uploads/Balloon-B-new.webp", name: 'Ballon Bouquets', subCategory: "BallonBouquets", catValue: "balloon-bouquets-decoration", imgAlt: "Balloon Bouquet" , link:"balloon-bouquets-decoration" },
    { id: '10', Image: "", name: "Haldi Event", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Haldi Event" , link:"haldi-mehendi-decoration"},
    { id: '11', Image: "", name: "Mehendi Event", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Mehendi Event" ,link:"haldi-mehendi-decoration" },
    { id: '11', Image: "", name: "Bachelorette Decoration", subCategory: "bachelorette", catValue: "bachelorette-decoration", imgAlt: "Bachelorette" ,link:"bachelorette-decoration" },
    { id: '11', Image: "", name: "proposal decorations", subCategory: "Proposal-Decoration", catValue: "Proposal-Decorations", imgAlt: "proposal decorations" ,link:"bachelorette-decoration" },
  
  ];


  const getCatData = async (subCategory) => {
    try {
      const response = await axios.get(BASE_URL + GET_DECORATION_CAT_ID + subCategory);
      const categoryId = response.data.data._id;
      const result = await axios.get(BASE_URL + GET_DECORATION_CAT_ITEM + categoryId);
      setCatalogueData(result.data.data);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    decCat.forEach((item) => {
      getCatData(item.subCategory); // Fetch catalogue data for each subcategory
    });
  }, []);
  const faqDataDecore = [
    {
      question: `What is the cost of Anniversary Balloon Decoration in ${city}?`,
      answer: `The cost of our Anniversary Decoration services depends on various factors such as the type of decoration, the size of the event, and the location. We offer packages starting from Rs.1200 for a simple yet elegant Anniversary Decoration.`,
    },
    {
      question: `How can I arrange for Balloon Decoration at Home in ${city} for any celebration?`,
      answer: `Hora Services makes it simple to bring the joy of Balloon Decoration to your doorstep for any celebration in ${city}. Our website serves as your guide to planning memorable parties from the comfort of your own home. Choose the "Balloon Decoration at Home" option, enter the event details, modify your requirements, and complete the simple booking process. Our skilled team will handle all of the details, ensuring that your celebration is both seamless and extraordinary.`,
    },
    {
      question: `Areas we provide our services across ${city}`,
      answer: `We provide decorations in all areas of ${city} - LOCALITIES.`,
    },
    {
      question: `Our Services in ${city}`,
      answer: `We provide various decoration services in all areas of ${city}. Our offerings include balloon decorations, flower decorations, and more for different events such as birthdays, anniversaries, baby showers, and more.`,
    },
    {
      question: `Do you provide Balloon Room Decoration Services in ${city}?`,
      answer: `Yes, we have a huge range of Room Balloon Decoration services in the vibrant city of ${city}. Our skilled and well-experienced team can beautifully transform any room with balloons as per your occasion and your mood of celebration.`,
    },
    {
      question: `Do you offer same-day bookings for Birthday Decoration at Home in ${city}?`,
      answer: `Yes, we understand that plans can change, and sometimes you need decorations on short notice. At HORA, we strive to accommodate same-day birthday decoration bookings whenever possible. Contact our customer support team, and we'll do our best to make your event special, even on short notice.`,
    },
    {
      question: `Can you provide me some budget-friendly suggestions for 1st Birthday Party Decorations?`,
      answer: `Of course! Consider themes for a first birthday such as Jungle Theme, Princess or Barbie Theme, Unicorn Theme, Space Theme, and many more. For wonderful photo options, add bright colors, balloons, customized banners, and a cake smash setup. Visit our website and explore a wide range of decoration options for the first birthday.`,
    },
    {
      question: `Decorator near me in ${city}`,
      answer: `We offer a wide range of decoration services, including balloon and flower decorations, for various events such as birthdays, anniversaries, and baby showers in ${city}.`,
    },
  ];
  const otherDecorecategory = [
    { text: "Birthday Decoration" },
    { text: "Baby Shower Decoration" },
    { text: "Baby Welcome Decoration" },
    { text: "First Night Decoration" },
    { text: "Kids Birthday Decoration" },
    { text: "Anniversary Decoration" },
    { text: "Candle Light Dinner" },
    { text: "Car Decoration" },
    { text: "Naming Ceremony Decoration" },
    { text: "Terrace Decoration" },
    { text: "Proposal Decoration" },
    { text: "Bride-to-be Decoration" },
    { text: "Cabana Decoration" },
    { text: "Haldi Decoration" },
    { text: "Balloon Decoration" },
    { text: "Office Decoration" },
    { text: "Engagement Ring Platter" },
  ]
  const ballonDecoreCityDescription = [
    `Home Balloon Decoration in ${city?.toUpperCase()} for Birthday Party celebrations`,
    `Decorations and Gifts can make anybody happy. Who doesn’t love getting pampered? Everybody does, though all may not ask for it. A birthday is an occasion to rejoice with our friends and loved ones. These days’ birthday themes and decorations seem to play a major role in any birthday party. Balloons are a necessary thing when it comes to decorating for birthday parties not because Online balloon decoration is cheap and colorful but because balloon decoration adds warm fuzzies to the party which creates a blissful moment in the hearts of people. Balloons are party highlighters! They not only brighten up birthday parties but also bring the group together in balloon bursting activities. Balloon birthday themes have always been fun and easy. The bright and colorful balloons are an ideal choice for any birthday party. When people hear the name of balloons decoration, they anticipate a happy moment to come which makes them feel extremely happy from within. It enlightens the festive mood with its elegant design, color and pattern. There are so many things you can do to create the best balloon decoration with the help of the best party planner in Bangalore or balloon decorators in ${city?.toUpperCase()}. These are the things you can do to make your birthday parties memorable.`,
    `Birthday Balloon Decoration in ${city?.toUpperCase()}`,
    `Birthdays are memorable occasions for all of us. Who does not love celebrating their birthday, kids love gifts, youngsters love to get their dream stuff and grown-ups love to get all the attention and special treatment by their near and dear ones, birthday is the happiest day of one’s life. This day not only makes the birthday boy or girl happy but also injects the family members with cheerful vibes. That’s the reason everyone is so excited to celebrate birthdays. And this is the sole reason that in India and across the globe, birthdays are no less than festivals. So celebrate your birthday with beautiful balloon decoration at home in ${city?.toUpperCase()}. Are you looking for the Best Balloon decorator in ${city?.toUpperCase()}? You want to opt for Professional balloon decoration services but at the same time want it to be budget-friendly? Our on-site balloon decorating service in Bangalore by HORA has created a wow and stunning backdrop for your corporate as well as personal events. The variety of balloon designs includes Backdrop, Ring Decoration, Sequence photo booth, and so on. If you want to introduce fun to your events and are looking for some unique assortment of party decoration then book the Best Balloon Decoration in ${city?.toUpperCase()} from us.`,
    `Online Balloon Decoration Shop in ${city?.toUpperCase()}`,
    `Organizing and managing an event yourself can be tedious and, not to mention, time-consuming. With everyday activities becoming simpler, the fun-filled episodes in your life have become even more precious. Celebrating them in a fashionable and classy manner is what makes the best memories. Whenever people gather, regardless of their number or purpose, someone needs to handle the intricacies to ensure the celebration is a success. The vitality of time, cooperation, and every other aspect that surrounds the planning of an event stands the test of time. With a fresh team of skilled, creative, and motivated professionals, HORA offers the coolest event planning services in more than 100+ cities in India. Being young in this business, we bring to you a blend of innovation and style that’s simply new. Our focus is to provide you with the latest trends and to create new trends. Taking your personal preferences into consideration and mixing it with new-age design layouts and themes, our primary goal is to help you create amazing memories to cherish for a lifetime. So what are you waiting for? Book your favorite occasion from the best balloon decoration shop near me in ${city?.toUpperCase()}.`,
    `Choose HORA for all your celebrations and parties at the cheapest rates`,
    `Get all your decoration requirements under one roof on HORA, from Baby Shower decoration to Welcome Baby decorations at home in ${city?.toUpperCase()}. We specialize in creating dreamy and delightful setups for various events, ensuring every moment is special and memorable.`,
    `Decorator near me in ${city?.toUpperCase()}, Balloon Decorator near me in ${city?.toUpperCase()}, Flower Decorator near me in ${city?.toUpperCase()}, Decoration service near me in ${city?.toUpperCase()}, Balloon Decoration service near me in ${city?.toUpperCase()}, Flower Decoration service near me in ${city?.toUpperCase()}, Birthday Decoration service near me in ${city?.toUpperCase()}, Anniversary decoration service near me in ${city?.toUpperCase()}, Baby Shower Decoration service near me in ${city?.toUpperCase()}, Baby Welcome Decoration service near me in ${city?.toUpperCase()}, Online balloon decoration in ${city?.toUpperCase()}; Best balloon decorations ${city?.toUpperCase()}; Kids birthday decoration service near me in ${city?.toUpperCase()}`,
    `event planning certification, event organizing courses, event planner classes, event planner training, event planning course, event management certification, how to become a certified event planner, event certification, how to plan an event, event planning, event planners, helena paschal, how to plan an event houston, corporate event planner, business event planner, how to become an event planner, how to start an event planner business, event planning for beginners`
  ];
  const navigateTo = (link) => {
    if (city && locality) {
      router.push(`/${city}/${locality}/balloon-decoration/${link}`);
    } else if (city) {
      router.push(`/${city}/balloon-decoration/${link}`);
    } else {
      router.push(`/balloon-decoration/${link}`);
    }
  };
  return (<>
    <Head>
    <title>HORA Decorations in {city} in {locality} : Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199</title>
    <meta name="description" content="🎉 Explore a wide range of stunning decoration designs for every event and party, including 🎂 birthdays, 🧸 kids' parties, 💍 anniversaries, 💃 bachelorette parties, 👶 baby showers, 🍼 naming ceremonies, and 🌙 first nights. Choose your ideal design and book directly through our website for a seamless experience. Need help? Reach out to us at 7338584828 for friendly support and personalised assistance. 😊" />
    <meta name="keywords" content="Balloon and Flower Decoration @999" />
    <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
    <meta property="og:title" content="Balloon and Flower Decoration by Professional Decorators" />
    <meta property="og:description" content="Celebrate Anniversary, Birthday & other Occasions with Candlelight Dinners, Surprises & Balloon Decorations" />
    <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
    <script type="application/ld+json">{scriptTag}</script>
    <script type="application/ld+json">{faqSchemaScriptTag}</script>
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Hora Services" />
    <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
    <meta property="og:url" content="https://horaservices.com/balloon-decoration" />
    <meta property="og:type" content="website" />
  </Head>
  
     
      <div className="decore-city-TopCategory">
        {decCat
          .filter(item => item.image) // Filter out items without images
          .map((item, index) => (
            <div key={index} className="imageContainer">             
                <Image
                  src={item.image}
                  className="decCatimage"
                  alt={item.imgAlt}
                  onClick={() =>  navigateTo(item.link)}
                  width={300}
                  height={300}
                />
            </div>
          ))}
      </div>
      <div className="page-width decoration-city-page">
        <DecorationLandingSlider city={city} locality={locality}/>
      

      {/* faq */}
      <FAQs faqData={faqDataDecore} />

      <div class="decore-city-description">
        <h2 className="heading-purple" >Description</h2>
        <div id="city-description" style={{ fontSize: "14px" }}>
          {ballonDecoreCityDescription.map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>
      </div>

      <div className="exploreCategory">
        <p
          style={{
            fontSize: "24px",
            textTransform: "capitalize",
            fontWeight: "bold",
            color: "rgb(157, 74, 147)",
            margin: "32px 0 0px",
            borderBottom: "1px solid #cfcbcb",
          }}
          className="other-cities">
          Explore Other Decoration Category In {city}
        </p>

        <ul className="citylisting">
          {otherDecorecategory.map((item, index) => (
            <li key={index} className="city-link" data-city={item.city}>
              <Link href="/balloon-decoration">
                {item.text} in {item.city}
              </Link>
            </li>
          ))}
        </ul>

        <p id="city-seo-content" style={{ fontSize: "5px", margin: "20px 0 20px " }}>

          Online balloon decoration in {city}, Online decoration in {city}, Online balloon decorators in {city}, Online decorator in {city}; top balloon decorator in {city}; top balloon decorator in {city}; Excellent birthday party balloon decoration in {city}; event organising companies in {city}; beautiful theme balloon balloon decoration in {city}; beautiful theme flower balloon decoration in {city}; Hire balloon decoration at home in {city}; Best balloon decoration in {city}, Best decoration in {city}, Best balloon decorator in {city}; Best decorator in {city}; Balloon decoration at home in {city}; Balloon decorator at home in {city}; Best Balloon decorator at home in {city}; Best Balloon decoration at home in {city}; Professional balloon decoration services in {city}; Room Balloon Decoration; Hall Decoration; Large Decorations, Premium Decorations; Room decoration designs; Home Decoration; Stage decoration; Venue decoration; Best Room Balloon Decoration; Best Hall Decoration; Best Large Decorations, Best Premium Decorations; Best Room decoration designs; Best Home Decoration; Best Stage decoration; Best Venue decoration;
          Same-day bookings for Birthday Decoration at Home in {city}; Same-day bookings for Anniversary Decoration at Home in {city}; Same-day bookings for Birthday Decoration at in {city}. Same-day bookings for Baby shower Decoration at Home in {city}; Same-day bookings for Car Decoration at Home in {city}; Same-day bookings for first night Decoration at Home in {city}; Same-day bookings for welcome baby Decoration at Home in {city}
          Jungle Theme Decoration design, Jungle Theme Decorator near me; Jungle theme decoration under 1500; Jungle theme decoration under 5000; Jungle theme decoration under 10000; Jungle Theme balloon Decoration design; Jungle Theme balloon Decorator near me; Princess or Barbie Theme Decoration design, Princess or Barbie Theme Decorator near me; Princess or Barbie theme decoration under 1500; Princess or Barbie theme decoration under 5000; Jungle theme decoration under 10000; Princess or Barbie Theme balloon Decoration design; Princess or Barbie Theme balloon Decorator near me; Unicorn Theme Decoration design, Unicorn Theme Decorator near me; Unicorn theme decoration under 1500; Unicorn theme decoration under 5000; Unicorn theme decoration under 10000; Unicorn Theme balloon Decoration design; Unicorn Theme balloon Decorator near me; Space Theme Decoration design, Space Theme Decorator near me; Space theme decoration under 1500; Space theme decoration under 5000; Space theme decoration under 10000; Space Theme balloon Decoration design; Space Theme balloon Decorator near me;

          First birthday decoration; Second year birthday decoration, 5th year birthday decoration, 10th Birthday decoration; Anniversary Balloon Decoration in Bangalore; Kids birthday decoration; Birthday decoration; Decoration starting 1200 Rs; Budget-friendly suggestions for 1st Birthday Party Decorations; Budget-friendly suggestions for 2nd Birthday Party Decorations; Budget-friendly suggestions for 5th Birthday Party Decorations; Budget-friendly suggestions for 10th Birthday Party Decorations; Best balloon decorator for small parties in {city}, Best balloon decoration for small parties in {city}; Mini Decoration in {city},
          Book a decorator in {city}, Book a decoration in {city}, Book a balloon decorator in {city}, Book a flower decoration in {city}, Book a balloon decoration in {city}, Book a flower decorator in {city}; Book a trained verified decorator near you in {city}, Bookadecortor in {city},
          Decoration for small parties in {city}, Top Decorator in {city}, Decoration services in {city}, Decorator at home service in {city}, Decorator for a night in {city}, Decoration for a night in {city}, Decorator for hire in {city}, Decoration at my home in {city}, Decorator near me in {city}, Balloon Decorator near me in {city}, Flower Decorator near me in {city}, Decoration service near me in {city}, Balloon Decoration service near me in {city}, Flower Decoration service near me in {city}, Birthday Decoration service near me in {city}, Anniversary decoration service near me in {city}, baby shower Decoration service near me in {city}, Baby welome Decoration service near me in {city}; Simple birthday decoration at home; Simple birthday decoration in {city};

          Balloon Decoration for small parties in {city}, Top balloon Decorator in {city}, balloon Decoration services in {city}, balloon Decorator at home service in {city}, balloon Decorator for a night in {city}, Decorator for hire in {city}, balloon Decoration at my home in {city}, balloon Decorator near me in {city}, Balloon Decoration near me in {city}, Flower Decorator near me in {city}, Decoration service near me in {city}, Balloon Decoration service near me in {city}, Flower Decoration service near me in {city}, Birthday Decoration service near me in {city}, Anniversary decoration service near me in {city}, baby shower Decoration service near me in {city}, Baby welome Decoration service near me in {city}; balloon decoration for birthday at home in {city};
          balloon decoration ideas; Astronaut Space Theme balloon decoration; Avenger Space Theme balloon decoration; Boss Baby Theme balloon decoration; Baby Shark Theme balloon decoration; Barbie Theme balloon decoration; Cocomelon Theme balloon decoration; Car Theme balloon decoration; Circus Theme balloon decoration; Dinosaur Theme balloon decoration; Jungle Theme balloon decoration; Kitty Theme balloon decoration; Lion Theme balloon decoration; Mickey Mouse Theme balloon decoration; Minecraft Theme balloon decoration; Mermail Theme balloon decoration; Pokemon Theme balloon decoration; Princess Theme balloon decoration; Panda Theme balloon decoration; Traffic Theme balloon decoration; Super Dog Theme balloon decoration; Unicorn Theme balloon decoration                    </p>
      </div>

      </div>
    
    </>);
};


export default Decoration;