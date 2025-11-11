"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import CategoryTabs from "@/components/wonderland/CategoryTabs"; 
import "./Templates.css";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";

const categories = [
  "All",
  "Birthday",
  "Baby Shower",
  "Anniversary",
  "Haldi & Mehndi",
  "Bachelorette",
  "Welcome Baby",
  "Premium",
];

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
        const data = await response.json();

        if (data.error) {
          setError(data.message || "Failed to fetch templates");
        } else {
          setTemplates(data?.templates || []);
        }
      } catch (err) {
        setError("Error fetching templates: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  if (loading) return <p className="loading-text">Loading templates...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="templates-page">
      <h2 className="templates-title">Explore Templates</h2>

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="templates-grid">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <div key={template._id} className="template-card">
              <Image
                src={template.webpUrl}
                alt={template.fileName}
                width={250}
                height={350}
                className="template-image"
              />
            </div>
          ))
        ) : (
          <p className="no-templates-text">No templates found.</p>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;
