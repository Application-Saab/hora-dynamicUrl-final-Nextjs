import Image from "next/image";
import "./chatbanner.css";
import whatsappIcon from "@/assets/whatsapp-icon.svg"
import { trackWAClicks } from "@/utils/storeWhatsappClicks";
import { MARKETING_EVENTS, trackWhatsAppButtonClick } from "@/utils/marketingEvents";
const ChatBanner = ({
  title = "Free Wedding Planning Chat",
  buttonText = "Chat Now",
  points = [
    "Pose Guidance",
    "Photography Booking",
    "Photography Tips",
  ],
  onChatClick,
}) => {
  return (
    <div className="chat-banner">
      <div className="chat-banner-left">
        <div className="chat-banner-icon">
         <Image
  src={whatsappIcon}
  alt="WhatsApp"
  width={18}
  height={18}
/>
        </div>

        <div className="chat-banner-content">
          <h3>{title}</h3>

          <div className="chat-banner-points">
            {points.map((item, index) => (
              <span key={index}>✓ {item}</span>
            ))}
          </div>
        </div>
      </div>

      <button className="chat-banner-btn" onClick={() => {
        trackWhatsAppButtonClick(MARKETING_EVENTS.WHATSAPP_BUTTONS.CHAT_NOW_PHOTOGRAPHY_BANNER, {
          button_name: "Chat Now",
          button_type: "chat_now_photography",
          page_path: window.location.pathname,
        });
        onChatClick(); 
        trackWAClicks();
        }}>
        {buttonText}
      </button>
    </div>
  );
};

export default ChatBanner;