import Image from "next/image";
import WillTryIcon from "@/assets/wonderland/RsvpListWilltry.svg";
import WillComeIcon from "@/assets/wonderland/RsvpListWillCome.svg";
import "./RsvpListModal.css";
import CustomModal from "../common/CustomModal";
import useScreenSize from "@/hooks/useScreenSize";
import { mobileBreakPoints, RSVP_STATUS } from "@/utils/constants.js";

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
  const { width } = useScreenSize();
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => onClose()}
      title="Full Guests List"
      verticalCenter={false}
      bodyClass="rsvp-list-modal-body"
      body={
        <>
          <div className="rsvp-list-container w-100">
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
                <div className="d-flex align-items-center justify-content-between list-content-wrapper w-100 gap-2">
                  <div
                    className={`${
                      width > mobileBreakPoints?.small ? "col-7" : "col-6"
                    } list-names`}
                  >
                    <span>{item?.name}</span>
                  </div>
                  <div
                    className={`${
                      width > mobileBreakPoints?.small ? "col-5" : "col-6"
                    } list-status-icon d-flex justify-content-start align-items-center`}
                  >
                    <Image
                      src={
                        item?.rsvpStatus === RSVP_STATUS?.WILL_COME
                          ? WillComeIcon
                          : WillTryIcon
                      }
                      alt="will try"
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
