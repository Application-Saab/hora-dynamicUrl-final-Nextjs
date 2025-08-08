// import React from "react";
// import styles from "./RSVPPopup.module.css";

// const RSVP_STATUS = {
//   WILL_COME: "will Come",
//   WILL_TRY: "Sure, will try",
// };

// const RSVPPopup = ({ onClose, hostData, guestData, loading, error }) => {
//   return (
//     <>
//       <div className={styles.backdrop} onClick={onClose} />

//       <div className={styles.popupGuest}>
//         <h2 className={styles.popupTitle}>RSVP RESPONSES</h2>

//         {!loading && !error && (
//           <>
//             {/* Confirmed */}
//             <div className={styles.section}>
//               <p className={styles.sectionTitleGreen}>will Come</p>
//               {hostData && (
//                 <div className={styles.guestRow}>
//                   <span>{hostData.Name}</span>
//                   <span className={styles.check}>✅</span>
//                 </div>
//               )}
//               {guestData
//                 .filter((guest) => guest?.rsvpStatus === RSVP_STATUS.WILL_COME)
//                 .map((guest, idx) => (
//                   <div key={idx} className={styles.guestRow}>
//                     <span>{guest.name}</span>
//                     <span className={styles.check}>✅</span>
//                   </div>
//                 ))}
//             </div>

//             {/* Not Sure */}
//             <div className={styles.section}>
//               <p className={styles.sectionTitleGray}>Sure, will try</p>
//               {guestData
//                 .filter((guest) => guest?.rsvpStatus === RSVP_STATUS.WILL_TRY)
//                 .map((guest, idx) => (
//                   <div key={idx} className={styles.guestRow}>
//                     <span>{guest.name}</span>
//                     <span className={styles.dash}>➖</span>
//                   </div>
//                 ))}
//             </div>
//           </>
//         )}

//         <button className={styles.closeBtn} onClick={onClose}>
//           Close
//         </button>
//       </div>
//     </>
//   );
// };

// export default RSVPPopup;

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
