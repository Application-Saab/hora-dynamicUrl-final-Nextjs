import React, { useState, useRef, useEffect  } from 'react'
import './headerCards.css'
import myPhoto from '../../assets/myPhoto.png'
import allPhotos from '../../assets/allPhotos.png'
import selfieCapture from '../../assets/selfieCapture.png'
import captureIcon from '../../assets/captureIcon.png'

const HeaderCards = ({ folderName, customerId, setIsSearching = false , onSearchResults }) => {
  const [showPopup, setShowPopup] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  // Start Camera
  useEffect(() => {
    if (showPopup) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          streamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error('Camera access denied:', err)
        })
    }

    // Stop camera when popup closes
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [showPopup])

  const startSearchStream = async (formData) => {
  const response = await fetch("http://localhost:8000/search", {
    method: "POST",
    body: formData,
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder("utf-8")
  let buffer = ""

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split("\n\n")
    buffer = events.pop()

    events.forEach((event) => {
      if (!event.startsWith("data:")) return

      const payload = JSON.parse(event.replace("data:", "").trim())

      if (payload.type === "faceId") {
        localStorage.setItem("activeFaceId", payload.faceId)
      }

      if (payload.type === "match") {
        onSearchResults(payload)
      }
    })
  }
}


  return (
    <>
      <div className="gallery-headerCard">

        <div className="card-item">
          <div className="circle-img">
            <img src={allPhotos.src} alt="All" />
          </div>
          <p>All</p>
        </div>

        {/* My Photos Click */}
        <div className="card-item" onClick={() => setShowPopup(true)}>
          <div className="circle-img">
            <img src={myPhoto.src} alt="My Photos" />
          </div>
          <p>My Photos</p>
        </div>

        <div className="card-item">
          <div className="circle-img add">
            <span>+</span>
          </div>
          <p>Create Album</p>
        </div>

      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <p>Align Your Face & Capture!</p>
            {/* <div className='captureContainer'>
            <div className='bgContainer'>
<img src={selfieCapture.src} alt="face alignment" />
            </div>
            </div> */}
           <div className="captureContainer">
  <div className="bgContainer">
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="camera-video"
    />
  </div>
</div>


            <div className='captureBtn-container'>
              <button
                className='capture-btn'
                onClick={async () => {
  if (!videoRef.current) return;

  // 1. Capture current frame from video
  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

  // 2. Convert to Blob (image file)
  canvas.toBlob(async (blob) => {
    if (!blob) return;

    // 3. Prepare FormData
    const formData = new FormData();
    formData.append("sample_image", blob, "capture.png");
    formData.append("folder_name", folderName);
    formData.append("customer_id", customerId);

    // 4. Send to FastAPI
    try {
        setIsSearching(true)
startSearchStream(formData)
setShowPopup(false)


      } catch (err) {
        console.error("Error sending image:", err)
      } finally {
        setIsSearching(false) 
      }
  }, "image/png");
}}

                >
                <img className='capture-icon' src={captureIcon.src} alt="capture icon" />
                <span>Capture</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HeaderCards
