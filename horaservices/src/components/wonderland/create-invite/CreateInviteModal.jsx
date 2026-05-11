import React, { useState } from "react";
import "./CreateInviteModal.css";
import useApi from "@/hooks/useApi";
import { CREATE_EVENT_INVITE } from "@/utils/apiconstants";
import { useRouter } from "next/router";
import CustomButton from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import { useChatStore } from "@/hooks/ChatContext";
import { usePathname } from "next/navigation";

const CreateInviteModal = ({ isOpen, onClose, setSubmitTemplateImage }) => {
  if (!isOpen) return null;
  const router = useRouter();
  const [occasion, setOccasion] = useState("");
  const { loading, makeRequest } = useApi();
  const userId = localStorage.getItem("userID");
  const { refetchChatRooms } = useChatStore();
  const pathname = usePathname();
  const isWonderlandInternational = pathname?.startsWith(
    "/wonderinternational",
  );

  const handleSubmit = async () => {
    if (!userId) return;
    let payload = {
      userId: userId,
      hostName: occasion,
    };
    try {
      let resp = await makeRequest(`${CREATE_EVENT_INVITE}`, "POST", payload);
      if (resp?.data) {
        router.replace({
          pathname: `${
            isWonderlandInternational ? "/wonderinternational" : "/wonderland"
          }/invite`,
          query: { eventid: resp?.data._id },
        });
        setOccasion("");
        onClose();
        refetchChatRooms();
        setSubmitTemplateImage(true);
      }
    } catch (err) {
      console.error("Error rejecting content:", err);
    }
  };
  const handleChange = (e) => {
    let value = e.target.value;
    const formattedOccation = value.replace(/(^\w|(?<=\s)\w)/g, (char) =>
      char.toUpperCase()
    );
    setOccasion(formattedOccation);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        router.push(
          isWonderlandInternational ? "/wonderinternational" : "/wonderland"
        );
      }}
      title="Create Invitation"
      titleClass="my-title-class"
      verticalCenter={false}
      disableBackdropClick={true}
      bodyClass="create-invite-modal-body"
      body={
        <>
          <h3 className="modal-question-text">What's the occasion?</h3>

          <div className="input-group-custom">
            <input
              type="text"
              placeholder="Type Event Name"
              maxLength={30}
              value={occasion}
              onChange={handleChange}
            />
            <small className="char-limit-text">
              {occasion?.length}/30 Characters
            </small>
          </div>
          <CustomButton
            title={"Submit"}
            loading={loading}
            disabled={!occasion}
            onClick={occasion && handleSubmit}
            // buttonClass="create-invite-btn"
          />
        </>
      }
    />
  );
};

export default CreateInviteModal;
