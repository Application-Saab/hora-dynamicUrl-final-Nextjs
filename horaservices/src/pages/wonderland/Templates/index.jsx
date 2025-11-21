"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryTabs from "@/components/wonderland/CategoryTabs";
import TemplateSkeleton from "@/components/wonderland/TemplateSkeleton";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
import "./Templates.css";

const TemplatesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventid");

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Birthday");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [uploading, setUploading] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
        const data = await res.json();
        if (data.error) throw new Error(data.message || "Failed to fetch templates");
        setTemplates(data.templates || []);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);


  useEffect(() => {
    if (loading) return;
    setCategoryLoading(true);
    const timer = setTimeout(() => setCategoryLoading(false), 400);
    return () => clearTimeout(timer);
  }, [activeCategory, loading]);

const filteredTemplates = useMemo(
  () =>
    templates.filter(
      (template) =>
        template.category?.trim().toLowerCase() === activeCategory.toLowerCase().trim() && 
        !template.isDisabled
    ),
  [templates, activeCategory]
);

const smallTemplates = filteredTemplates.filter(
  t => t.templateSize === "small" || !t.templateSize
);

const bigTemplates = filteredTemplates.filter(
  t => t.templateSize?.toLowerCase() === "big"
);



const smartOrdered = [];
const maxLen = Math.max(smallTemplates.length, bigTemplates.length);
let smallIndex = 0;
let bigIndex = 0;

while (smallIndex < smallTemplates.length || bigIndex < bigTemplates.length) {
  // 2 small
  if (smallTemplates[smallIndex]) smartOrdered.push(smallTemplates[smallIndex++]);
  if (smallTemplates[smallIndex]) smartOrdered.push(smallTemplates[smallIndex++]);

  // 2 big
  if (bigTemplates[bigIndex]) smartOrdered.push(bigTemplates[bigIndex++]);
  if (bigTemplates[bigIndex]) smartOrdered.push(bigTemplates[bigIndex++]);
}


  const handleApply = (templateId) => {
    if (!eventId) {
      alert("Missing event ID.");
      return;
    }
    router.push(`/wonderland/templates/create-template?id=${eventId}&templateId=${templateId}`);
  };

  const handleUploadClick = () => document.getElementById("custom-template-upload")?.click();

  const handleUploadChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!eventId || !userId) {
      return;
    }
    uploadCustomTemplate(file);
  };

  const uploadCustomTemplate = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userId);

    try {
      const res = await fetch(
        `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
        {
          method: "PUT",
          headers: { Authorization: token || "" },
          body: formData,
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Upload failed");
      }
      router.replace(`/wonderland/invite?eventid=${eventId}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <TemplateSkeleton />;

  return (
    <div className="templates-page">
      <h2 className="templates-title">Explore Themes</h2>

      <CategoryTabs
        categories={["Birthday", "Sports", "Party", "Office", "Kitty", "Holiday"]}
        selectedCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <div className="upload-banner" onClick={handleUploadClick}>
        <div className="upload-icon-wrapper">
        <span className="upload-plus">+</span>
        </div>
        <p>Upload Our Own Design</p>
        <input
          id="custom-template-upload"
          type="file"
          accept="image/*"
          hidden
          onChange={handleUploadChange}
        />
        {uploading && <div className="upload-overlay">Uploading…</div>}
      </div>

      {categoryLoading ? (
        <TemplateSkeleton onlyCards />
      ) : smartOrdered.length ? (
        <div className="templates-grid">
       {smartOrdered.map((template) => (
  <div key={template._id} className="template-card" onClick={() => handleApply(template._id)}>
    <span className="try-pill">Try</span>
    <Image
      src={template.webpUrl}
      alt={template.fileName}
      width={250}
      height={350}
      className="template-image"
      onLoad={() =>
        setLoadedImages((prev) => ({
          ...prev,
          [template._id]: true,
        }))
      }
      style={{ visibility: loadedImages[template._id] ? "visible" : "hidden" }}
    />
    {!loadedImages[template._id] && <div className="template-skeleton" />}
  </div>
))}

        </div>
      ) : (
        <p className="no-templates-text">No templates found.</p>
      )}
    </div>
  );
};

export default TemplatesPage;