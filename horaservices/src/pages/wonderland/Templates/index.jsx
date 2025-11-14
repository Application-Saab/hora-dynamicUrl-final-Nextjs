// "use client";
// import { useState, useEffect } from "react";
// import Image from "next/image";
// import CategoryTabs from "@/components/wonderland/CategoryTabs";
// import "./Templates.css";
// import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
// import TemplateSkeleton from "@/components/wonderland/TemplateSkeleton";

// const categories = [
//   "Birthday",
//   "Baby Shower",
//   "Anniversary",
//   "Haldi & Mehndi",
//   "Bachelorette",
//   "Welcome Baby",
//   "Premium",
// ];

// const TemplatesPage = () => {
//   const [templates, setTemplates] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("Birthday");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [categoryLoading, setCategoryLoading] = useState(false);
//   const [filteredTemplates, setFilteredTemplates] = useState([]);

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}${GET_ALL_TEMPLATES}`);
//         const data = await response.json();

//         if (data.error) {
//           setError(data.message || "Failed to fetch templates");
//         } else {
//           setTemplates(data?.templates || []);
//         }
//       } catch (err) {
//         setError("Error fetching templates: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTemplates();
//   }, []);

//   useEffect(() => {
//     if (loading) return; 

//     setCategoryLoading(true);

//     const timer = setTimeout(() => {
//       const filtered = templates.filter(
//         (t) => t.category === selectedCategory
//       );
//       setFilteredTemplates(filtered);
//       setCategoryLoading(false);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [selectedCategory, templates, loading]);

//   useEffect(() => {
//     if (!loading && templates.length > 0) {
//       const filtered = templates.filter(
//         (t) => t.category === selectedCategory
//       );
//       setFilteredTemplates(filtered);
//     }
//   }, [templates, loading]);

//   if (loading) return <TemplateSkeleton />
//   if (error) return <p className="error-text">{error}</p>;

//   return (
//     <div className="templates-page">
//       <h2 className="templates-title">Explore Templates</h2>

//       <CategoryTabs
//         categories={categories}
//         selectedCategory={selectedCategory}
//         onSelectCategory={setSelectedCategory}
//       />

//       <div className="templates-grid">
//         {categoryLoading ? (
//           <TemplateSkeleton onlyCards /> 
//         ) : filteredTemplates.length > 0 ? (
//           filteredTemplates.map((template) => (
//             <div key={template._id} className="template-card">
//               <div className="try-badge">Try</div>
//               <Image
//                 src={template.webpUrl}
//                 alt={template.fileName}
//                 width={250}
//                 height={350}
//                 className="template-image"
//               />
//             </div>
//           ))
//         ) : (
//           <p className="no-templates-text">No templates found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TemplatesPage;



"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import CategoryTabs from "@/components/wonderland/CategoryTabs";
import "./Templates.css";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
import TemplateSkeleton from "@/components/wonderland/TemplateSkeleton";

const categories = [
  "Birthday",
  "Baby Shower",
  "Anniversary",
  "Haldi & Mehndi",
  "Bachelorette",
  "Welcome Baby",
  "Premium",
];

const TemplatesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventid");

  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Birthday");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [filteredTemplates, setFilteredTemplates] = useState([]);

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

  useEffect(() => {
    if (loading) return;

    setCategoryLoading(true);

    const timer = setTimeout(() => {
      const filtered = templates.filter(
        (t) => t.category === selectedCategory
      );
      setFilteredTemplates(filtered);
      setCategoryLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedCategory, templates, loading]);

  const handleApplyClick = (templateMongoId) => {
    router.push(
      `/wonderland/templates/create-template?id=${eventId}&templateId=${templateMongoId}`
    );
  };

  if (loading) return <TemplateSkeleton />;
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
        {categoryLoading ? (
          <TemplateSkeleton onlyCards />
        ) : filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <div
              key={template._id}
              className="template-card"
              onClick={() => handleApplyClick(template._id)}
            >
              <div className="try-badge">Try</div>
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
