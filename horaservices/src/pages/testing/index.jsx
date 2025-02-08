import React, { useState } from 'react';
import Resizer from 'react-image-file-resizer';

const ImageResizerComponent = () => {
  const [outputImage, setOutputImage] = useState(null);
  const [outputName, setOutputName] = useState('');

  const resizeImage = (file) => {
    Resizer.imageFileResizer(
      file,
      800, // Max width
      800, // Max height
      'WEBP', // Format
      80, // Quality
      0, // Rotation
      (uri) => {
        setOutputImage(uri); // Save the resized image URI
        setOutputName(file.name.split('.').slice(0, -1).join('.') + '.webp'); // Set the file name
      },
      'base64', // Output type
      100, // Max file size in KB
    );
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      resizeImage(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {outputImage && (
        <div>
          <p>Thumbnail created:</p>
          <img src={outputImage} alt="Resized Thumbnail" />
          <a
            href={outputImage}
            download={outputName}
            style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#007BFF',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            Download Thumbnail
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageResizerComponent;