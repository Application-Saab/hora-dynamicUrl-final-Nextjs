import Image from "next/image";
import "@/pages/wonderland/invite/invite.css"
const AlertModal = ({
isOpen,
onClose,
heading ,
message ,
buttonLabel,
icon,
}) => {
if (!isOpen) return null;

return (
   <div className="custom-modal-backdrop justify-content-center align-items-center"> <div className="custom-modal-content">


    <div className="modal-header-custom">
      {icon && <Image src={icon} height={24} width={27} alt="alert-icon" />}
      <h2 className="modal-title-custom">{heading}</h2>
    </div>

    <div className="modal-body-custom">
      <h3 className="location-modal-question-text m-2 mb-4">
        {message}
      </h3>

      <button className="submit-button-custom" onClick={onClose}>
        {buttonLabel}
      </button>
    </div>

  </div>
</div>

);
};

export default AlertModal;
