import Image from "next/image";
import WillTryIcon from "@/assets/wonderland/RsvpListWilltry.svg";
import WillComeIcon from "@/assets/wonderland/RsvpListWillCome.svg";
import "./RsvpListModal.css";
import CustomModal from "../common/CustomModal";

const RSVP_STATUS = {
  WILL_COME: "will Come",
  WILL_TRY: "Sure, will try",
};
const colorsArray = [
  "#ED9D58",
  "#E55380",
  "#C689BF",
  "#7EBDCB",
  "#EEBE5C",
  "#6BB266",
];

const RsvpListModal = ({ isOpen, onClose, guestData }) => {
  if (!isOpen) return null;

  return (
      <CustomModal
        isOpen={isOpen}
        onClose={() => onClose()}
        title="Full Guests List"
        body={
          <>
            <div className="rsvp-list-container w-100 pe-3">
              {guestData?.map((item, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-start align-items-center"
                >
                  <div
                    className="d-flex justify-content-center align-items-center list-avatar-ctn"
                    style={{
                      backgroundColor: colorsArray[index % colorsArray.length],
                    }}
                  >
                    <span>{item.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between list-content-wrapper w-100 gap-1">
                    <div className="col-8 list-names">
                      <span>{item?.name}</span>
                    </div>
                    <div className="col-4 list-status-icon d-flex justify-content-start align-items-center">
                      <Image
                        src={
                          item?.rsvpStatus === RSVP_STATUS?.WILL_COME
                            ? WillComeIcon
                            : WillTryIcon
                        }
                        alt="will try"
                        className="me-2"
                      />
                      <span>
                        {item?.rsvpStatus === RSVP_STATUS?.WILL_COME
                          ? "I’m Going!"
                          : "Will try"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {guestData?.length > 1 && (
              <div className="d-flex w-100 justify-content-center">
                <span className="rsvp-list-bottom-text">
                  {guestData?.length} Total Responses
                </span>
              </div>
            )}
          </>
        }
      />
  );
};

export default RsvpListModal;