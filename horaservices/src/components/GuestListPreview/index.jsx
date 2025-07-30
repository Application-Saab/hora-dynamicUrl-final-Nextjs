import React from "react";
import { FaCheckCircle, FaUsers } from "react-icons/fa";

const GuestListPreview = ({ guestList = [], loading, fetchGuests }) => {
  const styles = {
    cardWrapper: {
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      padding: "20px",
      textAlign: "center",
      marginTop: "20px",
    },
    cardTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "16px",
    },
    nameRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px",
      fontSize: "1rem",
      fontWeight: "500",
      color: "#444",
    },
    viewListButton: {
      backgroundColor: "#a54c93",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "10px 20px",
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "opacity 0.3s",
      margin: "auto",
    },
  };

  return (
    <div style={styles.cardWrapper}>
      <h3 style={styles.cardTitle}>See Who’s Coming!</h3>
      <div style={styles.nameRow}>
        <FaCheckCircle
          color="green"
          style={{ marginRight: 6, width: 30, height: 30, marginBottom: 20 }}
        />
        <span>
          {guestList[0]?.name || "Someone"} and {guestList.length - 1} more are
          ready to thrill...
        </span>
      </div>
      <button
        onClick={fetchGuests}
        style={{
          ...styles.viewListButton,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner" style={{ marginRight: 8 }} />
            Loading...
          </>
        ) : (
          <>
            <FaUsers style={{ marginRight: 8 }} />
            View Full List
          </>
        )}
      </button>
    </div>
  );
};

export default GuestListPreview;
