

import React from 'react';

const truncate = (text, max) => (text?.length > max ? text.slice(0, max) : text);

const EventInvite = ({ name, time, date, month, address }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Monotype+Corsiva&display=swap');

        .invite-wrapper {
          background: url('/balloon-bg.png') no-repeat center center;
          background-size: cover;
          padding: 30px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .invite-card {
    position: relative;
    width: 100%;
     max-width: 390px; 
    aspect-ratio: 11 / 19;
    /* border-radius: 24px; */
    background-image: url(/GoldandBlueSimpleBirthdayPartyInvitation.png);
    background-size: cover;
    background-position: center;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    font-family: 'Roboto', sans-serif;
    text-align: center;
}

        .top-text,
        .name,
        .birthday,
        .party,
        .time,
        .date,
        .month,
        .address {
          // white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;
        }

        .name {
          position: absolute;
          top: 13%;
          width: 100%;
          text-align: center;
          font-size: 300%;
          font-family: 'Monotype Corsiva', cursive;
          color: white;
        }

        .time,
        .date,
        .month {
          position: absolute;
          // bottom: 20%;
          font-size: 16px;
          color: #ffd95c;
        }

      .time {
    left: 0%;
    right: 0%;
    top: 65%;
}

       .date {
    left: 0%;
    right: 0%;
    top: 70%;
    color: white;
    font-size: 28px;
}

        .month {
          right: 12%;
        }

        .address {
          position: absolute;
          bottom: 8%;
          left: 50%;
          transform: translateX(-50%);
          width: 85%;
          text-align: center;
          font-size: 13px;
          color: white;
          line-height: 1.5;
        }

        @media (min-width: 600px) {
          .name { font-size: 44px; }
          .time, .month { font-size: 18px; }
          .date { font-size: 32px; }
          .address { font-size: 15px; }
        }
      `}</style>

      <div className="invite-wrapper">
        <div className="invite-card">
          <div className="name">{truncate(name, 10)}</div>
          <div className="time"> Time: {`At ${truncate(time, 5)}`}</div>
          <div className="date">Date :{truncate(date, 2)} {truncate(month, 10)}</div>
          <div className="address">{truncate(address, 110)}</div>
        </div>
      </div>
    </>
  );
};

export default EventInvite;
