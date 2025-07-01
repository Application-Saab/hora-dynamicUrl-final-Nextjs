// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import "./DecorGrid.css";

// const DecorGrid = ({ largeCard, smallCards }) => {
//   return (
//     <div className="decor-grid-wrapper">
//       <div className="decor-card-grid">

//         <div className="decor-large-card">


//       <div className="decor-large-image-box">
//         <Image
//           src={largeCard.image}
//           alt={largeCard.title}
//           fill
//           style={{ objectFit: "cover" }}
//         />
//       </div>


//       <div className="decor-large-content">
//         <h3>{largeCard.title}</h3>
//         <p>{largeCard.description}</p>
//         <ul>
//           {largeCard.points.map((point, index) => (
//             <li key={index}>{point}</li>
//           ))}
//         </ul>
//         {largeCard.link && (
//           <Link href={largeCard.link}>
//             <button className="decor-view-btn">View more</button>
//           </Link>
//         )}
//       </div>

//     </div>


//         <div className="decor-small-cards-container">
//           {smallCards.map((card, index) => (
//             <div key={index} className="decor-small-card">
//               <div className="decor-small-img-box">
//                 <Image
//                   src={card.image}
//                   alt={card.title}
//                   fill
//                   style={{ objectFit: "cover" }}
//                 />
//               </div>
//               <h4 className="decor-small-label">{card.title}</h4>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default DecorGrid;


"use client";

import Image from "next/image";
import Link from "next/link";
import "./DecorGrid.css";

const DecorGrid = ({ largeCard, smallCards }) => {
  return (
    <div className="decor-grid-wrapper">
      <div className="decor-card-grid">

        {/* Large Card */}
        <div className="decor-large-card">
          <div className="decor-large-image-box">
            <Image
              src={largeCard.image}
              alt={largeCard.title}
              width={300} // required by Next.js
              height={140} // required by Next.js
            />
          </div>


          <div className="decor-large-content">
            <h3>{largeCard.title}</h3>
            <p>{largeCard.description}</p>

            {largeCard.link && (
              <Link href={largeCard.link}>
                <button className="decor-view-btn">View more</button>
              </Link>
            )}
          </div>
        </div>

        {/* Small Cards */}
        <div className="decor-small-cards-container">
          {smallCards.map((card, index) => (
            <div key={index} className="decor-small-card">
              <div className="decor-small-img-box">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={400}
                  height={100}
                />
              </div>
              <h4 className="decor-small-label">{card.title}</h4>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DecorGrid;
