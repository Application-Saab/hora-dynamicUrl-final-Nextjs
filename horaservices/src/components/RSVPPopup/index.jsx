import React from "react";

const RSVPPopup = ({ guestList = [], onClose }) => {
  const styles = {
    backdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 999,
    },
    popupGuest: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      borderRadius: "10px",
      padding: "24px",
      width: "90%",
      maxWidth: "400px",
      zIndex: 1000,
      boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
      maxHeight: "80vh",
      overflowY: "auto",
    },
    popupTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "16px",
      textAlign: "center",
    },
    section: {
      marginBottom: "16px",
    },
    sectionTitleGreen: {
      color: "green",
      fontWeight: "bold",
      fontSize: "16px",
      marginBottom: "8px",
    },
    sectionTitleGray: {
      color: "gray",
      fontWeight: "bold",
      fontSize: "16px",
      marginBottom: "8px",
    },
    sectionTitleRed: {
      color: "red",
      fontWeight: "bold",
      fontSize: "16px",
      marginBottom: "8px",
    },
    guestRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "6px 0",
      borderBottom: "1px solid #eee",
    },
    check: { color: "green" },
    dash: { color: "gray" },
    cross: { color: "red" },
    closeBtn: {
      marginTop: 20,
      width: "100%",
      padding: "10px",
      fontSize: "16px",
      fontWeight: "bold",
      backgroundColor: "#ff5e5e",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },
  };

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} />

      <div style={styles.popupGuest}>
        <h2 style={styles.popupTitle}>RSVP RESPONSES</h2>

        {/* ✅ Confirmed */}
        <div style={styles.section}>
          <p style={styles.sectionTitleGreen}>Confirmed</p>
          {guestList.filter(g => g.status?.toLowerCase().includes("coming")).map((guest, idx) => (
            <div key={idx} style={styles.guestRow}>
              <span>{guest.name}</span>
              <span style={styles.check}>✅</span>
            </div>
          ))}
        </div>

        {/* ⚪ Not Sure */}
        <div style={styles.section}>
          <p style={styles.sectionTitleGray}>Not Sure</p>
          {guestList.filter(g => g.status?.toLowerCase().includes("not sure")).map((guest, idx) => (
            <div key={idx} style={styles.guestRow}>
              <span>{guest.name}</span>
              <span style={styles.dash}>➖</span>
            </div>
          ))}
        </div>

        {/* ❌ Others */}
        <div style={styles.section}>
          <p style={styles.sectionTitleRed}>No Response / Other</p>
          {guestList
            .filter(
              g =>
                !g.status?.toLowerCase().includes("coming") &&
                !g.status?.toLowerCase().includes("not sure")
            )
            .map((guest, idx) => (
              <div key={idx} style={styles.guestRow}>
                <span>{guest.name}</span>
                <span style={styles.cross}>❌</span>
              </div>
            ))}
        </div>

        <button style={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
};

export default RSVPPopup;
