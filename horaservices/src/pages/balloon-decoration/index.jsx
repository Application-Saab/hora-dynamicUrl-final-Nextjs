import React, { useState, useEffect } from "react";
import Head from 'next/head';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { BASE_URL, GET_DECORATION_CAT_ID, GET_DECORATION_CAT_ITEM } from '../../utils/apiconstants';
import { getDecorationOrganizationSchema } from '../../utils/schema';
import { setState } from '../../actions/action';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import '../../css/decoration.css';
import DecorationLandingSlider from '../../components/DecorationLandingSlider';



const decCat = [
    { id: '2', image: "https://horaservices.com/api/uploads/compressed_images/Birthday_dec_cat.webp", name: 'Birthday', subCategory: "Birthday", catValue: "birthday-decoration", imgAlt: "A Gorgeous Candy Birthday Decoration Surprise!" },
    { id: '3', image: "https://horaservices.com/api/uploads/compressed_images/first_night_cat_dec.webp", name: 'First Night', subCategory: "FirstNight", catValue: "first-night-decoration", imgAlt: "Add extra happiness quotient to your wedding night with our exclusive décor package" },
    { id: '4', image: "https://horaservices.com/api/uploads/compressed_images/aniversary_Cat_Dec.webp", name: 'Anniversary', subCategory: "Anniversary", catValue: "anniversary-decoration", imgAlt: "Immerse yourself in a world of romance with our mesmerizing anniversary decorations." },
    { id: '5', image: "https://horaservices.com/api/uploads/compressed_images/kids_birthday_decoration.webp", name: 'Kids Birthday', subCategory: "KidsBirthday", catValue: "kids-birthday-decoration", imgAlt: "Flutter into a world of whimsy with our exclusive Whimsical Flutter-themed Welcome Baby Decorations." },
    { id: '6', image: "https://horaservices.com/api/uploads/compressed_images/baby-shower-dec-cat.webp", name: 'Baby Shower', subCategory: "BabyShower", catValue: "baby-shower-decoration", imgAlt: "Celebrate the transformation into motherhood with Our Gilded Baby Shower Decorations." },
    { id: '7', image: "https://horaservices.com/api/uploads/compressed_images/welcome_baby_dec.webp", name: 'Welcome Baby', subCategory: "WelcomeBaby", catValue: "welcome-baby-decoration", imgAlt: "A Pastel Theme Oh Baby Decor for your Baby Shower Celebrations!" },
    { id: '8', image: "https://horaservices.com/api/uploads/compressed_images/preminumdecor.webp	", name: 'premium Decoration', subCategory: "PremiumDecoration", catValue: "premium-decoration", imgAlt: "Birthday party decoration ideas for adults" },
    { id: '9', image: "https://horaservices.com/api/uploads/Balloon-B-new.webp", name: 'Ballon Bouquets', subCategory: "BallonBouquets", catValue: "balloon-bouquets-decoration", imgAlt: "Balloon Bouquet" },
    {id: '10', Image: "", name: "Haldi Event", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Haldi Event"},  
    {id: '11', Image: "", name: "Mehendi Event", subCategory: "Haldi-Mehandi", catValue: "haldi-mehendi-decoration", imgAlt: "Mehendi Event"},
    {id: '12', Image: "", name: "Bachelorette Decoration", subCategory: "bachelorette", catValue: "bachelorette-decoration", imgAlt: "Bachelorette"},
    {id: '13', Image: "", name: "proposal decorations", subCategory: "Proposal-Decoration", catValue: "Proposal-Decorations", imgAlt: "proposal decorations"},


];

const Decoration = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  // const navigate = useNavigate();
  const schemaOrg = getDecorationOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  let { city } = useParams();
  const hasCityPageParam = city ? true : false;
  const navigateTo = (link) => {
    if (city && locality) {
      router.push(`/${city}/${locality}/balloon-decoration/${link}`);
    } else if (city) {
      router.push(`/${city}/balloon-decoration/${link}`);
    } else {
      router.push(`/balloon-decoration/${link}`);
    }
  };



  return (
    <div className="decoration-city-page-sec">

      <div className="decore-city-TopCategory">
        {decCat
          .filter(item => item.image) // Filter out items without images
          .map((item, index) => (
            <div key={index} className="imageContainer">
              <a href={item.link}>
                <Image
                  src={item.image}
                  className="decCatimage"
                  alt={item.imgAlt}
                  loading="eager"
                  onClick={() => {
                    window.dataLayer = window.dataLayer || [];

                    window.dataLayer.push({
                      event: 'categoryClick',
                      categoryName: item.name,
                      subCategory: item.subCategory,
                      catValue: item.catValue,
                      imageAlt: item.imgAlt,
                      itemLink: item.link,
                    });
                    navigateTo(item.subCategory)
                  }}
                  width={300}
                  height={300}
                />
              </a>
            </div>


          ))}
      </div>
      <div className="page-width decorationlanding-slider">
        <DecorationLandingSlider />
      </div>
    </div>
  );
};

// Fetching the data at build time
export async function getStaticProps() {
  try {
    const catalogueData = await Promise.all(decCat.map(async (item) => {
      const response = await axios.get(BASE_URL + GET_DECORATION_CAT_ID + item.subCategory);
      const categoryId = response.data.data._id;
      const result = await axios.get(BASE_URL + GET_DECORATION_CAT_ITEM + categoryId);
      return {
        ...item,
        data: result.data.data,
      };
    }));

    return {
      props: {
        catalogueData,
      },
    };
  } catch (error) {
    console.log("Error fetching data:", error.message);
    return {
      props: {
        catalogueData: [],
      },
    };
  }
}

export default Decoration;