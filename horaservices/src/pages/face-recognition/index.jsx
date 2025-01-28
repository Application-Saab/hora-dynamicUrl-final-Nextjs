// import React, { useState } from 'react';
// import axios from 'axios';
// import { useDropzone } from 'react-dropzone';
// import "./face.css";

// const FaceComparison = () => {
//     // State to hold uploaded images, results, and loading state
//     const [sourceImage, setSourceImage] = useState(null);
//     const [relatedImages, setRelatedImages] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // Use Dropzone for image uploading
//     const { getRootProps, getInputProps } = useDropzone({
//         onDrop: (acceptedFiles) => {
//             if (acceptedFiles.length > 0) {
//                 const file = acceptedFiles[0];
//                 setSourceImage(URL.createObjectURL(file));  // Display image preview

//                 // Send the file for comparison
//                 uploadAndCompareImage(file);
//             }
//         },
//         accept: 'image/jpeg, image/png',
//         maxFiles: 1,
//     });

//     // Function to handle image upload and comparison
//     const uploadAndCompareImage = async (file) => {
//         setIsLoading(true);
//         setError(null);

//         const formData = new FormData();
//         console.log(formData, "formdata");
//         formData.append("image", file);  // Append the image file for sending

//         try {
//             const response = await axios.post(
//                 'https://7odfvmh88d.execute-api.ap-south-1.amazonaws.com/dev/compare-image',
//                 formData, 
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data"
//                     }
//                 }
//             );
//             console.log(response, "response");
            
//             // Handle the response from the API
//             setRelatedImages(response.data.relatedImages);  // Display related images
//         } catch (err) {
//             console.error("Error comparing faces:", err);
//             setError("There was an error comparing faces. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="face-comparison-container">
//             <h1>Face Comparison</h1>
            
//             {/* Image upload section */}
//             <div {...getRootProps()} className="dropzone">
//                 <input {...getInputProps()} />
//                 <p>Drag & drop or click to select an image</p>
//             </div>
            
//             {/* Display uploaded source image */}
//             {sourceImage && (
//                 <div className="image-preview">
//                     <h3>Uploaded Image:</h3>
//                     <img src={sourceImage} alt="Source" />
//                 </div>
//             )}
            
//             {/* Compare button */}
//             <button onClick={uploadAndCompareImage} disabled={isLoading}>
//                 {isLoading ? "Comparing..." : "Compare Face"}
//             </button>

//             {/* Error handling */}
//             {error && <div className="error-message">{error}</div>}

//             {/* Display related images */}
//             {relatedImages.length > 0 && (
//                 <div className="related-images">
//                     <h3>Related Images:</h3>
//                     <div className="images-grid">
//                         {relatedImages.map((image, index) => (
//                             <div key={index} className="image-item">
//                                 <img src={image} alt={`Related ${index + 1}`} />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FaceComparison;

// import React, { useState } from "react";

// function ImageUploader() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [similarImages, setSimilarImages] = useState([]);

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return alert("Please select an image!");
    
//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const response = await fetch("http://localhost:5000/upload", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       setSimilarImages(data.similarImages);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//       <div>
//         {similarImages.map((img, idx) => (
//           <img key={idx} src={`http://localhost:5000/images/${img}`} alt={`Similar ${idx}`} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ImageUploader;



import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";

function App() {
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [similarImages, setSimilarImages] = useState([]); // State to store similar images
  const [loading, setLoading] = useState(false); // State to handle loading state

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Send the image to the backend
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data.similar_images, "response similar iamges");
      // Set the similar images returned by the backend
      setSimilarImages(response.data.similar_images);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while processing the image.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Face Similarity Search</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload and Search"}
        </button>
      </form>

      <h2>Similar Images</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {similarImages.map((image, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
            <Image
              src={`http://localhost:5000/images/${image.image_name}`} // Adjust the path as needed
              alt={`Similar ${index}`}
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
              width={150}
              height={150}
            />
            <p>Similarity: {(image.similarity * 100).toFixed(2)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;



// import React, { useState } from 'react';
// import axios from 'axios';
// // import './FaceComparison.css';

// const FaceComparison = () => {
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [matches, setMatches] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const handleImageSelect = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setSelectedImage(file);
//             setPreviewUrl(URL.createObjectURL(file));
//             setMatches([]); // Clear previous matches
//             setError(null);
//         }
//     };

//     const convertToBase64 = (file) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result);
//             reader.onerror = (error) => reject(error);
//             reader.readAsDataURL(file);
//         });
//     };

//     const handleCompare = async () => {
//         if (!selectedImage) {
//             setError('Please select an image first');
//             return;
//         }

//         setIsLoading(true);
//         setError(null);

//         try {
//             const base64Image = await convertToBase64(selectedImage);
            
//             const response = await axios.post('http://localhost:5000/api/compare-faces', {
//                 image: base64Image
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (response.data.matches) {
//                 setMatches(response.data.matches);
//                 if (response.data.matches.length === 0) {
//                     setError('No matching faces found');
//                 }
//             }
//         } catch (err) {
//             console.error('Error:', err);
//             setError(err.response?.data?.error || 'Error comparing faces');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="face-comparison-container">
//             <h1>Face Comparison System</h1>
            
//             <div className="upload-section">
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageSelect}
//                     className="file-input"
//                 />
                
//                 <button 
//                     onClick={handleCompare}
//                     disabled={!selectedImage || isLoading}
//                     className="compare-button"
//                 >
//                     {isLoading ? 'Processing...' : 'Compare Faces'}
//                 </button>
//             </div>

//             {error && (
//                 <div className="error-message">
//                     {error}
//                 </div>
//             )}

//             <div className="images-container">
//                 {previewUrl && (
//                     <div className="uploaded-image-section">
//                         <h2>Uploaded Image</h2>
//                         <img 
//                             src={previewUrl} 
//                             alt="Uploaded" 
//                             className="uploaded-image"
//                             style={{width: "50px", height: "50px"}}
//                         />
//                     </div>
//                 )}

//                 {matches.length > 0 && (
//                     <div className="matching-images-section">
//                         <h2>Matching Faces ({matches.length})</h2>
//                         <div className="matching-images-grid">
//                             {matches.map((match, index) => (
//                                 <div key={index} className="match-item">
//                                     <img 
//                                         src={match.image} 
//                                         alt={`Match ${index + 1}`}
//                                         className="match-image"
//                                         style={{width: "50px", height: "50px"}}
//                                     />
//                                     <p className="match-filename">{match.filename}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FaceComparison;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useDropzone } from 'react-dropzone';
// import "./face.css";

// const FaceComparison = () => {
//     const [sourceImage, setSourceImage] = useState(null);
//     const [relatedImages, setRelatedImages] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const { getRootProps, getInputProps } = useDropzone({
//         onDrop: (acceptedFiles) => {
//             if (acceptedFiles.length > 0) {
//                 const file = acceptedFiles[0];
//                 setSourceImage(URL.createObjectURL(file));  // Display image preview

//                 // Convert image to base64 and send for comparison
//                 convertToBase64(file).then(base64 => {
//                     uploadAndCompareImage(base64);
//                 });
//             }
//         },
//         accept: 'image/jpeg, image/png',
//         maxFiles: 1,
//     });

//     // Convert the image file to base64
//     const convertToBase64 = (file) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result);
//             reader.onerror = reject;
//             reader.readAsDataURL(file);
//         });
//     };

//     // Function to handle image upload and comparison
//     const uploadAndCompareImage = async (base64Image) => {
//         setIsLoading(true);
//         setError(null);

//         const requestBody = {
//             image: base64Image,  // Send base64 encoded image
//         };

//         try {
//             const response = await axios.post(
//                 'https://7odfvmh88d.execute-api.ap-south-1.amazonaws.com/dev/compare-image',
//                 requestBody, 
//                 {
//                     headers: {
//                         "Content-Type": "application/json"
//                     }
//                 }
//             );
//             console.log(response, "response");
//             setRelatedImages(response.data.relatedImages);  // Display related images
//         } catch (err) {
//             console.error("Error comparing faces:", err);
//             setError("There was an error comparing faces. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="face-comparison-container">
//             <h1>Face Comparison</h1>
//             <div {...getRootProps()} className="dropzone">
//                 <input {...getInputProps()} />
//                 <p>Drag & drop or click to select an image</p>
//             </div>

//             {sourceImage && (
//                 <div className="image-preview">
//                     <h3>Uploaded Image:</h3>
//                     <img src={sourceImage} alt="Source" />
//                 </div>
//             )}

//             <button onClick={uploadAndCompareImage} disabled={isLoading}>
//                 {isLoading ? "Comparing..." : "Compare Face"}
//             </button>

//             {error && <div className="error-message">{error}</div>}

//             {relatedImages.length > 0 && (
//                 <div className="related-images">
//                     <h3>Related Images:</h3>
//                     <div className="images-grid">
//                         {relatedImages.map((image, index) => (
//                             <div key={index} className="image-item">
//                                 <img src={image} alt={`Related ${index + 1}`} />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FaceComparison;
