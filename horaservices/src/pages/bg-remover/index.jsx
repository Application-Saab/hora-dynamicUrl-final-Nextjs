import React, { useState } from "react";
import axios from "axios";

const BgRemover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file first.");
      return;
    }

    setLoading(true);
    setResultImage(null); // Purani image clear karne ke liye

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Python Backend URL (Make sure your Python server is running on port 8000)
      const response = await axios.post(
        "https://swmhkvn8-8000.inc1.devtunnels.ms/remove-bg",
        formData,
        {
          responseType: "blob", // Important: Image binary data receive karne ke liye
        },
      );

      // Binary blob ko URL mein convert karna taaki <img> tag mein dikh sake
      const imageUrl = URL.createObjectURL(response.data);
      setResultImage(imageUrl);
    } catch (error) {
      console.error("Background removal error:", error);
      alert(
        "error to connect to the server. Make sure your Python backend is running on port 8000.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial" }}>
      <h2>Image Background Remover</h2>

      <div style={{ marginBottom: "20px" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#ccc" : "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : "Remove Background"}
      </button>

      {resultImage && (
        <div style={{ marginTop: "30px" }}>
          <h3>Result:</h3>
          <img 
            src={resultImage} 
            alt="Background Removed" 
            style={{ 
                maxWidth: '100%', 
                maxHeight: '400px', 
                // border: '1px solid #ddd'
             }} 
          />
          {/* <div
            style={{
              backgroundImage:
                "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              backgroundColor: "white", // Chessboard pattern for transparency check
            //   padding: "10px",
            }}
          >
            <img src={resultImage} alt="Cutout" style={{ maxWidth: "100%" }} />
          </div> */}
          <br />
          <a
            href={resultImage}
            download="hora_service_bg_removed.png"
            style={{
              display: "inline-block",
              marginTop: "10px",
              color: "#0070f3",
            }}
          >
            Download Processed Image
          </a>
        </div>
      )}
    </div>
  );
};

export default BgRemover;
