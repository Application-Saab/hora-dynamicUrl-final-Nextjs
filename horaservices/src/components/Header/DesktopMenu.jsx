// import Link from "next/link";
// import arrowImg from '../../assets/dropdownarrow.png'
// import Image from "next/image";
// const DesktopMenu = () => {
//   const openWhatsApp = () => {
//   const phone = "917338584828"; // +91 73385 84828
//   const message = "Hi, I saw your website and want to know more about the services";
//   const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
//   window.open(url, "_blank");
// };
//   return (
//     <ul className="desktop-menu">
//       <li className="categories-item">
//       <span className="categories-trigger">
  
//   {/* 🔥 Clickable text (redirect) */}
//   <Link href="/horaservices/" className="categories-link">
//     Categories
//   </Link>

//   {/* 🔽 Dropdown arrow (image) */}
//   <Image 
//     src={arrowImg}
//     alt="dropdown"
//     width={12}
//     height={12}
//     className="caret-img"
//   />
// </span>


//         <ul className="categories-dropdown">
//           <li><Link href="/balloon-decoration">Decoration</Link></li>
//           <li><Link href="/photography-page">Photography</Link></li>
//           <li><Link href="/book-chef-cook-for-party">Chef for Party</Link></li>
//           <li>
//             <Link href="/party-food-delivery-live-catering-buffet/party-food-delivery">
//               Food Delivery
//             </Link>
//           </li>
//           <li>
//             <Link href="/party-food-delivery-live-catering-buffet/party-live-buffet-catering">
//               Live Catering
//             </Link>
//           </li>
//        <li>
//   <Link
//     href="#"
//     onClick={(e) => {
//       e.preventDefault();   // page reload na ho
//       openWhatsApp();
//     }}
//     style={{ cursor: "pointer" }}
//   >
//     Entertainment
//   </Link>
// </li>

//         </ul>
//       </li>

//       <li><Link href="/contactus">Contact Us</Link></li>
//       <li><Link href="/aboutus">About Us</Link></li>
//       <li><Link href="/reviews">Customer Reviews</Link></li>
//     </ul>
//   );
// };

// export default DesktopMenu;

import Link from "next/link";
import Image from "next/image";
import arrowImg from "../../assets/dropdownarrow.png";

import { CATEGORIES_CONFIG } from "@/utils/categories";
import { openWhatsApp } from "@/utils/whatsapp";

const DesktopMenu = () => {
  return (
    <ul className="desktop-menu">
      <li className="categories-item">
        <span className="categories-trigger">
          {/* 🔥 Clickable text */}
          <Link href="/horaservices/" className="categories-link">
            Categories
          </Link>

          {/* 🔽 Dropdown arrow */}
          <Image
            src={arrowImg}
            alt="dropdown"
            width={12}
            height={12}
            className="caret-img"
          />
        </span>

        {/* ✅ Dropdown from JSON */}
        <ul className="categories-dropdown">
          {CATEGORIES_CONFIG.map((item, index) => {
            // Normal links
            if (item.type === "link") {
              return (
                <li key={index}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              );
            }

            // 🔥 Button 3 → WhatsApp Button
          if (item.type === "whatsapp_button") {
  return (
    <li key={index}>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          openWhatsApp();
        }}
      >
        {item.label}
      </a>
    </li>
  );
}


            return null;
          })}
        </ul>
      </li>

      <li><Link href="/contactus">Contact Us</Link></li>
      <li><Link href="/aboutus">About Us</Link></li>
      <li><Link href="/reviews">Customer Reviews</Link></li>
    </ul>
  );
};

export default DesktopMenu;
