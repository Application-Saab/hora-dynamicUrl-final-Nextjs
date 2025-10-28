import React from "react";

const WhosJoining = () => {
  return (
    <div className="whos-joining-wrapper">
      <div className="whos-joining-status-box">
        <div className="status-box-header">
          <h3>Who's joining?</h3>
          <span>25 guest confirmed</span>
        </div>
        <div className="status-box-list-ctn">
          <div className="avatar-container">
            <div
              className="avatar-item-ctn"
              style={{ backgroundColor: "#FD8D0A" }}
            >
              <div className="avatar-item">
                <span>A</span>
              </div>
            </div>
            <div
              className="avatar-item-ctn"
              style={{ backgroundColor: "#E8275F" }}
            >
              <div className="avatar-item">
                <span>A</span>
              </div>
            </div>
            <div
              className="avatar-item-ctn"
              style={{ backgroundColor: "#A654B0" }}
            >
              <div className="avatar-item">
                <span>A</span>
              </div>
            </div>
            <div
              className="avatar-item-ctn"
              style={{ backgroundColor: "#31B8CC" }}
            >
              <div className="avatar-item">
                <span>A</span>
              </div>
            </div>
            <div
              className="avatar-item-ctn"
              style={{ backgroundColor: "#F2BB2F" }}
            >
              <div className="avatar-item">
                <span>A</span>
              </div>
            </div>
          </div>
          <div className="list-btn-ctn">
            <button className="list-view-btn">Full guest list</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhosJoining;
