import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./ProductRecommendationChat.css";

const questions = [
  { key: "city", question: "Which city are you located in?", placeholder: "Enter your city" },
  { key: "eventDate", question: "When is your event date? (DD/MM/YYYY)", placeholder: "e.g., 25/12/2024" },
  { key: "categories", question: "Which categories are you interested in? (e.g., balloons, decorations, catering)", placeholder: "Enter categories" },
  { key: "product", question: "Please share the product you like or any specific requirements", placeholder: "Describe your preferences" },
];

const buildChatMessage = (text, role, extra = {}) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  text,
  role,
  ...extra,
});

const categoryLinkMap = {
  birthday: "/balloon-decoration",
  "birthday decoration": "/balloon-decoration",
  wedding: "/balloon-decoration",
  "wedding decoration": "/balloon-decoration",
  "baby shower": "/balloon-decoration",
  "baby shower decoration": "/balloon-decoration",
  anniversary: "/balloon-decoration",
  "anniversary decoration": "/balloon-decoration",
  decoration: "/balloon-decoration",
  balloon: "/balloon-decoration",
  balloons: "/balloon-decoration",
  catering: "/party-food-delivery-live-catering-buffet/party-live-buffet-catering",
  "food delivery": "/party-food-delivery-live-catering-buffet/party-food-delivery",
  "live catering": "/party-food-delivery-live-catering-buffet/party-live-buffet-catering",
  photography: "/photography-page",
  invitation: "/invitation",
  wonderland: "/wonderland",
  chef: "/caterers",
  caterers: "/caterers",
};

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getCategoryLinks = (text, city) => {
  const normalized = text.toLowerCase();
  const links = [];
  const citySlug = city ? slugify(city) : null;

  Object.entries(categoryLinkMap).forEach(([key, url]) => {
    if (normalized.includes(key) && !links.some((item) => item.url === url)) {
      const finalUrl = citySlug ? `/${citySlug}${url}` : url;
      const label = citySlug
        ? `Open ${key} page in ${citySlug}`
        : `Open ${key} page`;
      links.push({ label, url: finalUrl });
    }
  });

  return links;
};

const ProductRecommendationChat = ({ categoryBasePath = "/balloon-decoration" }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    buildChatMessage(
      "👋 Hi! I'm here to help you with your event planning. Let's get started with some details.",
      "bot"
    ),
    buildChatMessage(questions[0].question, "bot"),
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleUserResponse = async (userText) => {
    const userMessage = buildChatMessage(userText, "user");
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Store the user's answer
    const currentQuestion = questions[currentStep];
    const updatedInfo = { ...userInfo, [currentQuestion.key]: userText };
    setUserInfo(updatedInfo);

    // Build optional category link suggestions
    const categoryLinks = getCategoryLinks(userText, updatedInfo.city);

    // Move to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    setTimeout(() => {
      if (nextStep < questions.length) {
        const nextQuestion = questions[nextStep];
        setMessages((prev) => [
          ...prev,
          ...categoryLinks.map((link) =>
            buildChatMessage(
              `I found a matching page for your category: ${link.label}`,
              "bot",
              { linkUrl: link.url, linkLabel: link.label }
            )
          ),
          buildChatMessage(nextQuestion.question, "bot"),
        ]);
      } else {
        // All questions answered
        const summary = `Thank you for providing the details! Here's what you shared:\n\n🏙️ City: ${updatedInfo.city}\n📅 Event Date: ${updatedInfo.eventDate}\n📂 Categories: ${updatedInfo.categories}\n🎁 Product Preferences: ${updatedInfo.product}\n\nOur team will contact you soon with personalized recommendations! 🎉`;
        setMessages((prev) => [
          ...prev,
          ...categoryLinks.map((link) =>
            buildChatMessage(
              `I found a matching page for your category: ${link.label}`,
              "bot",
              { linkUrl: link.url, linkLabel: link.label }
            )
          ),
          buildChatMessage(summary, "bot"),
        ]);
      }
      setIsLoading(false);
    }, 500); // Small delay for natural feel
  };

  const handleSendMessage = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    handleUserResponse(trimmed);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <div className="chatWrapper">
      <button
        className="chatToggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close customer support" : "Open customer support"}
      >
        <span>{isOpen ? "✕" : "💬"}</span>
        <span>{isOpen ? "Close" : "Need help?"}</span>
      </button>

      {isOpen && (
        <div className="chatPanel">
          <div className="chatHeader">
            <div>
              <strong>💬 Customer Support</strong>
              <p>We're here to help with your event planning</p>
            </div>
            <button className="closeButton" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chatMessages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "bot"
                    ? "botMessage"
                    : "userMessage"
                }
              >
                <p>{message.text}</p>
                {message.linkUrl && (
                  <a href={message.linkUrl} target="_blank" rel="noreferrer" className="chatLink">
                    {message.linkLabel || message.linkUrl}
                  </a>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="botMessage">
                <div className="loadingMessage">
                  <span>🤖</span>
                  <span>Thinking</span>
                  <div className="loadingDots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chatInputRow">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder={questions[currentStep]?.placeholder || "Type your answer..."}
              className="chatInput"
              disabled={isLoading}
            />
            <button 
              className="sendButton" 
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendationChat;