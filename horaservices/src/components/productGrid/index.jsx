import React from "react";
import Image from "next/image";
import logo from "../../assets/new_logo_light.png";
import "./productGrid.css";
import { useEffect } from "react";
const ProductGrid = ({ data = [], onCardClick, categoryType  }) => {
  return (
    <div className="decContainer">
      {data.length > 0 &&
        data.map((item) => (
          <div
            key={item._id}
            className="imageContainer"
            onClick={() => onCardClick?.(item)}
          >
            <div className="imageWrapper">
              <Image
                src={`https://horaservices.com/api/uploads/compressed_webp/${item.featured_image?.split(".")[0]}.webp`}
                alt={`balloon decoration ${item.name}`}
                className="decImage"
                width={300}
                height={300}
              />
              <div className="watermark">
                <Image src={logo} alt="logo" width={40} height={40} />
              </div>
              <div className="discountLabel">
                ₹ {item.discountDifference.toFixed(0)} off
              </div>
            </div>
            <div className="cardContent">
                    <p className="productname">
            {categoryType === "photography"
              ? item.name
              : item.name.length > 15
              ? `${item.name.slice(0, 15)}...`
              : item.name}
             </p>
              <div className="priceRatingRow">
                <div className="priceBlock">
                  <p className="PRice">₹{item.price}</p>
                  <p className="discountedPrice">₹{Math.floor(item.discountedPrice)}</p>
                </div>
                <p className="customization">Customization Available</p>
                <p className="viewMore">View More</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};




export default ProductGrid;


// import React from "react";
// import Image from "next/image";
// import logo from "../../assets/new_logo_light.png";
// import "./productGrid.css";

// const ProductGrid = ({ data = [], onCardClick, categoryType }) => {
//   return (
//     <div className="decContainer">
//       {data.length > 0 &&
//         data.map((item) => (
//           <div
//             key={item._id}
//             className="imageContainer"
//             onClick={() => onCardClick?.(item)}
//           >
//             <div className="imageWrapper">
//               <Image
//                 src={`https://horaservices.com/api/uploads/compressed_webp/${item.featured_image?.split(".")[0]}.webp`}
//                 alt={`balloon decoration ${item.name} ${item.price}`}
//                 className="decImage"
//                 width={300}
//                 height={300}
//               />
//               <div className="watermark">
//                 <Image src={logo} alt="logo" width={40} height={40} />
//               </div>

//               {/* Discount Label */}
//               <div className="discountLabel">
//                 ₹ {item.discountDifference.toFixed(0)} off
//               </div>
//             </div>

         
//             <div className="cardContent">
//             <p className="productname">
//   {categoryType === "photography"
//     ? item.name
//     : item.name.length > 15
//     ? `${item.name.slice(0, 15)}...`
//     : item.name}
// </p>


//               <div className="priceRatingRow">
//                 <div className="priceBlock">
//                   {categoryType === "photography" ? (
//                     <>
//                       <p className="discountedPrice"   style={{
//                           textDecoration: "none",color:"#97538C"}}>
//                         ₹{Math.floor(item.discountedPrice)}
//                       </p>
//                       <p
//                         className="PRice"
//                         style={{
//                           textDecoration: "line-through",
//                           color: "#555",
//                         }}
//                       >
//                         ₹{item.price}
//                       </p>
//                     </>
//                   ) : (
//                     <>
//                       <p
//                         className="PRice"
//                         style={{
//                           color: "#97538C",
//                         }}
//                       >
//                         ₹{item.price}
//                       </p>
//                       <p className="discountedPrice">
//                         ₹{Math.floor(item.discountedPrice)}
//                       </p>
//                     </>
//                   )}
//                 </div>

//                 <p className="customization">Customization Available</p>
//                 <p className="viewMore">View More</p>
//               </div>
//             </div>
//           </div>
//         ))}
//     </div>
//   );
// };

// export default ProductGrid;
