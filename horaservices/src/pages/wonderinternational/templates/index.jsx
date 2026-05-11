"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryTabs from "@/components/wonderland/CategoryTabs";
import TemplateSkeleton from "@/components/wonderland/TemplateSkeleton";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
import "./Templates.css";
import TemplateGrid from "@/components/wonderland/TemplatesGrid";
import UploadCustomTemplate from "@/components/wonderland/UploadCustomTemplate";

const TemplatesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventid");

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(() => {
    if (typeof window === "undefined") return "Birthday";
    return sessionStorage.getItem("activeTemplateCategory") || "Birthday";
  });
  useEffect(() => {
    sessionStorage.setItem("activeTemplateCategory", activeCategory);
  }, [activeCategory]);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const cached = sessionStorage.getItem("allTemplates");

    if (cached) {
      setTemplates(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const fetchTemplates = async () => {
      try {
        const res = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
        const data = await res.json();

        if (data.error) throw new Error();

        setTemplates(data.templates || []);
        sessionStorage.setItem(
          "allTemplates",
          JSON.stringify(data.templates || []),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = useMemo(
    () =>
      templates.filter(
        (template) =>
          template.category?.trim().toLowerCase() ===
            activeCategory.toLowerCase().trim() && !template.isDisabled,
      ),
    [templates, activeCategory],
  );

  const smallTemplates = filteredTemplates.filter(
    (t) => t.templateSize === "small" || !t.templateSize,
  );

  const bigTemplates = filteredTemplates.filter(
    (t) => t.templateSize?.toLowerCase() === "big",
  );

  const smartOrdered = [];
  let smallIndex = 0;
  let bigIndex = 0;

  while (smallIndex < smallTemplates.length || bigIndex < bigTemplates.length) {
    // 2 small
    if (smallTemplates[smallIndex])
      smartOrdered.push(smallTemplates[smallIndex++]);
    if (smallTemplates[smallIndex])
      smartOrdered.push(smallTemplates[smallIndex++]);

    // 2 big
    if (bigTemplates[bigIndex]) smartOrdered.push(bigTemplates[bigIndex++]);
    if (bigTemplates[bigIndex]) smartOrdered.push(bigTemplates[bigIndex++]);
  }

  const handleApply = (templateId) => {
    if (!eventId) {
      alert("Missing event ID.");
      return;
    }
    router.push(
      `/wonderinternational/templates/create-template?id=${eventId}&templateId=${templateId}`,
    );
  };

  if (loading) return <TemplateSkeleton />;

  return (
    <div className="templates-page">
      <h2 className="templates-title">Explore Themes</h2>

      <CategoryTabs
        categories={["Birthday", "BabyShower", "Annaprashan", "WelcomeBaby"]}
        selectedCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <UploadCustomTemplate eventId={eventId} userId={userId} token={token} />

      {/* ONLY FIRST LOAD SKELETON */}
      {loading ? (
        <TemplateSkeleton />
      ) : smartOrdered.length ? (
        <TemplateGrid templates={smartOrdered} onApply={handleApply} />
      ) : (
        <p className="no-templates-text">No templates found.</p>
      )}
    </div>
  );
};

export default TemplatesPage;
