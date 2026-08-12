import React, { useState } from "react";
import useApi from "@/hooks/useApi";
import { CREATE_EVENT_INVITE } from "@/utils/apiconstants";
import { useRouter } from "next/router";
import CustomButton from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import { useChatStore } from "@/hooks/ChatContext";
import { usePathname } from "next/navigation";
import { matchInviteCategory } from "@/utils/matchInviteCategory";
import { safeGetItem } from "@/utils/safeStorage";

const CreateInviteModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const router = useRouter();
  const [occasion, setOccasion] = useState("");
  const { loading, makeRequest } = useApi();
  const userId = safeGetItem("userID");
  const { refetchChatRooms } = useChatStore();
  const pathname = usePathname();
  const isWonderlandInternational = pathname?.startsWith(
    "/wonderlandinternational",
  );

  const handleSubmit = async () => {
    if (!userId) return;
    let payload = {
      userId: userId,
      hostName: occasion,
      fromInternational: isWonderlandInternational ? "YES" : "NO",
    };
    try {
      let resp = await makeRequest(`${CREATE_EVENT_INVITE}`, "POST", payload);
      if (resp?.data) {
        const inviteUrl = `${
          isWonderlandInternational ? "/wonderlandinternational" : "/wonderland"
        }/invite?eventid=${resp?.data._id}`;

        window.history.pushState({}, "", inviteUrl);
        const matchedCategory = matchInviteCategory(occasion);
        if (matchedCategory) {
          router.push({
            pathname: `${
              isWonderlandInternational
                ? "/wonderlandinternational"
                : "/wonderland"
            }/templates`,
            query: {
              eventid: resp?.data._id,
              category: matchedCategory,
            },
          });
        } else {
          router.replace({
            pathname: `${
              isWonderlandInternational
                ? "/wonderlandinternational"
                : "/wonderland"
            }/invite`,
            query: {
              eventid: resp?.data._id,
            },
          });
        }
        onClose();
        refetchChatRooms();
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
          isWonderlandInternational ? "/wonderlandinternational" : "/wonderland"
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
