"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiUpload } from "react-icons/fi";
import "./template.css";
import { BASE_URL, GET_ALL_TEMPLATES } from "@/utils/apiconstants";
import DefaultTemplate from "@/assets/DefaultTemplatePreview.png";
import ApplyIcon from "@/assets/ApplyTemplateIcon.svg";
import SelectedIcon from "@/assets/SelectedTemplateIcon.svg";
import { useSearchParams } from "next/navigation";
import SequentialLoader from "@/components/SequentialLoader";

const TemplateGrid = () => {
  const router = useRouter();

  const [templatesData, setTemplatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const [loadingUpload, setLoadingUpload] = useState(false);

  const userId = localStorage.getItem("userID");
  const defaultTemplateId = "68d7c6cb3d8722ccf540b91c";

  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleTimeoutFallback = (id) => {
    setTimeout(() => {
      setLoadedImages((prev) => ({
        ...prev,
        [id]: true,
      }));
    }, 2000);
  };

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
    if (!eventId) {
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
        `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
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
          router.push(`/wonderland?id=${userId}/${eventId}/host`);
        }
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

  const handleApplyClick = (templateMongoId) => {
    setSelectedTemplate(templateMongoId);
    router.push(
      `/wonderland/create-invite-template?id=${eventId}&templateId=${templateMongoId}`
    );
  };

  if (loading) return  <SequentialLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="d-flex justify-content-center">
      <div className="templateWrapper">
        <h2 className="templateTitle">Choose From 50+ Invites</h2>
        <div className="templateGrid">
          <div
            className="templateCard"
            style={{ border: "3px solid #47474733" }}
          >
            <img
              src={DefaultTemplate.src}
              alt="Template Preview"
              className="templatePreview default-img"
            />
            <button
              className={`inviteBtn ${
                selectedTemplate === defaultTemplateId ? "selectedBtn" : ""
              }`}
              style={{ position: "absolute", bottom: "-10px" }}
              onClick={() => handleApplyClick(defaultTemplateId)}
            >
              {selectedTemplate === defaultTemplateId ? (
                <>
                  SELECTED{" "}
                  <span className="btnCircle">
                    <img
                      src={SelectedIcon.src}
                      height="21px"
                      width="22px"
                      alt="Selected"
                    />
                  </span>
                </>
              ) : (
                <>
                  APPLY NOW{" "}
                  <span className="btnCircle">
                    <img src={ApplyIcon.src} alt="Apply" />
                  </span>
                </>
              )}
            </button>
          </div>
          <div
            className="upload-template-card template-upload"
            onClick={() =>
              document.getElementById("templateUploadImage").click()
            }
          >
            {loadingUpload ? (
              <div
                className="loader"
                style={{ height: "32px", width: "32px" }}
              ></div>
            ) : (
              <>
                <FiUpload size={32} />
                <span>UPLOAD YOUR TEMPLATE</span>
              </>
            )}
            <input
              type="file"
              id="templateUploadImage"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          {templatesData?.length > 0 &&
            templatesData?.map((template) => {
              const isSelected =
                selectedTemplate === template._id ||
                selectedTemplate === template.configs?.templateId;

              return (
                !template?.isDisabled && (
                  <div key={template._id} className="templateCard">
                    {!loadedImages[template._id] && (
                      <>
                        <div className="skeleton"></div>
                        {handleTimeoutFallback(template._id)}
                      </>
                    )}
                    <img
                      src={template?.webpUrl}
                      alt="Template Preview"
                      className="templatePreview"
                      style={{
                        display: loadedImages[template._id] ? "block" : "none",
                      }}
                      onLoad={() => handleImageLoad(template._id)}
                      loading="lazy"
                    />
                    {template?.webpUrl && (
                      <button
                        className={`inviteBtn ${
                          isSelected ? "selectedBtn" : ""
                        }`}
                        onClick={() => handleApplyClick(template._id)}
                      >
                        {isSelected ? (
                          <>
                            SELECTED{" "}
                            <span className="btnCircle">
                              <img
                                src={SelectedIcon.src}
                                height="21px"
                                width="22px"
                                alt="Selected"
                              />
                            </span>
                          </>
                        ) : (
                          <>
                            APPLY NOW{" "}
                            <span className="btnCircle">
                              <img src={ApplyIcon.src} alt="Apply" />
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TemplateGrid;
