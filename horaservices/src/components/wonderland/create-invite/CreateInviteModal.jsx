import React, { useState } from "react";
import BackArrow from "@/assets/BackArrowSvg.svg";
import Image from "next/image";
import "./CreateInviteModal.css";
import useApi from "@/hooks/useApi";
import { CREATE_EVENT_INVITE } from "@/utils/apiconstants";
import { useRouter } from "next/router";
import CustomButton from "../common/CustomButton";

const CreateInviteModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const router = useRouter();
  const [occation, setOccation] = useState("");
  const { loading, makeRequest } = useApi();
  const userId = localStorage.getItem("userID");

  const handleSubmit = async () => {
    if (!userId && occation) return;
    try {
      let resp = await makeRequest(`${CREATE_EVENT_INVITE}`, "POST", {
        userId: userId,
        hostName: occation,
      });
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
    <>
      <div className="custom-modal-backdrop">
        <div className="custom-modal-content">
          <div className="modal-header-custom">
            <Image
              src={BackArrow}
              height={25}
              width={15}
              onClick={() => {
                onClose();
                router.push("/wonderland");
              }}
            />
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

            {/* <button
              className="submit-button-custom"
              disabled={!occation}
              onClick={occation && handleSubmit}
            >
              {loading ? "Submitting..." : "Submit"}
            </button> */}
            <CustomButton
              title={"Submit"}
              loading={loading}
              disabled={!occation}
              onClick={occation && handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateInviteModal;
