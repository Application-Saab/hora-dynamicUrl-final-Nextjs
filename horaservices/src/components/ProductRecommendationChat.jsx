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

// Kids Birthday Themes from the platform
const kidsBirthdayThemes = [
  { id: "minnie-mouse", name: "Minnie Mouse", emoji: "🎀" },
  { id: "cocomelon", name: "Cocomelon", emoji: "🎵" },
  { id: "mickey", name: "Mickey Ring", emoji: "👑" },
  { id: "mermaid", name: "Mermaid", emoji: "🧜‍♀️" },
  { id: "jungle", name: "Jungle", emoji: "🦁" },
];

// Product database with themes and categories
const productsDatabase = [
  // Minnie Mouse Products
  { id: 1, name: "Minnie Mouse Theme Decoration", theme: "minnie-mouse", category: "kids-birthday", price: "₹1,812", image: "🎀", keywords: ["minnie", "mouse", "kids", "birthday"] },
  { id: 2, name: "Minnie Mouse Birthday Ring Setup", theme: "minnie-mouse", category: "kids-birthday", price: "₹2,500", image: "🎀", keywords: ["minnie", "kids", "birthday"] },
  { id: 3, name: "Cocomelon Theme For Birthday Kids", theme: "cocomelon", category: "kids-birthday", price: "₹2,887", image: "🎵", keywords: ["cocomelon", "kids", "birthday"] },
  { id: 4, name: "Cocomelon theme With Shining Balloons", theme: "cocomelon", category: "kids-birthday", price: "₹7,687", image: "🎵", keywords: ["cocomelon", "theme", "kids"] },
  { id: 5, name: "Mickey Ring Birthday Decoration", theme: "mickey", category: "kids-birthday", price: "₹3,158", image: "👑", keywords: ["mickey", "ring", "birthday", "kids"] },
  { id: 6, name: "Mickey Mouse Theme Party", theme: "mickey", category: "kids-birthday", price: "₹2,800", image: "👑", keywords: ["mickey", "kids", "birthday"] },
  { id: 7, name: "Mermaid Theme Birthday Ring Decor", theme: "mermaid", category: "kids-birthday", price: "₹7,019", image: "🧜‍♀️", keywords: ["mermaid", "theme", "birthday", "kids"] },
  { id: 8, name: "Mermaid Sea Shell Shore Decor", theme: "mermaid", category: "kids-birthday", price: "₹2,293", image: "🧜‍♀️", keywords: ["mermaid", "kids", "birthday"] },
  { id: 9, name: "Jungle Theme Birthday Decoration Bundle", theme: "jungle", category: "kids-birthday", price: "₹2,999", image: "🦁", keywords: ["jungle", "birthday", "kids"] },
  { id: 10, name: "Safari Birthday Balloons & Banners", theme: "jungle", category: "kids-birthday", price: "₹1,999", image: "🦒", keywords: ["jungle", "kids", "birthday"] },
];

const getProductRecommendations = (text, selectedTheme) => {
  const normalized = text.toLowerCase();
  const recommendations = [];
  const addedIds = new Set();

  productsDatabase.forEach((product) => {
    // If a theme is selected, prioritize that theme
    if (selectedTheme && product.theme === selectedTheme) {
      if (!addedIds.has(product.id)) {
        recommendations.push({ ...product, matchScore: 10 });
        addedIds.add(product.id);
      }
    } else if (!selectedTheme) {
      // If no theme selected, match by keywords
      const matchCount = product.keywords.filter((keyword) =>
        normalized.includes(keyword)
      ).length;

      if (matchCount > 0 && !addedIds.has(product.id)) {
        recommendations.push({ ...product, matchScore: matchCount });
        addedIds.add(product.id);
      }
    }
  });

  // Sort by match score (descending)
  return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
};

const ProductRecommendationChat = ({ categoryBasePath = "/balloon-decoration" }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    buildChatMessage(
      "👋 Hi! i am your Hora assistant. I will help you find the perfect decoration for your event.",
      "bot"
    ),
    buildChatMessage(questions[0].question, "bot"),
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

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
          buildChatMessage(nextQuestion.question, "bot"),
        ]);
      } else {
        // All questions answered
        const userTextNormalized = updatedInfo.product.toLowerCase();
        const isKidsBirthday = userTextNormalized.includes("kids") && userTextNormalized.includes("birthday");
        
        if (isKidsBirthday && !selectedTheme) {
          // Show theme selector for kids birthday
          setShowThemeSelector(true);
          setMessages((prev) => [
            ...prev,
            buildChatMessage(
              "✨ Great! We have amazing kids birthday themes! Select one that matches your preference:",
              "bot"
            ),
            {
              id: `theme-selector-${Date.now()}`,
              text: "Select a theme",
              role: "bot",
              isThemeSelector: true,
              themes: kidsBirthdayThemes,
            },
          ]);
        } else {
          // Get product recommendations - pass selectedTheme if available
          const recommendations = getProductRecommendations(updatedInfo.product, selectedTheme);
          const summary = `Thank you for providing the details! Here's what you shared:\n\n🏙️ City: ${updatedInfo.city}\n📅 Event Date: ${updatedInfo.eventDate}\n📂 Categories: ${updatedInfo.categories}\n🎁 Product Preferences: ${updatedInfo.product}${selectedTheme ? `\n🎨 Theme: ${kidsBirthdayThemes.find(t => t.id === selectedTheme)?.name}` : ""}\n\nCheck the below products 🎉`;
          
          const newMessages = [
            ...messages,
            buildChatMessage(summary, "bot"),
          ];

          // Add product recommendations if any found
          if (recommendations.length > 0) {
            newMessages.push(
              buildChatMessage(
                "✨ Based on your preferences, here are some products we recommend:",
                "bot"
              )
            );
            recommendations.forEach((product) => {
              newMessages.push({
                id: `product-${product.id}`,
                text: product.name,
                role: "bot",
                isProduct: true,
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                  theme: product.theme,
                },
              });
            });
          }

          setMessages(newMessages);
        }
      }
      setIsLoading(false);
    }, 500); // Small delay for natural feel
  };

  const handleThemeSelect = (themeId) => {
    const selectedThemeObj = kidsBirthdayThemes.find(t => t.id === themeId);
    setSelectedTheme(themeId);
    setShowThemeSelector(false);
    
    // Add bot message confirming selection
    setMessages((prev) => [
      ...prev,
      buildChatMessage(`You selected: ${selectedThemeObj.emoji} ${selectedThemeObj.name}`, "bot"),
    ]);
    
    setIsLoading(true);
    setTimeout(() => {
      // Get product recommendations with selected theme
      const recommendations = getProductRecommendations(userInfo.product, themeId);
      const summary = `Great choice! ${selectedThemeObj.emoji} Here are the ${selectedThemeObj.name} decoration products we recommend:`;
      
      const newMessages = [
        buildChatMessage(summary, "bot"),
      ];

      recommendations.forEach((product) => {
        newMessages.push({
          id: `product-${product.id}`,
          text: product.name,
          role: "bot",
          isProduct: true,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            theme: product.theme,
          },
        });
      });

      setMessages((prev) => [...prev, ...newMessages]);
      setIsLoading(false);
    }, 500);
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
                {message.isProduct ? (
                  <div className="productCard">
                    <div className="productImage">{message.product.image}</div>
                    <div className="productInfo">
                      <h4>{message.product.name}</h4>
                      <p className="productPrice">{message.product.price}</p>
                      <button className="bookNowButton" onClick={() => {
                        alert(`Product: ${message.product.name}\nPrice: ${message.product.price}\nTheme: ${message.product.theme}\n\nRedirecting to booking...`);
                      }}>
                        📅 Book Now
                      </button>
                    </div>
                  </div>
                ) : message.isThemeSelector ? (
                  <div className="themeSelectorContainer">
                    <p>{message.text}</p>
                    <div className="themeButtonsGrid">
                      {message.themes.map((theme) => (
                        <button
                          key={theme.id}
                          className="themeButton"
                          onClick={() => handleThemeSelect(theme.id)}
                        >
                          <span className="themeEmoji">{theme.emoji}</span>
                          <span className="themeName">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{message.text}</p>
                    {message.linkUrl && (
                      <a href={message.linkUrl} target="_blank" rel="noreferrer" className="chatLink">
                        {message.linkLabel || message.linkUrl}
                      </a>
                    )}
                  </>
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