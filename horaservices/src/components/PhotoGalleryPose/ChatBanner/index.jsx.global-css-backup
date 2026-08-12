import Image from "next/image";
import "./chatbanner.css";
import whatsappIcon from "@/assets/whatsapp-icon.svg"
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

      <button className="chat-banner-btn" onClick={onChatClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default ChatBanner;