import "./chatbanner.css";

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            width="18"
            height="18"
          >
            <path d="M20.52 3.48A11.82 11.82 0 0 0 12.07 0C5.43 0 .02 5.41.02 12.05c0 2.12.55 4.19 1.59 6.01L0 24l6.12-1.6a11.99 11.99 0 0 0 5.95 1.52h.01c6.64 0 12.05-5.41 12.05-12.05 0-3.22-1.25-6.24-3.61-8.39z" />
          </svg>
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