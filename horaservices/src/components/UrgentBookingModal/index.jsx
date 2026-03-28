import React from "react";
import "./urgentModal.css";
import Image from "next/image";
import ClockImage from "@/assets/ClockCircle.webp"
import WhatsAppIcon from "@/assets/whatsapp-icon.svg";
const UrgentBookingModal = ({ onClose ,onWhatsApp}) => {

  return (
    <div className="urgent-overlay" onClick={onClose}>
      <div className="urgent-card" onClick={(e) => e.stopPropagation()}>

        <div className="urgent-icon">
          <Image src={ClockImage} alt="clock" />
        </div>

        <h2>Urgent Booking Alert</h2>

        <p className="desc">
          For urgent orders (booked within 24 hours), please contact the
          customer support team for assistance.
        </p>

   <button className="whatsapp-btn" onClick={onWhatsApp}>
  <Image src={WhatsAppIcon} alt="whatsapp" className="wa-icon" />
  Book On WhatsApp
</button>

        <p className="note">
          We provide faster assistance for last-minute bookings.
        </p>

      </div>
    </div>
  );
};

export default UrgentBookingModal;