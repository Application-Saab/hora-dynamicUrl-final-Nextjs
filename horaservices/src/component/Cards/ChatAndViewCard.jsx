import { openWhatsappRedirection } from "@/util/openWhatsappRedirection";
import React from "react";
import { LuMessageCircle } from "react-icons/lu";
import { IoReorderThreeOutline } from "react-icons/io5";

function ChatAndViewCard({title,item,handleViewMore}) {
  return (
    <div  className="border rounded p-3 h-100 ">
      <div className="d-flex flex-lg-column justify-content-around justify-content-lg-center align-items-center">
        <div className="mb-lg-2 w-100 p-3 rounded-3 d-flex flex-column align-items-center" style={{background:"#25d366"}}>
          <p className="fw-bold text-center text-12 text-light">Customize ??</p>
          <button
            className=" py-1 bg-light border-light px-2 text-12 rounded-3" style={{color:'#25d366'}}
            onClick={() => openWhatsappRedirection(item.title)}  >
            <LuMessageCircle size={'16px'} className="me-1"/>
           Chat with Us
          </button>
        </div>
        <div className="mb-lg-2 w-100 p-3 rounded-3 ms-2 d-flex flex-column align-items-center" style={{background:"#a673b9"}}>
          <p className=" fw-bold text-12 text-light">800+ Designs</p>
          <button
            className="btn-outline-primary text-12 rounded-3 px-2 py-1"
            onClick={() => handleViewMore(item.viewLink)}
          >
            <IoReorderThreeOutline size={'16px'} className="me-1"/>
            View More
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatAndViewCard;
