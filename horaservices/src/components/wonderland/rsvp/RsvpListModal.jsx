import Image from "next/image";
import BackArrow from "@/assets/BackArrowSvg.svg";
import WillTryIcon from "@/assets/wonderland/RsvpListWilltry.svg";
import WillComeIcon from "@/assets/wonderland/RsvpListWillCome.svg";
import "./RsvpListModal.css";

const RSVP_STATUS = {
  WILL_COME: "will Come",
  WILL_TRY: "Sure, will try",
};

const RsvpListModal = ({ isOpen, onClose, guestData }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="custom-modal-backdrop justify-content-center align-items-center">
        <div className="custom-modal-content">
          <div className="modal-header-custom">
            <Image src={BackArrow} onClick={() => onClose()} />
            <h2 className="modal-title-custom">Missing Location</h2>
          </div>

          <div className="modal-body-custom">
            <div className="rsvp-list-container d-flex flex-column">
              <div className="list-item-row d-flex justify-content-start">
                <div className="list-avatar-wrapper">
                  <div
                    className="d-flex justify-content-center align-items-center list-avatar-ctn"
                    style={{ backgroundColor: "#ED9D58" }}
                  >
                    <span>A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RsvpListModal;
