import React, { useState } from 'react';
import axios from 'axios';

const TextToImage = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_TOKEN = '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'; 
  const MODEL_ID = 'stabilityai/stable-diffusion-xl-base-1.0';

  const generateImage = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${MODEL_ID}`,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
          responseType: 'blob', 
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
      />
      <button onClick={generateImage} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Image'}
      </button>
      
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default TextToImage;


// import React, { useState } from 'react';
// import axios from 'axios';

// const TextToImage = () => {
//   const [prompt, setPrompt] = useState('');
//   const [imageUrls, setImageUrls] = useState([]); 
//   const [isLoading, setIsLoading] = useState(false);

//   const API_TOKEN = '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';
//   const MODEL_ID = 'stabilityai/stable-diffusion-xl-base-1.0';

//   const generateImages = async () => {
//     setIsLoading(true);
//     setImageUrls([]);
  
//     try {
//       const requests = Array(2).fill().map(() => 
//         axios.post(
//           `https://api-inference.huggingface.co/models/${MODEL_ID}`,
//           { inputs: prompt },
//           {
//             headers: { Authorization: `Bearer ${API_TOKEN}` },
//             responseType: 'blob',
//           }
//         )
//       );
  
//       const responses = await Promise.all(requests);
//       const urls = responses.map(r => URL.createObjectURL(r.data));
//       setImageUrls(urls);
//     } catch (error) {
//       console.error('Error generating images:', error);
//     }
//     setIsLoading(false);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Enter your prompt..."
//       />
//       <button onClick={generateImages} disabled={isLoading}>
//         {isLoading ? 'Generating...' : 'Generate 2 Images'}
//       </button>

//       <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
//         {imageUrls.map((url, index) => (
//           <div key={index}>
//             <img 
//               src={url} 
//               alt={`Generated ${index + 1}`} 
//               style={{ maxWidth: '400px', borderRadius: '8px' }}
//             />
//             <p>Image {index + 1}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TextToImage;