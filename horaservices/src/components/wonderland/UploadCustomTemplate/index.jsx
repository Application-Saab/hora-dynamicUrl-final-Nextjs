"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BASE_URL } from "@/utils/apiconstants";
import { saveTemplate } from "@/utils/indexedDB";
import CustomButton from "@/components/wonderland/common/CustomButton";
import "./UploadCustomTemplate.css";

const UploadCustomTemplate = ({
  eventId,
  userId,
  token,
  label = "Upload Your Own Design",
}) => {
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const pathname = usePathname();
  const isWonderlandInternational = pathname?.startsWith(
    "/wonderinternational",
  );


  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleUpload = async () => {
    if (!imageSrc) return;

    try {
      setUploading(true);

      const blob = await fetch(imageSrc).then((r) => r.blob());

      const formData = new FormData();
      formData.append("image", blob);
      formData.append("userId", userId);

      await fetch(
        `${BASE_URL}/api/customer/event/event-invites/external-template/${eventId}`,
        {
          method: "PUT",
          headers: { Authorization: token },
          body: formData,
        },
      );

      await saveTemplate(`template_${eventId}`, imageSrc);

      router.replace(`${isWonderlandInternational ? "/wonderinternational" : "/wonderland"}/invite?eventid=${eventId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Upload Card */}
      <div
        className="upload-banner"
        onClick={() =>
          document.getElementById("custom-template-upload").click()
        }
      >
        <div className="upload-icon-wrapper">
          <span className="upload-plus">+</span>
        </div>
        <p>{label}</p>
      </div>

      <input
        id="custom-template-upload"
        type="file"
        accept="image/*"
        hidden
        onChange={onSelectFile}
      />

      {imageSrc && (
        <div className="crop-modal">
          <div
            className="crop-bg"
            style={{ backgroundImage: `url(${imageSrc})` }}
          />

          <div className="crop-spacer" />

          <div className="image-preview-wrapper">
            <img src={imageSrc} alt="Preview" className="preview-image" />
          </div>

          <div className="crop-spacer" />

          <div className="crop-footer">
            <CustomButton
              title="Cancel"
              variant="outline"
              onClick={() => setImageSrc(null)}
              buttonClass="crop-btn"
            />
            <CustomButton
              title="Upload"
              variant="primary"
              onClick={handleUpload}
              loading={uploading}
              disabled={uploading}
              buttonClass="crop-btn"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UploadCustomTemplate;
