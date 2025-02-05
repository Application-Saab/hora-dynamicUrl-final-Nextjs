// import React, { useEffect, useRef } from 'react';
// import { fabric } from 'fabric';

// const template = [
//   {
//     id: 1,
//     name: "Template 1",
//     image: "/assets/child.png", // Ensure this path is correct
//     zones: [
//       { type: "text", label: "Name", x: 100, y: 200, fontSize: 30, color: "red" },
//       { type: "text", label: "Date", x: 100, y: 250, fontSize: 20, color: "blue" },
//       { type: "image", label: "Photo", x: 400, y: 150, width: 150, height: 150 },
//     ],
//   },
// ];

// function Editor({ template }) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const canvas = new fabric.Canvas(canvasRef.current);

//     // Load the template image as the background
//     fabric.Image.fromURL(template.image, (img) => {
//       if (img) {
//         console.log("Image loaded:", img); // Debugging: Check if image loaded correctly

//         // Set background image with proper scaling
//         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
//           scaleX: canvas.width / img.width,
//           scaleY: canvas.height / img.height,
//         });
//       } else {
//         console.error("Failed to load image");
//       }

//       // Render editable zones
//       template.zones.forEach((zone) => {
//         if (zone.type === "text") {
//           const text = new fabric.IText(zone.label, {
//             left: zone.x,
//             top: zone.y,
//             fontSize: zone.fontSize,
//             fill: zone.color,
//           });
//           canvas.add(text);
//         } else if (zone.type === "image") {
//           const placeholder = new fabric.Rect({
//             left: zone.x,
//             top: zone.y,
//             width: zone.width,
//             height: zone.height,
//             fill: "rgba(255, 255, 255, 0.5)",
//             stroke: "black",
//             strokeWidth: 2,
//           });
//           placeholder.on("mouseup", () => handleImageUpload(canvas, placeholder));
//           canvas.add(placeholder);
//         }
//       });
//     }, { crossOrigin: "anonymous" });

//     return () => {
//       canvas.dispose();
//     };
//   }, [template]);

//   const handleImageUpload = (canvas, placeholder) => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";
//     input.onchange = (event) => {
//       const file = event.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           fabric.Image.fromURL(e.target.result, (img) => {
//             img.set({
//               left: placeholder.left,
//               top: placeholder.top,
//               width: placeholder.width,
//               height: placeholder.height,
//               scaleX: placeholder.scaleX,
//               scaleY: placeholder.scaleY,
//             });
//             canvas.remove(placeholder);
//             canvas.add(img);
//           });
//         };
//         reader.readAsDataURL(file);
//       }
//     };
//     input.click();
//   };

//   return <canvas ref={canvasRef} width={800} height={600}></canvas>;
// }

// export default Editor;


import React from 'react';
import { useRouter } from "next/router";
import './second.css'; // Optional, for styling

const template = [
  {
    id: 1,
    name: "Template 1",
    image: "/assets/child.png", // Ensure this path is correct
  },
  {
    id: 2,
    name: "Template 2",
    image: "/assets/child.png", // Add another image if needed
  },
  // Add more templates as needed
];

function TemplateList() {
const router = useRouter();

  const handleTemplateClick = (id) => {
    // history.push(`/testinginvitation/id=${id}`);
    router.push(`/testinginvitation/${id}`);
  };

  return (
    <div className="template-list">
      <h1>Select a Template</h1>
      <div className="card-container">
        {template.map((tmpl) => (
          <div key={tmpl.id} className="card" onClick={() => handleTemplateClick(tmpl.id)}>
            <img src={tmpl.image} alt={tmpl.name} />
            <h3>{tmpl.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateList;

// import React, { useEffect, useRef, useState } from 'react';
// import { fabric } from 'fabric';

// const template = [
//   {
//     id: 1,
//     name: "Template 1",
//     image: "/assets/child.png", // Ensure this path is correct
//     zones: [
//       { type: "text", label: "Name", x: 100, y: 200, fontSize: 30, color: "red" },
//       { type: "text", label: "Date", x: 100, y: 250, fontSize: 20, color: "blue" },
//       { type: "image", label: "Photo", x: 400, y: 150, width: 150, height: 150 },
//     ],
//   },
// ];

// function Editor({ template }) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const canvas = new fabric.Canvas(canvasRef.current);

//     // Load the template image as the background
//     fabric.Image.fromURL(template.image, (img) => {
//       if (img) {
//         console.log("Image loaded:", img); // Debugging: Check if image loaded correctly

//         // Set background image with proper scaling
//         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
//           scaleX: canvas.width / img.width,
//           scaleY: canvas.height / img.height,
//         });
//       } else {
//         console.error("Failed to load image");
//       }

//       // Render editable zones
//       template.zones.forEach((zone) => {
//         if (zone.type === "text") {
//           const text = new fabric.IText(zone.label, {
//             left: zone.x,
//             top: zone.y,
//             fontSize: zone.fontSize,
//             fill: zone.color,
//           });
//           canvas.add(text);
//         } else if (zone.type === "image") {
//           const placeholder = new fabric.Rect({
//             left: zone.x,
//             top: zone.y,
//             width: zone.width,
//             height: zone.height,
//             fill: "rgba(255, 255, 255, 0.5)", // Semi-transparent placeholder
//             stroke: "black",
//             strokeWidth: 2,
//           });
//           placeholder.on("mouseup", () => handleImageUpload(canvas, placeholder));
//           canvas.add(placeholder);
//         }
//       });
//     }, { crossOrigin: "anonymous" });

//     return () => {
//       canvas.dispose();
//     };
//   }, [template]);

//   const handleImageUpload = (canvas, placeholder) => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";
//     input.onchange = (event) => {
//       const file = event.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           fabric.Image.fromURL(e.target.result, (img) => {
//             img.set({
//               left: placeholder.left,
//               top: placeholder.top,
//               width: placeholder.width,
//               height: placeholder.height,
//               scaleX: placeholder.scaleX,
//               scaleY: placeholder.scaleY,
//             });
//             canvas.remove(placeholder);
//             canvas.add(img);
//           });
//         };
//         reader.readAsDataURL(file);
//       }
//     };
//     input.click();
//   };

//   return <canvas ref={canvasRef} width={800} height={600}></canvas>;
// }

// function App() {
//   const [selectedTemplate, setSelectedTemplate] = useState(template[0]);

//   return (
//     <div>
//       <h1>Template Editor</h1>
//       <Editor template={selectedTemplate} />
//     </div>
//   );
// }

// export default App;
