import React from 'react'
import Image from 'next/image';
const InstImageData = [
    { id: 1, url: "/assets/bird1.jpg" },
    { id: 2, url: "/assets/bird2.jpg" },
    { id: 3, url: "/assets/bird3.jpg" },
    { id: 4, url: "/assets/bird4.jpg" },
    { id: 5, url: "/assets/bird5.jpg" },
    { id: 6, url: "/assets/bird12.jpg" },
    { id: 7, url: "/assets/bird1.jpg" },
    { id: 8, url: "/assets/bird9.jpg" },
    { id: 9, url: "/assets/bird10.jpg" },
    { id: 10, url: "/assets/bird11.jpg" },
    { id: 11, url: "/assets/bird12.jpg" },
    { id: 12, url: "/assets/bird2.jpg" },
  ];
const index = () => {
  return (
  <>
    {/* insta gallery section */}
  
      <div className="gallery-container">
        <div className="grid-wrapper">
          <a href='https://www.instagram.com/horaservices/' target='_blank' rel='noreferrer'>
            <div className="gallery-grid">
              {InstImageData.map((image) => (
                <div key={image.id} className="gallery-item">
                  <Image
                    src={image.url}
                    width={100}
                    height={100}
                    alt={`Image ${image.id}`}
                  />
                </div>
              ))}
            </div>
  
            {/* Instagram Overlay */}
            <div className="center-overlay">
              <div className="instagram-box">
                <Image
                  src='/assets/bird12.png'
                  alt="Instagram Logo"
                  className="instagram-logo"
                  width={50}
                  height={50}
                />
                <div className="instagram-text">
                  Follow Me on
                  <br />
                  <strong>Instagram</strong>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
  </>
  )
}

export default index