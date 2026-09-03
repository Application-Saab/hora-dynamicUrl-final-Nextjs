// import "./planningcategories.css";
// import venueImg from "@/assets/Homepageimages/cat-venue.webp";
// import decorationImg from "@/assets/Homepageimages/cat-decoration.webp";
// import photographyImg from "@/assets/Homepageimages/cat-photography.webp";
// import foodDeliveryImg from "@/assets/Homepageimages/cat-food-delivery.webp";
// import chefImg from "@/assets/Homepageimages/cat-chef.webp";
// import cateringImg from "@/assets/Homepageimages/cat-catering.webp";
// import fireworksImg from "@/assets/Homepageimages/cat-fireworks.webp";
// import Image from "next/image";
// import arrowIcon from"@/assets/arrowicon.svg";
// const categories = [
//   {
//     title: "Venue",
//     subtitle: "Banquet Halls, Farmhouse & more.",
//     image: venueImg,
//   },
//   {
//     title: "Decoration",
//     subtitle: "Balloons, Light & beautiful setups",
//     image: decorationImg,
//   },
//   {
//     title: "Photography",
//     subtitle: "Capture moments, cherish forever",
//     image: photographyImg,
//   },
//   {
//     title: "Food Delivery",
//     subtitle: "Delicious food, delivered to you",
//     image: foodDeliveryImg,
//   },
//   {
//     title: "Chef for Party",
//     subtitle: "Hire expert chefs for your special menu",
//     image: chefImg,
//   },
//   {
//     title: "Food Catering",
//     subtitle: "Catering service for any size of event",
//     image: cateringImg,
//   },
//   {
//     title: "Celebration Boosters",
//     subtitle: "Balloons, Light & beautiful setups",
//     image: fireworksImg,
//   },
// ];

// export default function PlanningCategories({ onSelect }) {
//   return (
//     <div className="planning">
//       <div className="planning-hero">
//         <h1>Planning Celebration?</h1>
//         <p>Pick a category to explore beautiful ideas and make your event unforgettable</p>
//       </div>

//       <div className="planning-grid">
//         {categories.map((cat) => (
//           <div className="planning-card" key={cat.title}>
//             <div className="planning-image">
//               <Image src={cat.image} alt={cat.title} />
//             </div>
//             <div className="planning-body">
//               <h3>{cat.title}</h3>
//               <p>{cat.subtitle}</p>
//             </div>
//             <button
//               className="planning-arrow"
//               onClick={() => onSelect && onSelect(cat.title)}
//               aria-label={`Explore ${cat.title}`}
//             >
//             <Image
//   src={arrowIcon}
//   alt="Arrow"
//   className="arrow-plan"
// />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";
import "./planningcategories.css";
import venueImg from "@/assets/Homepageimages/cat-venue.webp";
import decorationImg from "@/assets/Homepageimages/cat-decoration.webp";
import photographyImg from "@/assets/Homepageimages/cat-photography.webp";
import foodDeliveryImg from "@/assets/Homepageimages/cat-food-delivery.webp";
import chefImg from "@/assets/Homepageimages/cat-chef.webp";
import cateringImg from "@/assets/Homepageimages/cat-catering.webp";
import fireworksImg from "@/assets/Homepageimages/cat-fireworks.webp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import arrowIcon from "@/assets/arrowicon.svg";

const categories = [
  {
    title: "Venue",
    subtitle: "Banquet Halls, Farmhouse & more.",
    image: venueImg,
    path: "/venue-list",
  },
  {
    title: "Decoration",
    subtitle: "Balloons, Light & beautiful setups",
    image: decorationImg,
    path: "/balloon-decoration",
  },
  {
    title: "Photography",
    subtitle: "Capture moments, cherish forever",
    image: photographyImg,
    path: "/photography-page",
  },
  {
    title: "Food Delivery",
    subtitle: "Delicious food, delivered to you",
    image: foodDeliveryImg,
    path: "/party-food-delivery-live-catering-buffet?type=bulkFood",
  },
  {
    title: "Chef for Party",
    subtitle: "Hire expert chefs for your special menu",
    image: chefImg,
    path: "/book-chef-cook-for-party",
  },
  {
    title: "Food Catering",
    subtitle: "Catering service for any size of event",
    image: cateringImg,
    path: "/party-food-delivery-live-catering-buffet?type=liveCatering",
  },
  {
    title: "Celebration Boosters",
    subtitle: "Balloons, Light & beautiful setups",
    image: fireworksImg,
    path: "/celebration-boosters",
  },
];

export default function PlanningCategories({ onSelect }) {
  const router = useRouter();

  const goTo = (path, title) => {
    if (onSelect) onSelect(title);
    router.push(path);
  };

  return (
    <div className="planning">
      <div className="planning-hero">
        <h1>Planning Celebration?</h1>
        <p>Pick a category to explore beautiful ideas and make your event unforgettable</p>
      </div>

      <div className="planning-grid">
        {categories.map((cat) => (
          <div
            className="planning-card"
            key={cat.title}
            role="button"
            tabIndex={0}
            onClick={() => goTo(cat.path, cat.title)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") goTo(cat.path, cat.title);
            }}
          >
            <div className="planning-image">
              <Image src={cat.image} alt={cat.title} />
            </div>
            <div className="planning-body">
              <h3>{cat.title}</h3>
              <p>{cat.subtitle}</p>
            </div>
            <button
              className="planning-arrow"
              onClick={(e) => {
                e.stopPropagation(); // card ka click dobara trigger na ho
                goTo(cat.path, cat.title);
              }}
              aria-label={`Explore ${cat.title}`}
            >
              <Image src={arrowIcon} alt="Arrow" className="arrow-plan" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}