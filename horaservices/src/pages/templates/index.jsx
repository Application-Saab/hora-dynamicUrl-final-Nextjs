// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import "./template.css";
// import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";

// const TemplateGrid = () => {
//   const router = useRouter();
//   const [templatesData, setTemplatesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
//         const data = await response.json();
//         if (data.error) {
//           setError(data.message || "Failed to fetch templates");
//         } else {
//           setTemplatesData(data?.templates || []);
//         }
//       } catch (err) {
//         setError("Error fetching templates: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTemplates();
//   }, []);

//   const handleApplyClick = (templateId) => {
//     router.push(`/wonderland/create-invite-template?templateId=${templateId}`);
//   };

//   if (loading) return <div>Loading templates...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="templateWrapper">
//       <h2 className="templateTitle">Choose From 50+ Invites</h2>
//       <div className="templateGrid">
//         {templatesData.map((template) => (
//           <div key={template._id} className="templateCard">
//             <object
//               data={template.webpUrl}
//               type="image/svg+xml"
//               className="templatePreview"
//             >
//               Template Preview
//             </object>

//             <div className="button-container">
//               <button
//                 className="templateApplyBtn"
//                 onClick={() => handleApplyClick(template.configs?.templateId)}
//               >
//                 Apply
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TemplateGrid;

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import "./template.css";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";

const TemplateGrid = () => {
  const router = useRouter();
  const [templatesData, setTemplatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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

  const handleApplyClick = (templateId) => {
    setSelectedTemplate(templateId);
    router.push(`/wonderland/create-invite-template?templateId=${templateId}`);
  };

  if (loading) return <div>Loading templates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="templateWrapper">
      <h2 className="templateTitle">Choose From 50+ Invites</h2>
      <div className="templateGrid">
     {templatesData.map((template) => {
  const isSelected = selectedTemplate === template.configs?.templateId;
  return (
    <div key={template._id} className="templateCard">
      <img
        src={template.webpUrl}
        alt="Template Preview"
        className="templatePreview"
      />
      <button
        className={`inviteBtn ${isSelected ? "selectedBtn" : ""}`}
        onClick={() => handleApplyClick(template.configs?.templateId)}
      >
        {isSelected ? (
          <>
            SELECTED <span className="btnCircle">✔</span>
          </>
        ) : (
          <>
            APPLY NOW <span className="btnCircle">→</span>
          </>
        )}
      </button>
    </div>
  );
})}

      </div>
    </div>
  );
};

export default TemplateGrid;
