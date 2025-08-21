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
import { useRouter } from "next/router";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import "./template.css";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";

const TemplateGrid = () => {
  const router = useRouter();
  const [templatesData, setTemplatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadedTemplate, setUploadedTemplate] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const { eventid } = router.query;
  const userId = localStorage.getItem("userID");

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedTemplate({ url: imageUrl, file });
      handleUploadTemplate(imageUrl, file);
    }
  };

  const handleUploadTemplate = async (url, file) => {
    setLoadingUpload(true);
    if (!url || !file) {
      alert("Please upload an image.");
      setLoadingUpload(false);
      return;
    }
    if (!eventid) {
      alert("Event ID not found in URL");
      setLoadingUpload(false);
      return;
    }
    if (!userId) {
      alert("Please log in to upload a template.");
      setLoadingUpload(false);
      return;
    } 


    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userId);

    try {
      const response = await fetch(
        `${BASE_URL}/api/customer/event/event-invites/external-template/${eventid}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (response.ok) {
        setLoadingUpload(false);
        const data = await response.json();
        if (data) {
          setUploadedTemplate(null);
          router.push(`/wonderland?id=${userId}/${eventid}/host`);
        }
        setUploadedTemplate(null);
        // onClose();
      } else {
        setLoadingUpload(false);
        const error = await response.json();
        alert("Submission failed: " + (error.message || error.error));
      }
    } catch (error) {
      setLoadingUpload(false);
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoadingUpload(false);
    }
  };

  // useEffect(() => {
  //   if (uploadedTemplate) {
  //     handleUploadTemplate();
  //   }
  // }, [uploadedTemplate]);

  const handleApplyClick = (templateId) => {
    setSelectedTemplate(templateId);
    router.push(`/wonderland/create-invite-template?templateId=${templateId}`);
  };

  if (loading) return <div>Loading templates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="templateWrapper">
      <h2 className="templateTitle">Choose From 50+ Invites</h2>
      <h3 className="templateTitle">OR</h3>
      <div className="d-flex justify-content-center mb-4 template-upload">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => document.getElementById("templateUploadImage").click()}
        >
          {loadingUpload ? <span className="loader"></span> : "Upload Your Template"}
        </button>
        <input
          type="file"
          id="templateUploadImage"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      {/* <button type="submit" onClick={handleUploadTemplate}>Submit</button> */}
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
                    APPLY NOW <span className="btnCircle">✔</span>
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
