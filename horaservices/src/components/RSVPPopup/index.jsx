

import React from "react";
import styles from "./RSVPPopup.module.css";

const RSVP_STATUS = {
  WILL_COME: "will Come",
  WILL_TRY: "Sure, will try",
};

const avatarColors = [
  "#f44336", // red
  "#ffeb3b", // yellow
  "#ff9800", // orange
  "#00bcd4", // cyan
  "#9c27b0", // purple
  "#4caf50", // green
  "#e91e63", // pink
];

const RSVPPopup = ({ onClose, hostData, guestData, loading, error }) => {
  const getAvatarContent = (name) => {
    if (!name || name.trim() === "") return "🎈";
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.popupGuest}>
        <h2 className={styles.title}>RSVP LIST</h2>

        <div className={styles.list}>
          {/* Show host always */}
          {/* {(() => {
            const hostName = hostData?.name || hostData?.Name || "";
            return hostName ? (
              <div className={styles.row}>
                <span className={styles.avatar} style={{ backgroundColor: avatarColors[0] }}>
                  {getAvatarContent(hostName)}
                </span>
                <span className={styles.name}>{hostName}</span>
                <span className={styles.check}>✔</span>
              </div>
            ) : null;
          })()} */}

          {/* Guests */}
          {loading ? (
            <p>Loading guests...</p>
          ) : error ? null : guestData?.length > 0 ? (
            guestData
              .filter((guest) => guest.name?.trim())
              .map((guest, idx) => {
                const avatarText = getAvatarContent(guest.name);
                const bgColor = avatarColors[(idx + 1) % avatarColors.length];

                return (
                  <div key={idx} className={styles.row}>
                    <span className={styles.avatar} style={{ backgroundColor: bgColor }}>
                      {avatarText}
                    </span>
                    <span className={styles.name}>{guest.name}</span>
                    <span className={guest.rsvpStatus === RSVP_STATUS.WILL_COME ? styles.check : styles.dash}>
                      {guest.rsvpStatus === RSVP_STATUS.WILL_COME ? "✔" : "―"}
                    </span>
                  </div>
                );
              })
          ) : (
            <p>No guests added yet.</p>
          )}
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
};

export default RSVPPopup;
