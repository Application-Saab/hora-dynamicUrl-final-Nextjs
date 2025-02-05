// import React, { useEffect, useRef, useState } from 'react';
// import { fabric } from 'fabric';
// import { useRouter } from 'next/router'; // Import Next.js useRouter hook

// // Template data
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
//   {
//     id: 2,
//     name: "Template 2",
//     image: "/assets/child.png", // Another image for the second template
//     zones: [
//       { type: "text", label: "Title", x: 100, y: 200, fontSize: 30, color: "green" },
//       { type: "text", label: "Event", x: 100, y: 250, fontSize: 20, color: "orange" },
//       { type: "image", label: "Image", x: 500, y: 150, width: 150, height: 150 },
//     ],
//   },
//   // Add more templates as needed
// ];

// function Editor() {
//   const { query } = useRouter(); // Get the query object from the router
//   const { id } = query; // Extract the 'id' from the URL (dynamic route)
//   console.log(id, "diiid");
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const canvasRef = useRef(null);

//   // Find the selected template based on the id from the URL
//   useEffect(() => {
//     if (id) {
//       const templateId = parseInt(id, 10); // Convert id to an integer
//       const tmpl = template.find((tmpl) => tmpl.id === templateId);
//       if (tmpl) {
//         setSelectedTemplate(tmpl);
//       }
//     }
//   }, [id]); // Rerun effect whenever the id changes

//   // Initialize and set up the Fabric.js canvas when the template is selected
//   useEffect(() => {
//     if (!selectedTemplate || !canvasRef.current) return;

//     const canvas = new fabric.Canvas(canvasRef.current);

//     // Set the background image
//     fabric.Image.fromURL(selectedTemplate.image, (img) => {
//       if (img) {
//         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
//           scaleX: canvas.width / img.width,
//           scaleY: canvas.height / img.height,
//         });
//       }

//       // Add editable zones (text and image placeholders)
//       selectedTemplate.zones.forEach((zone) => {
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
//     });

//     return () => {
//       canvas.dispose(); // Clean up the canvas when the component unmounts
//     };
//   }, [selectedTemplate]);

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

//   if (!selectedTemplate) {
//     return <div>Template not found</div>;
//   }

//   return (
//     <div>
//       <h1>{selectedTemplate.name} Editor</h1>
//       <canvas ref={canvasRef} width={800} height={600}></canvas>
//     </div>
//   );
// }

// export default Editor;



// import React, { useEffect, useRef, useState } from "react";
// import { fabric } from "fabric";
// import { useRouter } from "next/router"; // Import Next.js useRouter hook

// // Template data
// const template = [
//   {
//     id: 1,
//     name: "Template 1",
//     image: "/assets/child.png", // Ensure this path is correct (public folder)
//     zones: [
//       { type: "text", label: "Name", x: 100, y: 200, fontSize: 30, color: "red" },
//       { type: "text", label: "Date", x: 100, y: 250, fontSize: 20, color: "blue" },
//       { type: "image", label: "Photo", x: 400, y: 150, width: 50, height: 50 }, // Frame size set to 50x50
//     ],
//   },
//   {
//     id: 2,
//     name: "Template 2",
//     image: "/assets/child2.png", // Another image for the second template
//     zones: [
//       { type: "text", label: "Title", x: 550, y: 100, fontSize: 30, color: "green" },
//       { type: "text", label: "Event", x: 550, y: 150, fontSize: 20, color: "orange" },
//       { type: "image", label: "Image", x: 0, y: 0, width: 360, height: 550 }, // Frame size set to 50x50
//     ],
//   },
// ];

// function Editor() {
//   const { query } = useRouter(); // Get the query object from the router
//   const { id } = query; // Extract the 'id' from the URL (dynamic route)
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const canvasRef = useRef(null);

//   // Find the selected template based on the id from the URL
//   useEffect(() => {
//     if (id) {
//       const templateId = parseInt(id, 10); // Convert id to an integer
//       const tmpl = template.find((tmpl) => tmpl.id === templateId);
//       if (tmpl) {
//         setSelectedTemplate(tmpl);
//       }
//     }
//   }, [id]); // Rerun effect whenever the id changes

//   // Initialize and set up the Fabric.js canvas when the template is selected
//   useEffect(() => {
//     if (!selectedTemplate || !canvasRef.current) return;

//     const canvas = new fabric.Canvas(canvasRef.current);

//     // Set the background image using fabric.js
//     fabric.Image.fromURL(selectedTemplate.image, (img) => {
//       if (img && canvas) {
//         // Ensure canvas is ready before setting background image
//         const canvasWidth = canvas.width || 800;  // Default width if canvas is not yet defined
//         const canvasHeight = canvas.height || 600; // Default height if canvas is not yet defined

//         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
//           scaleX: canvasWidth / img.width,
//           scaleY: canvasHeight / img.height,
//         });
//       }
//     });

//     // Add editable zones (text and image placeholders)
//     selectedTemplate.zones.forEach((zone) => {
//       if (zone.type === "text") {
//         const text = new fabric.IText(zone.label, {
//           left: zone.x,
//           top: zone.y,
//           fontSize: zone.fontSize,
//           fill: zone.color,
//         });
//         canvas.add(text);
//       } else if (zone.type === "image") {
//         const placeholder = new fabric.Rect({
//           left: zone.x,
//           top: zone.y,
//           width: zone.width,
//           height: zone.height,
//           fill: "rgba(255, 255, 255, 0.5)",
//           stroke: "black",
//           strokeWidth: 2,
//         });
//         placeholder.on("mouseup", () => handleImageUpload(canvas, placeholder));
//         canvas.add(placeholder);
//       }
//     });

//     return () => {
//       canvas.dispose(); // Clean up the canvas when the component unmounts
//     };
//   }, [selectedTemplate]);

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
//             // Scale the image to fit within the placeholder while maintaining aspect ratio
//             img.set({
//               left: placeholder.left,
//               top: placeholder.top,
//             });

//             // Resize the image to fit within the placeholder
//             img.scaleToWidth(placeholder.width); // Fit image to the width of the placeholder
//             img.scaleToHeight(placeholder.height); // Fit image to the height of the placeholder

//             // Remove the placeholder and add the image
//             canvas.remove(placeholder);
//             canvas.add(img);
//           });
//         };
//         reader.readAsDataURL(file);
//       }
//     };
//     input.click();
//   };

//   if (!selectedTemplate) {
//     return <div>Template not found</div>;
//   }

//   return (
//     <div>
//       <h1>{selectedTemplate.name} Editor</h1>
//       <canvas ref={canvasRef} width={800} height={600}></canvas>
//     </div>
//   );
// }

// export default Editor;


// working
// import React, { useEffect, useRef, useState } from "react";
// import { fabric } from "fabric";
// import { useRouter } from "next/router"; // Import Next.js useRouter hook

// // Template data
// const template = [
//   {
//     id: 1,
//     name: "Template 1",
//     image: "/assets/child.png", // Ensure this path is correct (public folder)
//     zones: [
//       { type: "text", label: "Name", x: 100, y: 200, fontSize: 30, color: "red" },
//       { type: "text", label: "Date", x: 100, y: 250, fontSize: 20, color: "blue" },
//       { type: "image", label: "Photo", x: 400, y: 150, width: 50, height: 50 }, // Frame size set to 50x50
//     ],
//   },
//   {
//     id: 2,
//     name: "Template 2",
//     image: "/assets/child2.png", // Another image for the second template
//     zones: [
//       { type: "text", label: "Title", x: 550, y: 100, fontSize: 30, color: "green",fontWeight: "bold", stroke: "black", strokeWidth: 2 },
//       { type: "text", label: "Event", x: 550, y: 150, fontSize: 20, color: "orange" },
//       { type: "image", label: "Image", x: 0, y: 0, width: 360, height: 550 }, // Frame size set to 360x550
//     ],
//   },
// ];

// function Editor() {
//   const { query } = useRouter(); // Get the query object from the router
//   const { id } = query; // Extract the 'id' from the URL (dynamic route)
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const canvasRef = useRef(null);

//   // Find the selected template based on the id from the URL
//   useEffect(() => {
//     if (id) {
//       const templateId = parseInt(id, 10); // Convert id to an integer
//       const tmpl = template.find((tmpl) => tmpl.id === templateId);
//       if (tmpl) {
//         setSelectedTemplate(tmpl);
//       }
//     }
//   }, [id]); // Rerun effect whenever the id changes

//   // Initialize and set up the Fabric.js canvas when the template is selected
//   useEffect(() => {
//     if (!selectedTemplate || !canvasRef.current) return;

//     const canvas = new fabric.Canvas(canvasRef.current);

//     // Set the background image using fabric.js
//     fabric.Image.fromURL(selectedTemplate.image, (img) => {
//       if (img && canvas) {
//         // Ensure canvas is ready before setting background image
//         const canvasWidth = canvas.width || 800;  // Default width if canvas is not yet defined
//         const canvasHeight = canvas.height || 600; // Default height if canvas is not yet defined

//         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
//           scaleX: canvasWidth / img.width,
//           scaleY: canvasHeight / img.height,
//         });
//       }
//     });

//     // Add editable zones (text and image placeholders)
//     selectedTemplate.zones.forEach((zone) => {
//       if (zone.type === "text") {
//         const text = new fabric.IText(zone.label, {
//           left: zone.x,
//           top: zone.y,
//           fontSize: zone.fontSize,
//           fill: zone.color,
//           fontWeight: zone.fontWeight || "normal",
//         fontStyle: zone.fontStyle || "normal",
//         underline: zone.underline || false,
//         stroke: zone.stroke || "",
//         strokeWidth: zone.strokeWidth || 0,
//         backgroundColor: zone.backgroundColor || "",
//         charSpacing: zone.charSpacing || 0,

//         });
//         canvas.add(text);
//       } else if (zone.type === "image") {
//         const placeholder = new fabric.Rect({
//           left: zone.x,
//           top: zone.y,
//           width: zone.width,
//           height: zone.height,
//           fill: "rgba(255, 255, 255, 0.5)",
//           stroke: "black",
//           strokeWidth: 2,
//         });
//         placeholder.on("mouseup", () => handleImageUpload(canvas, placeholder));
//         canvas.add(placeholder);
//       }
//     });

//     return () => {
//       canvas.dispose(); // Clean up the canvas when the component unmounts
//     };
//   }, [selectedTemplate]);

// const handleImageUpload = (canvas, placeholder) => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";
//     input.onchange = (event) => {
//       const file = event.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           fabric.Image.fromURL(e.target.result, (img) => {
//             // Set the position of the image to the placeholder position
//             img.set({
//               left: placeholder.left,
//               top: placeholder.top,
//             });
  
//             // Get the dimensions of the uploaded image and the placeholder
//             const imgWidth = img.width;
//             const imgHeight = img.height;
//             const placeholderWidth = placeholder.width;
//             const placeholderHeight = placeholder.height;
  
//             // Calculate the scale factors based on the placeholder size
//             const scaleX = placeholderWidth / imgWidth;
//             const scaleY = placeholderHeight / imgHeight;
  
//             // Scale the image uniformly (by the smallest scale factor) to ensure it fits inside the placeholder
//             const scaleFactor = Math.min(scaleX, scaleY);
  
//             img.scale(scaleFactor);
  
//             // Remove the placeholder and add the image to the canvas
//             canvas.remove(placeholder);
//             canvas.add(img);
//             canvas.renderAll();
//           });
//         };
//         reader.readAsDataURL(file);
//       }
//     };
//     input.click();
//   };
  

//   if (!selectedTemplate) {
//     return <div>Template not found</div>;
//   }

//   return (
//     <div>
//       <h1>{selectedTemplate.name} Editor</h1>
//       <canvas ref={canvasRef} width={800} height={600}></canvas>
//     </div>
//   );
// }

// export default Editor;



import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useRouter } from "next/router";

const template = [
  {
    id: 1,
    name: "Template 1",
    image: "/assets/child.png",
    zones: [
      { type: "text", label: "Name", x: 100, y: 200, fontSize: 30, color: "red" },
      { type: "text", label: "Date", x: 100, y: 250, fontSize: 20, color: "blue" },
      { type: "image", label: "Photo", x: 400, y: 150, width: 50, height: 50 },
    ],
  },
  {
    id: 2,
    name: "Template 2",
    image: "/assets/child2.png",
    zones: [
      { type: "text", label: "Title", x: 550, y: 100, fontSize: 30, color: "green", fontWeight: "bold", stroke: "black", strokeWidth: 2 },
      { type: "text", label: "Event", x: 550, y: 150, fontSize: 20, color: "orange" },
      { type: "image", label: "Image", x: 0, y: 0, width: 360, height: 550 },
    ],
  },
  {
    id: 3,
    name: "Template 3",
    image: "/assets/child4.png",
    zones: [
      { type: "text", label: "Title", x: 400, y: 30, fontSize: 30, color: "green", fontWeight: "bold", stroke: "black", strokeWidth: 2 },
      { type: "text", label: "Event", x: 400, y: 95, fontSize: 30, color: "green", 
        fontWeight: "bold", strokeWidth: 2, font: "Regular Brush", fontFamily: "cursive"},
      { type: "image", label: "Image", x: 150, y: 130, width: 530, height: 350 },
    ],
  },
];

function Editor() {
  const { query } = useRouter();
  const { id } = query;
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (id) {
      const templateId = parseInt(id, 10);
      const tmpl = template.find((tmpl) => tmpl.id === templateId);
      if (tmpl) {
        setSelectedTemplate(tmpl);
      }
    }
  }, [id]);

  useEffect(() => {
    if (!selectedTemplate || !canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current);

    fabric.Image.fromURL(selectedTemplate.image, (img) => {
      if (img && canvas) {
        const canvasWidth = canvas.width || 800;
        const canvasHeight = canvas.height || 600;

        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvasWidth / img.width,
          scaleY: canvasHeight / img.height,
        });
      }
    });

    selectedTemplate.zones.forEach((zone) => {
      if (zone.type === "text") {
        const text = new fabric.IText(zone.label, {
          left: zone.x,
          top: zone.y,
          fontSize: zone.fontSize,
          fill: zone.color,
          fontWeight: zone.fontWeight || "normal",
          fontStyle: zone.fontStyle || "normal",
          fontFamily: zone.fontFamily || "normal",
          underline: zone.underline || false,
          stroke: zone.stroke || "",
          strokeWidth: zone.strokeWidth || 0,
          backgroundColor: zone.backgroundColor || "",
          charSpacing: zone.charSpacing || 0,
          textAlign: "center", // Horizontally center the text
  originX: "center", // Set the origin to the center of the text
        });
        canvas.add(text);
      } else if (zone.type === "image") {
        const placeholder = new fabric.Rect({
          left: zone.x,
          top: zone.y,
          width: zone.width,
          height: zone.height,
          fill: "rgba(255, 255, 255, 0.5)",
          stroke: "black",
          strokeWidth: 2,
        });
        placeholder.on("mouseup", () => handleImageUpload(canvas, placeholder));
        canvas.add(placeholder);
      }
    });

    return () => {
      canvas.dispose();
    };
  }, [selectedTemplate]);

  const handleImageUpload = (canvas, placeholder) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fabric.Image.fromURL(e.target.result, (img) => {
            img.set({
              left: placeholder.left,
              top: placeholder.top,
            });

            const imgWidth = img.width;
            const imgHeight = img.height;
            const placeholderWidth = placeholder.width;
            const placeholderHeight = placeholder.height;

            const scaleX = placeholderWidth / imgWidth;
            const scaleY = placeholderHeight / imgHeight;

            const scaleFactor = Math.min(scaleX, scaleY);

            img.scale(scaleFactor);

            canvas.remove(placeholder);
            canvas.add(img);
            canvas.renderAll();
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (!selectedTemplate) {
    return <div>Template not found</div>;
  }

  return (
    <div>
      <h1>{selectedTemplate.name}</h1>
      <canvas ref={canvasRef} width={800} height={600}></canvas>
    </div>
  );
}

export default Editor;
