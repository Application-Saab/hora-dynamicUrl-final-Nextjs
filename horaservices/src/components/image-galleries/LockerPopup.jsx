import Image from "next/image";
import lockerImage from "../../assets/mainLocker.svg"
import eyeIcon from "../../assets/eye-icon.svg";
import shieldIcon from "../../assets/Shield-icon.svg";
import lockIcon from "../../assets/themeLock.svg";

import "./LockerPopup.css";

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

          <h2>Host Photos Are Private</h2>

          <p>
            Photos added in the locker will get hidden from guests and
            will be under your control. Now share the event capsule with
            your guests with more control and freedom.
          </p>
        </div>

        <div className="locker-features">
          <div className="locker-feature-item">
            <div className="locker-icon-box">
              <Image src={eyeIcon} alt="View" width={32} height={32} />
            </div>

            <div>
              <h4>Only Host Can View</h4>
              <p>
                Only the host can access the photos in the locker and nobody
                else.
              </p>
            </div>
          </div>

          <div className="locker-feature-item">
            <div className="locker-icon-box">
              <Image src={shieldIcon} alt="Protected" width={32} height={32} />
            </div>

            <div>
              <h4>Secure & Protected</h4>
              <p>
                Your personal locker is protected with OTP verification.
              </p>
            </div>
          </div>

          <div className="locker-feature-item">
            <div className="locker-icon-box">
              <Image src={lockIcon} alt="Safe" width={32} height={32} />
            </div>

            <div>
              <h4>Your Number is Safe</h4>
              <p>
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