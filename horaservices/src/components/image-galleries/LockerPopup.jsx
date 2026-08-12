import Image from "next/image";
import lockerImage from "../../assets/mainLocker.svg"
import eyeIcon from "../../assets/eye-icon.svg";
import shieldIcon from "../../assets/Shield-icon.svg";
import lockIcon from "../../assets/themeLock.svg";

const LockerPopup = ({ onClose, onMoveToLocker }) => {
  return (
    <div className="locker-overlay">
      
      <div className="locker-popup">
        <button className="locker-close-btn" onClick={onClose}>
        ✕
      </button>
        <div className="locker-header">
          <Image
            src={lockerImage}
            alt="Locker"
            width={130}
            height={83}
            className="locker-main-image"
          />

          <div className="host-popup-heading">Host Photos Are Private</div>

          <p className="host-popup-subHeading">
            Photos added in the locker will get hidden from guests and
            will be under your control. Now share the event capsule with
            your guests with more control and freedom.
          </p>
        </div>

        <div className="locker-features">
          <div className="locker-feature-item">
            <div className="locker-icon-box">
              <Image src={eyeIcon} alt="View" />
            </div>

            <div>
              <div className="explaination-head">Only Host Can View</div>
              <p className="explanation-para">
                Only the host can access the photos in the locker and nobody
                else.
              </p>
            </div>
          </div>

          <div className="locker-feature-item">
            <div className="locker-icon-box">
              <Image src={shieldIcon} alt="Protected" />
            </div>

            <div>
              <div className="explaination-head">Secure & Protected</div>
              <p className="explanation-para">
                Your personal locker is protected with OTP verification.
              </p>
            </div>
          </div>

          <div className="locker-feature-item">
            <div className="locker-icon-box">
              <Image src={lockIcon} alt="Safe" />
            </div>

            <div>
              <div className="explaination-head">Your Number is Safe</div>
              <p className="explanation-para">
                We use your mobile number only for security purposes. We never
                share it.
              </p>
            </div>
          </div>
        </div>

        <button
          className="move-locker-btn"
          onClick={onMoveToLocker}
        >
          Move To Locker
        </button>
      </div>
    </div>
  );
};

export default LockerPopup;