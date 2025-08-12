import React from "react";
import styles from "./RSVPPopup.module.css";

const RSVP_STATUS = {
  WILL_COME: "will Come",
  WILL_TRY: "Sure, will try",
};

const RSVPPopup = ({ onClose, hostData, guestData, loading, error }) => {
  // ✅ Combine host + guests and remove duplicates by _id
  const combinedList = hostData
    ? [hostData, ...guestData].filter(
        (p, idx, arr) =>
          arr.findIndex(x => String(x._id) === String(p._id)) === idx
      )
    : guestData;

  // ✅ Set RSVP default for host if not set
  const finalList = combinedList.map(p =>
    String(p._id) === String(hostData?._id) && !p.rsvpStatus
      ? { ...p, rsvpStatus: RSVP_STATUS.WILL_COME }
      : p
  );

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.popupGuest}>
        <h2 className={styles.title}>RSVP LIST</h2>

        <div className={styles.list}>
          {!loading && !error && (
            <>
              {finalList.map((person, idx) => (
                <div key={idx} className={styles.row}>
                  <span className={styles.name}>
                    {person.name || person.Name || person.fullName || "Unknown"}{" "}
                    {String(person._id) === String(hostData?._id) && (
                      <strong>(Host)</strong>
                    )}
                  </span>
                  <span
                    className={
                      person.rsvpStatus === RSVP_STATUS.WILL_COME
                        ? styles.check
                        : styles.dash
                    }
                  >
                    {person.rsvpStatus === RSVP_STATUS.WILL_COME ? "✔" : "―"}
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

