

import React from "react";
import styles from "./RSVPPopup.module.css";

const RSVP_STATUS = {
  WILL_COME: "will Come",
  WILL_TRY: "Sure, will try",
};

const RSVPPopup = ({ onClose, hostData, guestData, loading, error }) => {
  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.popupGuest}>
        <h2 className={styles.title}>RSVP LIST</h2>

        <div className={styles.list}>
          {!loading && !error && (
            <>
              {hostData && (
                <div className={styles.row}>
                  <span className={styles.name}>{hostData.Name}</span>
                  <span className={styles.check}>✔</span>
                </div>
              )}

              {guestData.map((guest, idx) => (
                <div key={idx} className={styles.row}>
                  <span className={styles.name}>{guest.name}</span>
                  <span
                    className={
                      guest.rsvpStatus === RSVP_STATUS.WILL_COME
                        ? styles.check
                        : styles.dash
                    }
                  >
                    {guest.rsvpStatus === RSVP_STATUS.WILL_COME ? "✔" : "―"}
                  </span>
                </div>
              ))}
            </>
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
