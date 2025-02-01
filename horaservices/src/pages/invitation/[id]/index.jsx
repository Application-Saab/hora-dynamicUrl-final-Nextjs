import { useRouter } from "next/router";
import React, { useState } from "react";
import Image from "next/image";
import { jsPDF } from "jspdf";
import { ReactSVG } from "react-svg";
import '../in.css';


const products = [
  {
    category: "Happy Birthday Cards",
    products: [
      {
        id: 1,
        name: "Barbie Doll Decoration for birthday",
        price: "₹1673",
        originalPrice: "₹2007",
        discount: "₹335 off",
        image: "/assets/template1.svg",
      },
      {
        id: 2,
        name: "Princess Decoration for birthday",
        price: "₹2483",
        originalPrice: "₹2979",
        discount: "₹497 off",
        image: "/assets/template13.svg",
      },
      {
        id: 3,
        name: "Football Decoration for birthday",
        price: "₹2483",
        originalPrice: "₹2979",
        discount: "₹497 off",
        image: "/assets/template12.svg",
      },
      {
        id: 4,
        name: "Superhero Decoration for birthday",
        price: "₹2483",
        originalPrice: "₹2979",
        discount: "₹497 off",
        image: "/assets/template10.svg",
      },
      {
        id: 5,
        name: "Oceans Decoration for birthday",
        price: "₹2483",
        originalPrice: "₹2979",
        discount: "₹497 off",
        image: "/assets/template11.svg",
      },
      
      {
        id: 6,
        name: "Jungle Decoration for birthday",
        price: "₹2483",
        originalPrice: "₹2979",
        discount: "₹497 off",
        image: "/assets/template7.svg",
      },
      
      {
        id: 7,
        name: "Mickey Mouse Decoration for birthday",
        price: "₹2483",
        originalPrice: "₹2979",
        discount: "₹497 off",
        image: "/assets/template8.svg",
      },
    ],
  },
];

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const product = products
    .flatMap((category) => category.products)
    .find((p) => p.id === parseInt(id));

  const [isEditing, setIsEditing] = useState(false);
  const [fullname, setFullname] = useState("Name");
  const [date, setdate] = useState("Date");
  const [address, setAddress] = useState("Address");
  const [category, setCategory] = useState("ENTER UR CATEGORY");
  const [time, setTime] = useState("Time");
  const [imageSrc, setImageSrc] = useState(product?.image || "");
  

  if (!product) return <p>Product not found</p>;

  const handleEditClick = () => setIsEditing(!isEditing);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

//   const handleDownload = () => {
//     const svgElement = document.querySelector(".product-svg svg");
//     if (!svgElement) return;

//     const svgRect = svgElement.getBoundingClientRect();
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     const scaleFactor = 4;
//     canvas.width = svgRect.width * scaleFactor;
//     canvas.height = svgRect.height * scaleFactor;

//     const img = new window.Image();
//     const svgString = new XMLSerializer().serializeToString(svgElement);
//     const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
//     const svgUrl = URL.createObjectURL(svgBlob);

//     img.onload = () => {
//       context.drawImage(img, 0, 0, canvas.width, canvas.height);
//       const imageUrl = canvas.toDataURL("image/png", 1.0);

//       const doc = new jsPDF({
//         orientation: "portrait",
//         unit: "px",
//         format: [canvas.width, canvas.height],
//       });

//       doc.addImage(imageUrl, "PNG", 0, 0, canvas.width, canvas.height);
//       doc.save("updated_image.pdf");
//     };

//     img.src = svgUrl;
//   };

const handleDownload = () => {
    const svgElement = document.querySelector(".product-svg svg");
    if (!svgElement) return;
  
    const svgRect = svgElement.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const scaleFactor = 4;
    canvas.width = svgRect.width * scaleFactor;
    canvas.height = svgRect.height * scaleFactor;
  
    // Clone the SVG element
    const clonedSvg = svgElement.cloneNode(true);
  
    // Get computed styles and inject them into the cloned SVG
    const styleSheets = [...document.styleSheets]
      .map(sheet => {
        try {
          return [...sheet.cssRules].map(rule => rule.cssText).join("\n");
        } catch (e) {
          return ""; // Ignore cross-origin styles
        }
      })
      .join("\n");
  
    const styleElement = document.createElement("style");
    styleElement.textContent = styleSheets;
    clonedSvg.insertBefore(styleElement, clonedSvg.firstChild);
  
    // Convert updated SVG to a Blob
    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);
  
    const img = new window.Image(); // Use window.Image() to avoid Next.js conflicts
  
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL("image/png", 1.0);
  
      // Download Image
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "downloaded_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    img.src = svgUrl;
  };
  

  return (
    <div className="product-details-container">
    <div className="product-content">
      <div className="product-image-section">
        {product.image.includes(".svg") ? (
          <ReactSVG
            src={product.image}
            className="product-svg"
            beforeInjection={(svg) => {
              const textElement1 = svg.getElementById("name");
              if (textElement1) textElement1.textContent = fullname;
              const textElement2 = svg.getElementById("date");
              if (textElement2) textElement2.textContent = date;
              const textAddress = svg.getElementById("address");
              if (textAddress) textAddress.textContent = address;
              const textCategory = svg.getElementById("category");
              if(textCategory) textCategory.textContent = category;
              const textTime = svg.getElementById("time");
              if(textTime) textTime.textContent = time;
              const imageElement = svg.querySelector('[data-id="uniqueImage1"]');
              if (imageElement) {
                imageElement.setAttribute("xlink:href", imageSrc);
              }
            }}
          />
        ) : (
          <Image src={imageSrc} alt={product.name} width={250} height={200} />
        )}
      </div>
  
      <div className="edit-buttons">
        <div style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", padding: "20px", backgroundColor: "#fff", borderRadius: "10px" }}>
          <div className="breadcrumb">
            {/* <a href="/">Home</a> {' > '} */}
            {/* <a href="#">{product.category}</a> {' > '} */}
            <span>{product.name}</span>
          </div>
  
          {isEditing ? (
  <div className="edit-section">
    <input type="text" placeholder="Enter Name" value={fullname} onChange={(e) => setFullname(e.target.value)} />
    <input type="text" placeholder="Enter Name 2" value={date} onChange={(e) => setdate(e.target.value)} />
    <input type="text" placeholder="Enter Time" value={time} onChange={(e) => setTime(e.target.value)} />
    <input type="text" placeholder="Enter Address" value={address} onChange={(e) => setAddress(e.target.value)} />
    <input type="text" placeholder="Enter Category" value={category} onChange={(e) => setCategory(e.target.value)}
    style={{ textTransform: 'uppercase' }}  />
    <input type="file" accept="image/*" onChange={handleImageUpload} />
  </div>
) : (
  <button onClick={() => setIsEditing(true)}>Edit</button>
)}
          <button onClick={handleDownload}>Download</button>
        </div>
      </div>
    </div>
  </div>
  
  );
}
