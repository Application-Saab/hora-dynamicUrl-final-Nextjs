import React from "react";
import "./invitaionmodal.css";
import camera from "../../assets/camera.png"
import Image from "next/image";
import Head from "next/head";
const InvitationModal = ({
  showModal,
  handleClose,
  handleSave,
  formData,
  setFormData,
  handleChange,
  handleImageChange,
  uploadedImage,
  eventOptions,
  fileInputRef,
  orderDetails,
  imageBackground,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const filteredOptions = eventOptions.filter((opt) =>
    opt.toLowerCase().includes((formData.eventTypeSearch || "").toLowerCase())
  );

  if (!showModal) return null;
React.useEffect(() => {
  const dateInput = document.querySelector('input[name="date"]');
  const timeInput = document.querySelector('input[name="time"]');

  if (dateInput?.value) dateInput.classList.add("has-value");
  if (timeInput?.value) timeInput.classList.add("has-value");
}, []);

  return (

    <div
      className="modal-overlay"
      style={{ backgroundImage: `url(${imageBackground?.src || ""})` }}
    >
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Aclonica&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="invitation-container-form">
        <h2 className="invite-Title">Create  Invitation</h2>

        <p className="invite-subtitle">
        
          🌟 A day of joy, a heart full of cheer 🌟 <br />
          The people we love, we wish to have near. <br />
          So come join us and make memories dear.
        </p>

        {/* Event Type Input with Dropdown */}
        <div className="dropdown-wrapper">
          <input
            type="text"
            placeholder="Event Name"
            className="input-field"
            value={formData.eventTypeSearch ?? formData.eventType ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setFormData((prev) => ({
                ...prev,
                eventType: val,
                eventTypeSearch: val,
              }));
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            autoComplete="off"
          />
          {showDropdown && formData.eventTypeSearch && (
            <ul className="dropdown-list">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <li
                    key={opt}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        eventType: opt,
                        eventTypeSearch: opt,
                      }));
                      setShowDropdown(false);
                    }}
                  >
                    {opt}
                  </li>
                ))
              ) : (
                <li className="no-results">No results found</li>
              )}
            </ul>
          )}
        </div>

        <input
          type="text"
          placeholder="Host Name"
          name="name"
          className="input-field"
          value={formData.name}
          onChange={handleChange}
        />

        <div className="date-time-row">
          <div className="field-group">
            <label className="input-label">Event Date</label>
            <input
              type="date"
              name="date"
              className="input-field"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label className="input-label">Arrival Time</label>
            <input
              type="time"
              name="time"
              className="input-field"
              value={formData.time}
              onChange={handleChange}
            />
          </div>
        </div>


        <input
          type="text"
          placeholder="Venue"
          name="address"
          className="input-field"
          value={formData.address}
          onChange={handleChange}
        />
        {uploadedImage || orderDetails?.Image ? (
          <div
            className="preview-wrapper"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={uploadedImage || orderDetails?.Image || ""}
              alt="Preview"
              className="image-preview"
            />
            <div className="change-text">Tap to change photo</div>
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              onChange={handleImageChange}
              ref={fileInputRef}
              hidden
            />
          </div>
        ) : (
          <label htmlFor="file-upload" className="upload-box">
            <Image src={camera} alt="Upload" />
            <div>Upload Photo</div>
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              onChange={handleImageChange}
              ref={fileInputRef}
              hidden
            />
          </label>
        )}

        <div className="button-row">
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitationModal;
