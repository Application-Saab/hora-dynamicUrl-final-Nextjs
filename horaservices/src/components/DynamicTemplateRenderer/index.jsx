// "use client";
// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";

// const DynamicTemplateRenderer = () => {
//   const searchParams = useSearchParams();
//   const templateId = searchParams.get("templateId");

//   const [template, setTemplate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [data, setData] = useState({
//     name: "",
//     time: "",
//     date: "",
//     month: "",
//     address: "",
//   });

//   useEffect(() => {
//     if (!templateId) {
//       setError("No template selected");
//       setLoading(false);
//       return;
//     }

//     const fetchTemplate = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
//         const result = await response.json();

//         if (result.error) {
//           setError(result.message || "Failed to fetch template");
//         } else {
//           const selectedTemplate = result.templates.find(
//             (tpl) => tpl.configs?.templateId === templateId
//           );

//           if (selectedTemplate) {
//             const { cssCode, jsCode, fontUrls } = selectedTemplate.configs;
//             setTemplate({
//               cssCode,
//               jsCode,
//               fontUrls: JSON.parse(fontUrls),
//             });
//           } else {
//             setError("Template not found");
//           }
//         }
//       } catch (err) {
//         setError("Error fetching template: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTemplate();
//   }, [templateId]);

//  const handleChange = (e) => {
//   const { name, value } = e.target;

//   if (name === "date") {
//     // Agar user ne space ke saath month bhi likh diya ho
//     const parts = value.trim().split(" ");
//     if (parts.length >= 2) {
//       const day = parts[0];
//       const monthName = parts.slice(1).join(" ");
//       setData((prev) => ({
//         ...prev,
//         date: day,
//         month: monthName
//       }));
//       return;
//     }
//   }

//   setData((prev) => ({
//     ...prev,
//     [name]: value
//   }));
// };


//   const renderHTML = (jsCode, rawData) => {
//     return jsCode.replace(/{{(.*?)}}/g, (_, key) => rawData[key.trim()] || "");
//   };

//   if (loading) return <p>Loading template...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;
//   if (!template) return <p>No template found.</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       {template.fontUrls.map((url, idx) => (
//         <link key={idx} href={url} rel="stylesheet" />
//       ))}

//       <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />

//       <div
//         dangerouslySetInnerHTML={{
//           __html: renderHTML(template.jsCode, data),
//         }}
//       />

//       <div style={{ marginTop: "30px", maxWidth: "500px" }}>
//         <h3>Edit Invitation</h3>

//         {["name", "time", "date", "month"].map((field) => (
//           <div key={field}>
//             <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
//             <input
//               type="text"
//               name={field}
//               value={data[field]}
//               onChange={handleChange}
//               placeholder={`Enter ${field}`}
//               style={inputStyle}
//             />
//           </div>
//         ))}

//         <label>Address:</label>
//         <textarea
//           name="address"
//           value={data.address}
//           onChange={handleChange}
//           placeholder="Enter address"
//           style={{ ...inputStyle, height: "60px" }}
//         />
//       </div>
//     </div>
//   );
// };

// const inputStyle = {
//   display: "block",
//   width: "100%",
//   margin: "8px 0 16px",
//   padding: "10px",
//   fontSize: "14px",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
// };

// export default DynamicTemplateRenderer;


"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";

const DynamicTemplateRenderer = () => {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data, setData] = useState({
    name: "",
    time: "",
    date: "",
    month: "",
    address: "",
  });

  // ===== Fetch Template =====
  useEffect(() => {
    if (!templateId) {
      setError("No template selected");
      setLoading(false);
      return;
    }

    const fetchTemplate = async () => {
      try {
        const response = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
        const result = await response.json();

        if (result.error) {
          setError(result.message || "Failed to fetch template");
        } else {
          const selectedTemplate = result.templates.find(
            (tpl) => tpl.configs?.templateId === templateId
          );

          if (selectedTemplate) {
            const { cssCode, jsCode, fontUrls } = selectedTemplate.configs;
            setTemplate({
              cssCode,
              jsCode,
              fontUrls: JSON.parse(fontUrls),
            });
          } else {
            setError("Template not found");
          }
        }
      } catch (err) {
        setError("Error fetching template: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  // ===== Handle Form Changes =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      const parts = value.trim().split(" ");
      if (parts.length >= 2) {
        const day = parts[0];
        const monthName = parts.slice(1).join(" ");
        setData((prev) => ({
          ...prev,
          date: day,
          month: monthName, // auto set
        }));
        return;
      }
    }

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===== Replace Variables in Template =====
  const renderHTML = (jsCode, rawData) => {
    return jsCode.replace(/{{(.*?)}}/g, (_, key) => rawData[key.trim()] || "");
  };

  // ===== Render States =====
  if (loading) return <p>Loading template...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!template) return <p>No template found.</p>;

  // ===== JSX =====
  return (
    <div style={{ padding: "20px" }}>
      {/* Load Template Fonts */}
      {template.fontUrls.map((url, idx) => (
        <link key={idx} href={url} rel="stylesheet" />
      ))}

      {/* Apply Template CSS */}
      <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />

      {/* Template Preview */}
      <div
        dangerouslySetInnerHTML={{
          __html: renderHTML(template.jsCode, data),
        }}
      />

      {/* Edit Form */}
      <div style={{ marginTop: "30px", maxWidth: "500px" }}>
        <h3>Edit Invitation</h3>

        {/* name, time, date only */}
        {["name", "time", "date"].map((field) => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="text"
              name={field}
              value={data[field]}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
              style={inputStyle}
            />
          </div>
        ))}

        {/* Address */}
        <label>Address:</label>
        <textarea
          name="address"
          value={data.address}
          onChange={handleChange}
          placeholder="Enter address"
          style={{ ...inputStyle, height: "60px" }}
        />
      </div>
    </div>
  );
};

const inputStyle = {
  display: "block",
  width: "100%",
  margin: "8px 0 16px",
  padding: "10px",
  fontSize: "14px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

export default DynamicTemplateRenderer;
