import React, { useEffect, useState } from "react";
import LocationIcon from "@/assets/wonderland/LocationGradientIcon.svg";
import Image from "next/image";
import "../create-invite/CreateInviteModal.css";
import CustomButton from "../common/CustomButton";
import CustomModal from "../common/CustomModal";

const RsvpNameModal = ({ setUserName, isOpen, onClose, userName, onDone }) => {
  if (!isOpen) return null;

  return (
    <>
      <CustomModal
        isOpen={isOpen}
        onClose={() => onClose()}
        title="Add Event Details"
        verticalCenter={false}
        bodyClass="add-details-modal-body"
        modalClass="add-details-modal-content"
        body={
          <>
            <div className="input-group custom-input-grop-add-details">
              <span
                className="input-group-text add-details-input-addon"
                id="basic-addon1"
              >
                <Image src={LocationIcon} alt="Profile Icon" />
              </span>
              <textarea
                name="name"
                className="form-control add-details-input"
                placeholder="Type Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                rows={1}
                style={{
                  resize: "none",
                  overflow: "hidden",
                }}
                onInput={(e) => {
                  e.target.style.height = "55px";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              ></textarea>
            </div>
            <div className="d-flex justify-content-center mt-1">
              <CustomButton
                title={"Submit"}
                type="button"
                disabled={!userName}
                onClick={() => userName && onDone()}
                buttonClass="add-details-submit"
              />
            </div>
          </>
        }
      />
    </>
  );
};

export default RsvpNameModal;
