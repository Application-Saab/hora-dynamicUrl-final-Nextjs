import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SvgEditor() {
  const router = useRouter();
  const { id } = router.query;
  const svgPath = `http://localhost:3002/api/svgs/${id}.svg`;

  const [svgContent, setSvgContent] = useState("");
  const [fullname, setFullname] = useState("John Doe");
  const [date, setDate] = useState("25 Nov 2025");
  const [time, setTime] = useState("9:00 PM");
  const [address, setAddress] = useState("Address");
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(svgPath)
        .then((response) => response.text())
        .then((data) => setSvgContent(data))
        .catch((error) => console.error("Error loading SVG:", error));
    }
  }, [id]);

  useEffect(() => {
    if (svgContent) {
      const container = document.getElementById("svg-container");
      if (container) {
        container.innerHTML = svgContent;
        const svgElement = container.querySelector("svg");

        if (svgElement) {
          const nameText = svgElement.querySelector("#name");
          if (nameText) nameText.textContent = fullname;

          const dateText = svgElement.querySelector("#date");
          if (dateText) dateText.textContent = date;

          const timeText = svgElement.querySelector("#time");
          if (timeText) timeText.textContent = time;

          const addressText = svgElement.querySelector("#address");
          if (addressText) addressText.textContent = address;

          if (uploadedImage) {
            const imageElement = svgElement.querySelector('[data-id="uniqueImage1"]');
            if (imageElement) {
              imageElement.setAttribute("xlink:href", uploadedImage);
            }
          }
        }
      }
    }
  }, [svgContent, fullname, date, time, address, uploadedImage]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result); // Convert to base64 URL for preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => router.push("/testing")}>
        ⬅ Back
      </button>

      <div className="editor-container">
        {/* Left Side - SVG Preview */}
        <div className="svg-preview">
          <div id="svg-container" />
        </div>

        {/* Right Side - Editing Controls */}
        <div className="edit-controls">
          <h2>Edit Details</h2>
          <input
            type="text"
            placeholder="Enter Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <h3>Upload Image</h3>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
        }

        .back-button {
          background-color: #007bff;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-bottom: 20px;
        }

        .editor-container {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .svg-preview {
          flex: 1;
          padding: 20px;
          border: 1px solid #ddd;
          background: #f9f9f9;
          text-align: center;
        }

        #svg-container {
          width: 50%;
          height: 50%;
          display: inline-block;
        }

        .edit-controls {
          flex: 1;
          padding: 20px;
          border: 1px solid #ddd;
          background: #fff;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .edit-controls h2 {
          margin-bottom: 10px;
          font-size: 18px;
          color: #333;
        }

        .edit-controls input {
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        @media (max-width: 768px) {
          .editor-container {
            flex-direction: column;
          }

          .svg-preview,
          .edit-controls {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
