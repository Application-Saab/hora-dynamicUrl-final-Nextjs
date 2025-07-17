import React from "react";
import "./VideoTestimonial.css"; // CSS file

const VideoTestimonial = ({ title = "What Our Clients Say", videoSrc }) => {
  return (
    <div className="testimonial-container">
      <h3 className="testimonial-title">{title}</h3>
      <div className="testimonial-video-wrapper">
        <video className="testimonial-video" controls>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoTestimonial;
