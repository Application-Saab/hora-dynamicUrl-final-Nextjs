"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./template.css";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
// const templates = [
//   { id: 1, image: "/assets/template1.svg" },
//   { id: 2, image: "/assets/template2.svg" },
//   { id: 3, image: "/assets/template3.svg" },
//   { id: 4, image: "/assets/template6.svg" },
//   { id: 5, image: "/assets/template7.svg" },
//   { id: 6, image: "/assets/template9.svg" },
//   { id: 7, image: "/assets/template10.svg" },
//   { id: 8, image: "/assets/template11.svg" },
// ];

const TemplateGrid = () => {
  const router = useRouter();
  const [templtesData, setTemplatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleApplyClick = (template) => {
    router.push(
      `/wonderland/create-invite-template?templateId=${template._id}`
    );
  };
  if (loading) {
    return <div>Loading templates...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="templateWrapper">
      <h2 className="templateTitle">Choose From 50+ Invites </h2>
      <div className="templateGrid">
        {templtesData?.map((template) => (
          <div key={template._id} className="templateCard">
            <object
              data={template.webpUrl}
              type="image/svg+xml"
              className="templatePreview"
            >
              Template Preview
            </object>

            <div className="button-container">
              <button
                className="templateApplyBtn"
                onClick={() => handleApplyClick(template)}
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateGrid;
