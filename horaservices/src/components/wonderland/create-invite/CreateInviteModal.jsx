import React, { useState } from "react";
import BackArrow from "@/assets/BackArrowSvg.svg";
import Image from "next/image";
import "./CreateInviteModal.css";
import useApi from "@/hooks/useApi";
import { CREATE_EVENT_INVITE } from "@/utils/apiconstants";
import { useRouter } from "next/router";
import CustomButton from "../common/CustomButton";
import CustomModal from "../common/CustomModal";

const CreateInviteModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const router = useRouter();
  const [occation, setOccation] = useState("");
  const { loading, makeRequest } = useApi();
  const userId = localStorage.getItem("userID");

  const handleSubmit = async () => {
    if (!userId && occation) return;
    let payload = {
      userId: userId,
      hostName: occation?.charAt(0)?.toUpperCase() + occation?.slice(1),
    };
    try {
      let resp = await makeRequest(`${CREATE_EVENT_INVITE}`, "POST", payload);
      if (resp?.data) {
        router.replace({
          pathname: "/wonderland/invite",
          query: { eventid: resp?.data._id },
        });
        setOccation("");
        onClose();
      }
    } catch (err) {
      console.error("Error rejecting content:", err);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        router.push("/wonderland");
      }}
      title="Create Invitation"
      verticalCenter={false}
      disableBackdropClick={true}
      body={
        <>
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
          <div className="d-flex justify-content-center">
            <CustomButton
              title={"Submit"}
              loading={loading}
              disabled={!occation}
              onClick={occation && handleSubmit}
              buttonClass="create-invite-btn"
            />
          </div>
        </>
      }
    />
  );
};

export default CreateInviteModal;
