// components/BottomNav.jsx
import Image from "next/image";
import Link from "next/link";
import eventIcon from "../../assets/nav_icon/events.png";
import messageIcon from "../../assets/nav_icon/message.png";
import servicesIcon from "../../assets/nav_icon/services.png";
import accountIcon from "../../assets/nav_icon/account.png";
import "./bottomNav.css";

export default function BottomNav({ id }) {
  return (
    <div className="bottom-nav">
      
     <Link href={`/wonderland?id=${id || ""}`}>
      <div className="nav-item">
        <Image src={eventIcon} alt="Events Icon" className="nav-icon" />
        <span className="nav-text">Events</span>
      </div>
      </Link>

     <Link href={`/chat?id=${id || ""}`}>
  <div className="nav-item">
    <Image src={messageIcon} alt="Message Icon" className="nav-icon" />
    <span className="nav-text">Chats</span>
  </div>
</Link>


      <div className="nav-item">
        <Image src={servicesIcon} alt="Services Icon" className="nav-icon" />
        <span className="nav-text">Services</span>
      </div>

      <div className="nav-item">
        <Image src={accountIcon} alt="Account Icon" className="nav-icon" />
        <span className="nav-text">Accounts</span>
      </div>
    </div>
  );
}
