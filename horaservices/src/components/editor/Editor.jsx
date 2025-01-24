// import { useEffect, useState } from "react";
// import { Stage, Layer, Text, Circle, Rect } from "react-konva"; // Import Rect here

// // Sample template data
// const templatesData = [
//   {
//     id: "template1",
//     name: "Elegant Wedding",
//     background: "#FFD700",
//     elements: [
//       { type: "text", content: "You're Invited!", left: 300, top: 50, fontSize: 30, color: "#000" },
//       { type: "text", content: "Name: [Edit Here]", left: 250, top: 200, fontSize: 20, color: "#333" },
//       { type: "text", content: "Date: [Edit Here]", left: 250, top: 250, fontSize: 20, color: "#333" }
//     ]
//   },
//   {
//     id: "template2",
//     name: "Modern Party",
//     background: "#FF5733",
//     elements: [
//       { type: "circle", radius: 150, left: 250, top: 150, fill: "#FF5733" },
//       { type: "text", content: "Party Invitation", left: 220, top: 100, fontSize: 24, color: "#fff" },
//       { type: "text", content: "Venue: [Edit Here]", left: 220, top: 280, fontSize: 18, color: "#fff" }
//     ]
//   }
// ];

// const Editor = ({ templateId }) => {
//   const [templates, setTemplates] = useState([]);

//   // Load the templates (could be fetched from an API or JSON file)
//   useEffect(() => {
//     setTemplates(templatesData);
//   }, []);

//   const template = templates.find((t) => t.id === templateId);

//   if (!template) {
//     return <div>Template not found</div>;
//   }

//   // Create an array of elements to render on the canvas
//   const elements = template.elements.map((element, index) => {
//     if (element.type === "text") {
//       return (
//         <Text
//           key={index}
//           text={element.content}
//           x={element.left}
//           y={element.top}
//           fontSize={element.fontSize}
//           fill={element.color}
//         />
//       );
//     } else if (element.type === "circle") {
//       return (
//         <Circle
//           key={index}
//           x={element.left}
//           y={element.top}
//           radius={element.radius}
//           fill={element.fill}
//         />
//       );
//     }
//     return null;
//   });

//   return (
//     <div>
//       <Stage width={800} height={600}>
//         <Layer>
//           <Rect width={800} height={600} fill={template.background} />
//           {elements}
//         </Layer>
//       </Stage>
//     </div>
//   );
// };

// export default Editor;





import { useEffect, useState } from "react";
import { Stage, Layer, Text, Circle, Rect, Image } from "react-konva"; // Import Image here
import useImage from "use-image"; // For loading images asynchronously

// const templatesData = [
//   {
//     id: "template1",
//     name: "Elegant Wedding",
//     background: "#FFD700",
//     image: "/assets/invitation3.svg", // Default image path
//     elements: [
//       { type: "text", content: "You're Invited!", left: 300, top: 50, fontSize: 30, color: "#000" },
//       { type: "text", content: "Name: [Edit Here]", left: 250, top: 200, fontSize: 20, color: "#333" },
//       { type: "text", content: "Date: [Edit Here]", left: 250, top: 250, fontSize: 20, color: "#333" }
//     ]
//   },
//   {
//     id: "template2",
//     name: "Modern Party",
//     background: "#FF5733",
//     image: "/assets/invitation4.svg", // Default image path
//     elements: [
//       { type: "circle", radius: 150, left: 250, top: 150, fill: "#FF5733" },
//       { type: "text", content: "Party Invitation", left: 220, top: 100, fontSize: 24, color: "#fff" },
//       { type: "text", content: "Venue: [Edit Here]", left: 220, top: 280, fontSize: 18, color: "#fff" }
//     ]
//   }
// ];


const templatesData = [
  {
    id: "template1",
    name: "Elegant Wedding",
    background: "#FFD700",
    image: "/assets/invitation3.svg",
    elements: [
      { type: "text", content: "You're Invited!", left: 300, top: 50, fontSize: 30, color: "#000" },
      { type: "text", content: "Name: [Edit Here]", left: 250, top: 200, fontSize: 20, color: "#333" },
      { type: "text", content: "Date: [Edit Here]", left: 250, top: 250, fontSize: 20, color: "#333" }
    ]
  },
  {
    id: "template2",
    name: "Modern Party",
    background: "#FF5733",
    image: "/assets/invitation4.svg",
    elements: [
      { type: "circle", radius: 150, left: 250, top: 150, fill: "#FF5733" },
      { type: "text", content: "Party Invitation", left: 220, top: 100, fontSize: 24, color: "#fff" },
      { type: "text", content: "Venue: [Edit Here]", left: 220, top: 280, fontSize: 18, color: "#fff" }
    ]
  },
  {
    id: "template3",
    name: "Birthday Sparkle",
    background: "#FFE6F3", // Light pink background
    image: "/assets/Ranka.svg",
    elements: [
      // Decorative elements
      { type: "star", points: 5, radius: 30, left: 50, top: 50, fill: "#FF69B4", rotation: 15 },
      { type: "star", points: 5, radius: 30, left: 700, top: 50, fill: "#FF69B4", rotation: -15 },
      { type: "star", points: 5, radius: 30, left: 50, top: 500, fill: "#FF69B4", rotation: 45 },
      { type: "star", points: 5, radius: 30, left: 700, top: 500, fill: "#FF69B4", rotation: -45 },
      
      // Header text
      { type: "text", content: "Please Join Us For", left: 250, top: 80, fontSize: 28, color: "#FF1493", fontFamily: "Brush Script MT", width: 160, align: "center", },
      
      // Name section
      { type: "text", content: "[Name]'s", left: 300, top: 150, fontSize: 48, color: "#FF1493", fontFamily: "Brush Script MT" },
      { type: "text", content: "Birthday Celebration!", left: 250, top: 220, fontSize: 32, color: "#FF1493", fontFamily: "Arial Black" },
      
      // Details section
      { type: "text", content: "Date: [Edit Here]", left: 300, top: 300, fontSize: 24, color: "#4B0082" },
      { type: "text", content: "Time: [Edit Here]", left: 300, top: 340, fontSize: 24, color: "#4B0082" },
      { type: "text", content: "Location: [Edit Here]", left: 300, top: 380, fontSize: 24, color: "#4B0082" },
      
      // RSVP section
      { type: "text", content: "RSVP", left: 350, top: 450, fontSize: 26, color: "#FF1493", fontFamily: "Arial Black" },
      { type: "text", content: "Contact: [Edit Here]", left: 300, top: 490, fontSize: 22, color: "#4B0082" }
    ]
  }
];


const Editor = ({ templateId }) => {
  const [templates, setTemplates] = useState([]);
  const [elements, setElements] = useState([]);
  const [imageUrl, setImageUrl] = useState(""); // State to store image URL
  const [image, setImage] = useState(null); // State to store the Image object

  // Load the templates
  useEffect(() => {
    setTemplates(templatesData);
  }, []);

  const template = templates.find((t) => t.id === templateId);

  useEffect(() => {
    if (template) {
      setElements(template.elements);
      setImageUrl(template.image); // Set initial image URL from template data
    }
  }, [template]);

  // For handling image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl); // Update the image URL with the new uploaded image
    }
  };

  // Load the image using useImage hook
  const [loadedImage] = useImage(imageUrl); // This will load the image asynchronously

  useEffect(() => {
    if (loadedImage) {
      setImage(loadedImage); // Update the Image object once it's loaded
    }
  }, [loadedImage]);

  if (!template) {
    return <div>Template not found</div>;
  }

  const handleTextEdit = (index, newText) => {
    const updatedElements = [...elements];
    updatedElements[index].content = newText;
    setElements(updatedElements);
  };

  const renderedElements = elements.map((element, index) => {
    if (element.type === "text") {
      return (
        <Text
          key={index}
          text={element.content}
          x={element.left}
          y={element.top}
          fontSize={element.fontSize}
          fill={element.color}
          draggable
          onClick={(e) => {
            const newText = prompt("Edit text:", element.content);
            if (newText !== null) {
              handleTextEdit(index, newText);
            }
          }}
        />
      );
    } else if (element.type === "circle") {
      return (
        <Circle
          key={index}
          x={element.left}
          y={element.top}
          radius={element.radius}
          fill={element.fill}
        />
      );
    }
    return null;
  });

  return (
    <div>
      {/* Image upload input */}
      <input type="file" onChange={handleImageUpload} />
      
      <Stage width={800} height={600}>
        <Layer>
          <Rect width={800} height={600} fill={template.background} />
          
          {/* Displaying the image on the canvas if it's loaded */}
          {image && (
            <Image
              image={image}
              x={100} // Position the image as needed
              y={100}
              width={200} // Adjust width and height
              height={200}
            />
          )}

          {renderedElements}
        </Layer>
      </Stage>
    </div>
  );
};

export default Editor;




// import { useEffect, useState } from "react";
// import { Stage, Layer, Text, Circle, Rect } from "react-konva"; // Import Rect here

// // Sample template data
// const templatesData = [
//   {
//     id: "template1",
//     name: "Elegant Wedding",
//     background: "#FFD700",
//     elements: [
//       { type: "text", content: "You're Invited!", left: 300, top: 50, fontSize: 30, color: "#000" },
//       { type: "text", content: "Name: [Edit Here]", left: 250, top: 200, fontSize: 20, color: "#333" },
//       { type: "text", content: "Date: [Edit Here]", left: 250, top: 250, fontSize: 20, color: "#333" }
//     ]
//   },
//   {
//     id: "template2",
//     name: "Modern Party",
//     background: "#FF5733",
//     elements: [
//       { type: "circle", radius: 150, left: 250, top: 150, fill: "#FF5733" },
//       { type: "text", content: "Party Invitation", left: 220, top: 100, fontSize: 24, color: "#fff" },
//       { type: "text", content: "Venue: [Edit Here]", left: 220, top: 280, fontSize: 18, color: "#fff" }
//     ]
//   }
// ];

// const Editor = ({ templateId }) => {
//   const [templates, setTemplates] = useState([]);
//   const [elements, setElements] = useState([]); // Initialize elements state outside of template

//   // Load the templates (could be fetched from an API or JSON file)
//   useEffect(() => {
//     setTemplates(templatesData);
//   }, []);

//   const template = templates.find((t) => t.id === templateId);

//   useEffect(() => {
//     if (template) {
//       setElements(template.elements);
//     }
//   }, [template]);

//   if (!template) {
//     return <div>Template not found</div>;
//   }

//   // Handle text editing
//   const handleTextEdit = (index, newText) => {
//     const updatedElements = [...elements];
//     updatedElements[index].content = newText;
//     setElements(updatedElements);
//   };

//   const renderedElements = elements.map((element, index) => {
//     if (element.type === "text") {
//       return (
//         <Text
//           key={index}
//           text={element.content}
//           x={element.left}
//           y={element.top}
//           fontSize={element.fontSize}
//           fill={element.color}
//           draggable
//           onClick={(e) => {
//             const newText = prompt("Edit text:", element.content);
//             if (newText !== null) {
//               handleTextEdit(index, newText);
//             }
//           }}
//         />
//       );
//     } else if (element.type === "circle") {
//       return (
//         <Circle
//           key={index}
//           x={element.left}
//           y={element.top}
//           radius={element.radius}
//           fill={element.fill}
//         />
//       );
//     }
//     return null;
//   });

//   return (
//     <div>
//       <Stage width={800} height={600}>
//         <Layer>
//           <Rect width={800} height={600} fill={template.background} />
//           {renderedElements}
//         </Layer>
//       </Stage>
//     </div>
//   );
// };

// export default Editor;
