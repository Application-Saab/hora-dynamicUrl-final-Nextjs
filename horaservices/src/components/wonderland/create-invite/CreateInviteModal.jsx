import React, { useState } from "react";
import BackArrow from "@/assets/BackArrowSvg.svg";
import Image from "next/image";
import "./CreateInviteModal.css";

const CreateInviteModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }
  const [occation, setOccation] = useState("");

  return (
    <>
      <div className="custom-modal-backdrop">
        <div className="custom-modal-content">
          <div className="modal-header-custom">
            <Image src={BackArrow} height={25} width={15} onClick={onClose} />
            <h2 className="modal-title-custom">Create Invitation</h2>
          </div>

          <div className="modal-body-custom">
            <h3 className="modal-question-text">What's the occasion?</h3>

            <div className="input-group-custom">
              <input
                type="text"
                placeholder="Type Event Name"
                maxLength={30}
                value={occation}
                onChange={(e) => setOccation(e.target.value)}
              />
              <small className="char-limit-text">
                {occation?.length}/30 Characters
              </small>
            </div>

            <button className="submit-button-custom" onClick={onClose}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateInviteModal;
