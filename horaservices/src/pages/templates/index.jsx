"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import "./template.css";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
import { useSearchParams } from "next/navigation";
const TemplateGrid = () => {
  const router = useRouter();
  const [templatesData, setTemplatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
const searchParams = useSearchParams();
const eventId = searchParams.get("eventId");
const eventUserId = searchParams.get("eventUserId");
const userType = searchParams.get("userType");
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
        const data = await response.json();
        if (data.error) {
          setError(data.message || "Failed to fetch templates");
        } else {
          setTemplatesData(data?.templates || []);
        }
      } catch (err) {
        setError("Error fetching templates: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleApplyClick = (templateMongoId) => {
  setSelectedTemplate(templateMongoId);
  router.push(
    `/wonderland/create-invite-template?id=${eventId}&templateId=${templateMongoId}`
  );
};


  if (loading) return <div>Loading templates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="templateWrapper">
      <h2 className="templateTitle">Choose From 50+ Invites</h2>
    <div className="templateGrid">
  {templatesData.map((template) => {
    const isSelected = selectedTemplate === template._id;
    return (
      <div key={template._id} className="templateCard">
        <img
          src={template.webpUrl}
          alt="Template Preview"
          className="templatePreview"
        />
        <button
          className="inviteBtn"
          onClick={() => handleApplyClick(template._id)}
        >
          {isSelected ? "SELECTED" : "APPLY NOW"}{" "}
          <span className="btnCircle">✔</span>
        </button>
      </div>
    );
  })}
</div>
    </div>
  );
};

export default TemplateGrid;
