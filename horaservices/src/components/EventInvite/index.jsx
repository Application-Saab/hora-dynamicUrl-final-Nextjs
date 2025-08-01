// import React from 'react';

// const EventInvite = ({ name, time, date, month, address }) => {
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=Monotype+Corsiva&display=swap');

//         .invite-wrapper {
//           position: relative;
//           width: 90vw;
//           max-width: 400px;
//           aspect-ratio: 9 / 16;
//           margin: 20px auto;
//           background-image: url('/GoldandBlueSimpleBirthdayPartyInvitation.png'); /* Replace with actual path */
//           background-size: cover;
//           background-position: center;
//           font-family: 'Roboto', sans-serif;
//           overflow: hidden;
//           border-radius: 12px;
//           box-shadow: 0 0 10px rgba(0,0,0,0.3);
//         }

//         .top-text {
//           position: absolute;
//           top: 8%;
//           width: 100%;
//           text-align: center;
//           font-size: 14px;
//           color: white;
//           letter-spacing: 1px;
//         }

//         .name {
//           position: absolute;
//           top: 13%;
//           width: 100%;
//           text-align: center;
//           font-size: 36px;
//           font-family: 'Monotype Corsiva', cursive;
//           color: white;
//         }

//         .birthday {
//           position: absolute;
//           top: 25%;
//           width: 100%;
//           text-align: center;
//           font-size: 46px;
//           font-weight: bold;
//           color: #ffd95c;
//           font-family: 'Monotype Corsiva', cursive;
//         }

//         .party {
//           position: absolute;
//           top: 35%;
//           width: 100%;
//           text-align: center;
//           font-size: 32px;
//           font-weight: 700;
//           color: white;
//         }

//         .time, .date, .month {
//           position: absolute;
//           bottom: 20%;
//           font-size: 16px;
//           color: #ffd95c;
//         }

//         .time {
//           left: 12%;
//         }

//         .date {
//           left: 46%;
//           color: white;
//           font-size: 28px;
//           padding: 0 10px;
//           border-bottom: 2px solid #ffd95c;
//         }

//         .month {
//           right: 12%;
//         }

//         .address {
//           position: absolute;
//           bottom: 8%;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 85%;
//           text-align: center;
//           font-size: 13px;
//           color: white;
//           line-height: 1.5;
//         }

//         @media (min-width: 600px) {
//           .top-text { font-size: 16px; }
//           .name { font-size: 44px; }
//           .birthday { font-size: 56px; }
//           .party { font-size: 36px; }
//           .time, .month { font-size: 18px; }
//           .date { font-size: 32px; }
//           .address { font-size: 15px; }
//         }
//       `}</style>

//       <div className="invite-wrapper">
//         <div className="name">{name}</div>
//         <div className="time">{`At ${time}`}</div>
//         <div className="date">{date}</div>
//         <div className="month">{month}</div>
//         <div className="address">{address}</div>
//       </div>
//     </>
//   );
// };

// export default EventInvite;

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
          max-width: 340px;
          aspect-ratio: 9 / 16;
          border-radius: 24px;
          background-image: url('/GoldandBlueSimpleBirthdayPartyInvitation.png');
          background-size: cover;
          background-position: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          font-family: 'Roboto', sans-serif;
        }

        .top-text,
        .name,
        .birthday,
        .party,
        .time,
        .date,
        .month,
        .address {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
          bottom: 20%;
          font-size: 16px;
          color: #ffd95c;
        }

        .time {
          left: 12%;
        }

        .date {
          left: 43%;
          color: white;
          font-size: 28px;
          padding: 0 10px;
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
          {/* <div className="month">{truncate(month, 10)}</div> */}
          <div className="address">{truncate(address, 110)}</div>
        </div>
      </div>
    </>
  );
};

export default EventInvite;
