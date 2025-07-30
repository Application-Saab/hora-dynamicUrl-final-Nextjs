// components/InvitationModal.js
import React from "react";

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

  return (
    <div
      className="modal-overlay"
      style={{ backgroundImage: `url(${imageBackground.src})` }}
    >
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <h2 id="modalTitle">Create Event Invite</h2>

        <p className="invite-text" style={{ userSelect: "none" }}>
          🌟 A day of joy, a heart full of cheer, <br />
          The people we love, we wish to have near.
        </p>

        <p className="invite-text">
          So please come join us in celebrating
          <div style={{ margin: "10px auto", position: "relative", width: "70%" }}>
            <input
              type="text"
              placeholder="Event type..."
              value={formData.eventTypeSearch ?? formData.eventType ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  eventTypeSearch: value,
                  eventType: value,
                }));
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              autoComplete="off"
              className="underline-input"
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
        </p>

        <div className="name-wrapper">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Host Name"
            className="underline-input"
          />
          <span>’s</span>
        </div>

        <p className="invite-text">
          on{" "}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="underline-input date-input"
          />{" "}
          at{" "}
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="underline-input time-input"
          />{" "}
          at{" "}
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Venue"
            className="underline-input address-input"
          />
        </p>

        <label className="block text-[#4c1d95] text-sm">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </label>

        {(uploadedImage || orderDetails?.Image) && (
          <div>
            <img
              src={`https://horaservices.com/api/uploads/${
                uploadedImage || orderDetails.Image
              }`}
              alt="Preview"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "8px",
                marginTop: "10px",
              }}
            />
          </div>
        )}

        <p className="invite-text" style={{ marginTop: "1rem" }}>
          because happiness means more when shared with you.
        </p>

        <div className="modal-actions">
          <button className="close-btn" onClick={handleClose} type="button">
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave} type="button">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitationModal;
