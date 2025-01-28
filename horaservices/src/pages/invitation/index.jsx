// import React, { useState, useRef } from "react";
// import { ReactSVG } from "react-svg";
// import Image from "next/image";
// import "./in.css";
// import { jsPDF } from "jspdf";

// function SVG({ product, onClose }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [fullname, setFullname] = useState("Name");
//   const [fullname2, setFullname2] = useState("Name");
//   const [hasName1, setHasName1] = useState(false);
//   const [hasName2, setHasName2] = useState(false);
//   const [imageSrc, setImageSrc] = useState(product.image);
//   const canvasRef = useRef(null);

//   const handleInputChange = (event) => {
//     setFullname(event.target.value);
//   };

//   const handleInputChange2 = (event) => {
//     setFullname2(event.target.value);
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImageSrc(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };
      
//   const handleDownload = () => {
//     const svgElement = document.querySelector(".popup-left svg");
//     if (!svgElement) {
//       return;
//     }
  
//     const svgRect = svgElement.getBoundingClientRect();
//     const svgWidth = svgRect.width;
//     const svgHeight = svgRect.height;
  
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
  
//     const scaleFactor = 4;
//     canvas.width = svgWidth * scaleFactor;
//     canvas.height = svgHeight * scaleFactor;
  
//     const img = new window.Image();
//     const svgString = new XMLSerializer().serializeToString(svgElement);
//     const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
//     const svgUrl = URL.createObjectURL(svgBlob);
  
//     img.onload = () => {
//       context.drawImage(img, 0, 0, svgWidth * scaleFactor, svgHeight * scaleFactor);
//       const imageUrl = canvas.toDataURL("image/png", 1.0);
  
//       const doc = new jsPDF({
//         orientation: "portrait",
//         unit: "px",
//         format: [svgWidth * scaleFactor, svgHeight * scaleFactor],
//       });
  
//       doc.addImage(imageUrl, "PNG", 0, 0, svgWidth * scaleFactor, svgHeight * scaleFactor);
//       doc.save("updated_image.pdf");
//     };
  
//     img.src = svgUrl;
//   };

//   return (
//     <div className="popup-overlay">
//       <div className="popup-content">
//         <h2 className="popup-title">{product.name}</h2>
//         <div className="popup-body">
//           <div className="popup-left">
//             {product.image.includes(".svg") ? (
//               <ReactSVG
//                 src={product.image}
//                 layout="responsive"
//                 beforeInjection={(svg) => {
//                   const textElement1 = svg.querySelector(".name1");
//                   if (textElement1) {
//                     textElement1.textContent = fullname;
//                     setHasName1(true);
//                   } else {
//                     setHasName1(false);
//                   }

//                   const textElement2 = svg.querySelector(".name2");
//                   if (textElement2) {
//                     textElement2.textContent = fullname2;
//                     setHasName2(true);
//                   } else {
//                     setHasName2(false);
//                   }

//                   const imageElement = svg.querySelector('[data-id="uniqueImage1"]');
//                   if (imageElement) {
//                     imageElement.setAttribute("xlink:href", imageSrc);
//                   }
//                 }}
//                 wrapper="div"
//                 style={{ width: "300%", height: "300px" }}
//               />
//             ) : (
//               <Image src={imageSrc} alt={product.name} width={250} height={250} />
//             )}
//           </div>

//           <div className="popup-right">
//             {isEditing && (
//               <div>
//                 {hasName1 && (
//                   <input
//                     type="text"
//                     placeholder="Enter Full Name"
//                     value={fullname}
//                     onChange={(e) => setFullname(e.target.value)}
//                     className="edit-placeholder-input"
//                   />
//                 )}
//                 {hasName2 && (
//                   <input
//                     type="text"
//                     placeholder="Enter Full Name 2"
//                     value={fullname2}
//                     onChange={(e) => setFullname2(e.target.value)}
//                     className="edit-placeholder-input"
//                   />
//                 )}
//                 <label htmlFor="imageUpload" className="upload-label">
//                   Upload New Image
//                 </label>
//                 <input
//                   type="file"
//                   id="imageUpload"
//                   accept="image/*"
//                   onChange={(e) => handleImageUpload(e)}
//                   className="upload-input"
//                   style={{ display: "none" }}
//                 />
//               </div>
//             )}
//             <div className="popup-price"></div>
//             {!isEditing && (
//               <button onClick={handleEditClick} className="popup-edit-btn">
//                 Edit
//               </button>
//             )}
//           </div>
//         </div>
//         <canvas ref={canvasRef} width="500" height="500" style={{ display: "none" }}></canvas>
//         {(fullname || fullname2 || imageSrc !== product.image) && (
//           <button onClick={handleDownload} className="popup-close-btn">
//             Download Image
//           </button>
//         )}
//         <button className="popup-close-btn" onClick={onClose}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }

// const products = [
//   {
//     category: "Happy Birthday Cards",
//     products: [
//       {
//         id: 1,
//         name: "Minnie Mouse Theme Decoration",
//         price: "₹1673",
//         originalPrice: "₹2007",
//         discount: "₹335 off",
//         image: "/assets/invitation3.svg", 
//       },
//       {
//         id: 2,
//         name: "Cocomelon Theme For Birthday Kids",
//         price: "₹2483",
//         originalPrice: "₹2979",
//         discount: "₹497 off",
//         image: "/assets/invitation4.svg",
//       },
//       {
//         id: 3,
//         name: "Elegant Gold Wedding Invitation",
//         price: "₹3500",
//         originalPrice: "₹4000",
//         discount: "₹500 off",
//         image: "/assets/invitation4.svg",
//       },
//       {
//         id: 4,
//         name: "Classic Floral Wedding Invitation",
//         price: "₹2800",
//         originalPrice: "₹3200",
//         discount: "₹400 off",
//         image: "/assets/invitation3.svg",
//       },
//       {
//         id: 5,
//         name: "Elegant Gold Wedding Invitation",
//         price: "₹3500",
//         originalPrice: "₹4000",
//         discount: "₹500 off",
//         image: "/assets/invitation3.svg",
//       },
//     ],
//   },
//   {
//     category: "Wedding Invitations",
//     products: [
//       {
//         id: 6,
//         name: "Elegant Gold Wedding Invitation",
//         price: "₹3500",
//         originalPrice: "₹4000",
//         discount: "₹500 off",
//         image: "/assets/invitation5.svg",
//       },
//       {
//         id: 7,
//         name: "Classic Floral Wedding Invitation",
//         price: "₹2800",
//         originalPrice: "₹3200",
//         discount: "₹400 off",
//         image: "/assets/invitation6.svg",
//       },
//       {
//         id: 8,
//         name: "Elegant Gold Wedding Invitation",
//         price: "₹3500",
//         originalPrice: "₹4000",
//         discount: "₹500 off",
//         image: "/assets/invitation5.svg",
//       },
//       {
//         id: 9,
//         name: "Classic Floral Wedding Invitation",
//         price: "₹2800",
//         originalPrice: "₹3200",
//         discount: "₹400 off",
//         image: "/assets/invitation6.svg",
//       },
//       {
//         id: 10,
//         name: "Elegant Gold Wedding Invitation",
//         price: "₹3500",
//         originalPrice: "₹4000",
//         discount: "₹500 off",
//         image: "/assets/invitation5.svg",
//       },
//     ],
//   },
// ];

// export default function App() {
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const handleImageClick = (product) => {
//     setSelectedProduct(product);
//   };

//   const handleClosePopup = () => {
//     setSelectedProduct(null);
//   };

//   return (
//     <div className="product-container-i">
//       <div className="product-container-i">
//         {products.map((categoryData) => (
//           <div key={categoryData.category}>
//             <h1 className="heading-i">{categoryData.category}</h1>
//             <div className="product-slider-i">
//               {categoryData.products.map((product) => (
//                 <div
//                   key={product.id}
//                   className="product-box-i"
//                   onClick={() => handleImageClick(product)}
//                 >
//                   <div className="product-image-container-i">
//                     <Image
//                       src={product.image}
//                       alt={product.name}
//                       width={100}
//                       height={100}
//                     />
//                     <div className="product-discount-i">{product.discount}</div>
//                   </div>
//                   <h3 className="product-name-i">{product.name}</h3>
//                   <div className="product-price-container-i">
//                     <span className="product-price-i">{product.price}</span>
//                     <span className="product-original-price-i">
//                       {product.originalPrice}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedProduct && (
//         <SVG product={selectedProduct} onClose={handleClosePopup} />
//       )}
//     </div>
//   );
// }


import React, { useState } from 'react';
import mammoth from 'mammoth';

const DocxPreview = () => {
  const [docContent, setDocContent] = useState("");

  // Function to handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.name.endsWith('.docx')) {
      const reader = new FileReader();

      reader.onload = () => {
        const arrayBuffer = reader.result;

        // Use mammoth to convert DOCX to HTML
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
          .then((result) => {
            setDocContent(result.value); // Set the converted HTML content
          })
          .catch((error) => {
            console.error("Error reading DOCX file:", error);
          });
      };

      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid DOCX file.");
    }
  };

  return (
    <div>
      <h2>DOCX File Preview</h2>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      <div
        style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px", maxHeight: "500px", overflowY: "auto" }}
        dangerouslySetInnerHTML={{ __html: docContent }} // Render the HTML content from DOCX
      />
    </div>
  );
};

export default DocxPreview;
