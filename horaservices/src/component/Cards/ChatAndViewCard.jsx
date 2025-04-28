import { openWhatsappRedirection } from "@/util/openWhatsappRedirection";
import React from "react";

function ChatAndViewCard({title,item,handleViewMore}) {
  return (
    <div  className="border rounded p-3 h-100 ">
      <h6 className="fw-bold text-purple mb-3">{title}</h6>
      <div className="d-flex flex-lg-column justify-content-around justify-content-lg-center align-items-center">
        <div className="mb-lg-2">
          <p className="fw-bold ">Customize ??</p>
          <button
            className="btn btn-outline-success"
            onClick={() => openWhatsappRedirection(item.title)}
          >
            <i className="bi bi-whatsapp me-2"></i>
            Chat with Us
          </button>
        </div>
        <div className="mb-lg-2">
          <p className=" fw-bold text-muted ">800+ Designs</p>
          <button
            className="btn btn-outline-primary"
            onClick={() => handleViewMore(item.viewLink)}
          >
            <i className="bi bi-grid-3x3-gap me-2"></i>
            View More
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatAndViewCard;
