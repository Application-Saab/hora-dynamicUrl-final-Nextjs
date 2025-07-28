'use client';
import { useEffect, useState } from 'react';

const SvgPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tempSelectedIndex, setTempSelectedIndex] = useState(null);
  const [popupSvgs, setPopupSvgs] = useState([]);

  const orderDetails = {
    name: 'SAHAJ1',
    date: new Date().toLocaleDateString('en-GB'),
    time: new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    address: '123 Cartoon Street, Tokyo',
    imageUrl:
      'https://www.shutterstock.com/image-vector/doraemon-symbol-icon-art-funny-600nw-2272939721.jpg',
  };

  const templates = [
    { image: '/assets/template1.svg' },
    { image: '/assets/template2.svg' },
    { image: '/assets/template3.svg' },
  ];

  const loadSvg = async (index) => {
    const file = templates[index].image;
    try {
      const response = await fetch(`${file}?v=${Date.now()}`);
      let svgText = await response.text();

      const textFields = ['name', 'date', 'time', 'address'];
      textFields.forEach((field) => {
        const regex = new RegExp(
          `(<text[^>]*id=["']${field}["'][^>]*>)(.*?)(</text>)`
        );
        svgText = svgText.replace(regex, (match, start, content, end) => {
          return `${start}${orderDetails[field]}${end}`;
        });
      });

      const imageRegex = /<image[^>]*data-id=["']uniqueImage1["'][^>]*\/?>/i;
      svgText = svgText.replace(imageRegex, (match) => {
        const transformMatch = match.match(/transform="[^"]*"/);
        const widthMatch = match.match(/width="[^"]*"/);
        const heightMatch = match.match(/height="[^"]*"/);

        const transform = transformMatch ? transformMatch[0] : '';
        const width = widthMatch ? widthMatch[0] : 'width="1200"';
        const height = heightMatch ? heightMatch[0] : 'height="1388"';

        return `<image 
          data-id="uniqueImage1"
          ${width}
          ${height}
          ${transform}
          xlink:href="${orderDetails.imageUrl}"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        />`;
      });

      svgText = svgText.replace(
        /<svg([^>]*?)>/,
        (match, attrs) => {
          if (!attrs.includes('xmlns:xlink')) {
            return `<svg${attrs} xmlns:xlink="http://www.w3.org/1999/xlink">`;
          }
          return match;
        }
      );

      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Error loading SVG:', file, err);
      return null;
    }
  };

  useEffect(() => {
    const loadDefault = async () => {
      const url = await loadSvg(0);
      if (url) {
        setPreviewUrl(url);
        setSelectedIndex(0);
      }
    };
    loadDefault();
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  const openPopup = async () => {
    setTempSelectedIndex(null);
    const urls = await Promise.all(templates.map((_, i) => loadSvg(i)));
    setPopupSvgs(urls);
    setIsOpen(true);
  };

  const closePopup = () => {
    if (tempSelectedIndex !== null) {
      const selectedUrl = popupSvgs[tempSelectedIndex];
      if (selectedUrl) {
        previewUrl && URL.revokeObjectURL(previewUrl);
        setPreviewUrl(selectedUrl);
        setSelectedIndex(tempSelectedIndex);
      }
    }
    setIsOpen(false);
  };

  const handleTemplateClick = (index) => {
    setTempSelectedIndex(index);
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <button
        onClick={openPopup}
        style={{
          padding: '12px 24px',
          backgroundColor: '#1D4ED8',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '16px',
          margin: '20px auto',
          display: 'block',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        Choose Template
      </button>

      {previewUrl && (
        <div
          style={{
            maxWidth: '400px',
            margin: '0 auto 32px',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #e5e7eb',
            backgroundColor: '#f3f4f6',
          }}
        >
          <object
            data={previewUrl}
            type="image/svg+xml"
            style={{ width: '100%', height: 'auto' }}
          >
            Your browser does not support SVG.
          </object>
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '1300px',
              padding: '32px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <h2 style={{ fontSize: '24px', fontWeight: '600' }}>
                Select a Template
              </h2>
              <button
                onClick={closePopup}
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#DC2626',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                ✕ Close
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
              }}
            >
              {popupSvgs.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => handleTemplateClick(idx)}
                  style={{
                    border:
                      tempSelectedIndex === idx
                        ? '4px solid #3B82F6'
                        : '2px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: '#F9FAFB',
                    boxShadow:
                      tempSelectedIndex === idx
                        ? '0 0 0 4px rgba(59,130,246,0.3)'
                        : 'none',
                  }}
                >
                  <object
                    data={url}
                    type="image/svg+xml"
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'contain',
                    }}
                  >
                    Preview unavailable
                  </object>
                </div>
              ))}
            </div>

            {tempSelectedIndex !== null && (
              <p
                style={{
                  marginTop: '20px',
                  color: '#10B981',
                  fontWeight: '500',
                }}
              >
                ✅ Template selected. Click "Close" to apply.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SvgPopup;
