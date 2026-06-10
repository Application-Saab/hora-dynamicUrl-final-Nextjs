// import Image from "next/image";
// import "./venuecircle.css";

// import all from "@/assets/venuelanding/All.webp";
// import banquet from "@/assets/venuelanding/Banquethall.webp";
// import farmhouse from "@/assets/venuelanding/farmhaouse.webp";
// import fort from "@/assets/venuelanding/Fort.webp";
// import gamezone from "@/assets/venuelanding/Gamezone.webp";
// import hotels from "@/assets/venuelanding/Hotels.webp";
// import lawns from "@/assets/venuelanding/Laws.webp";
// import poolside from "@/assets/venuelanding/Poolside.webp";
// import pubbar from "@/assets/venuelanding/Pubandbar.webp";
// import resorts from "@/assets/venuelanding/Resorts.webp";
// import restaurants from "@/assets/venuelanding/REstorants.webp";
// import rooftop from "@/assets/venuelanding/roof_top_.webp";
// import villas from "@/assets/venuelanding/Villas.webp";

// const VenueCircle = () => {
//   const venues = [
//     { id: "all", label: "All", img: all },
//     { id: "banquet", label: "Banquet Hall", img: banquet },
//      { id: "pubbar", label: "Pub & Bar", img: pubbar },
//       { id: "poolside", label: "Poolside", img: poolside },
//         { id: "rooftop", label: "Rooftop", img: rooftop },
//         { id: "resorts", label: "Resorts", img: resorts },
//          { id: "villas", label: "Villas", img: villas },
//              { id: "gamezone", label: "Game Zone", img: gamezone },
//     { id: "restaurants", label: "Restaurants", img: restaurants },
//     { id: "farmhouse", label: "Farmhouse", img: farmhouse },
//     { id: "lawns", label: "Lawns", img: lawns },
   

//     { id: "hotels", label: "Hotels", img: hotels },
//      { id: "fort", label: "Forts & Palaces", img: fort },
   
   
    
  
   
//   ];

//   return (
//     <div className="venue-box">
//       <div className="venue-scroll">
//         {venues.map((v) => (
//           <div key={v.id} className="venue-item">
//             <div className="venue-img">
//               <Image src={v.img} alt={v.label} width={70} height={70} />
//             </div>
//             <p>{v.label}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VenueCircle;

import Image from "next/image";
import "./venuecircle.css";

import all from "@/assets/venuelanding/All.webp";
import banquet from "@/assets/venuelanding/Banquethall.webp";
import farmhouse from "@/assets/venuelanding/farmhaouse.webp";
import fort from "@/assets/venuelanding/Fort.webp";
import gamezone from "@/assets/venuelanding/Gamezone.webp";
import hotels from "@/assets/venuelanding/Hotels.webp";
import lawns from "@/assets/venuelanding/Laws.webp";
import poolside from "@/assets/venuelanding/Poolside.webp";
import pubbar from "@/assets/venuelanding/Pubandbar.webp";
import resorts from "@/assets/venuelanding/Resorts.webp";
import restaurants from "@/assets/venuelanding/REstorants.webp";
import rooftop from "@/assets/venuelanding/roof_top_.webp";
import villas from "@/assets/venuelanding/Villas.webp";


const venues = [
  { id: "all",          label: "All",            img: all },
  { id: "Banquet hall", label: "Banquet Hall",    img: banquet },
  { id: "Pub & Bar",    label: "Pub & Bar",       img: pubbar },
  { id: "Poolside",     label: "Poolside",        img: poolside },
  { id: "Rooftop",      label: "Rooftop",         img: rooftop },
  { id: "Resort",       label: "Resorts",         img: resorts },
  { id: "Villa",        label: "Villas",          img: villas },
  { id: "Game Zone",    label: "Game Zone",       img: gamezone },
  { id: "Restaurant",   label: "Restaurants",     img: restaurants },
  { id: "Farmhouse",    label: "Farmhouse",       img: farmhouse },
  { id: "Lawn",         label: "Lawns",           img: lawns },
  { id: "Hotels",       label: "Hotels",          img: hotels },
  { id: "Fort/Place",   label: "Forts & Palaces", img: fort },
];

const VenueCircle = ({ active, onSelect }) => { // ✅ props
  return (
    <div className="venue-box">
      <div className="venue-scroll">
        {venues.map((v) => (
          <div
            key={v.id}
            className={`venue-item ${active === v.id ? "active" : ""}`} // ✅ active class
            onClick={() => onSelect(v.id)} // ✅ click handler
          >
            <div className={`venue-img ${active === v.id ? "active" : ""}`}>
              <Image src={v.img} alt={v.label} width={70} height={70} />
            </div>
            <p>{v.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueCircle;