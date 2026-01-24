import Link from "next/link";
import Image from "next/image";
import arrowImg from "../../assets/dropdownarrow.png";

import { CATEGORIES_CONFIG } from "@/utils/categories";
import { openWhatsApp } from "@/utils/WhatsAppRedirection";

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
    <li key={index} className="whatsapp-item">
      <button
        type="button"
        className="whats-btn"
        onClick={openWhatsApp}
      >
        {item.label}
      </button>
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
