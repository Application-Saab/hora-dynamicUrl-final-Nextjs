

'use client';
import React from 'react';
import Head from 'next/head';

const AstroBirthdayInvite = ({ name, date, time, address }) => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style>{`
        .astro-invite {
           padding: 40px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: 'Roboto', sans-serif;
        }

        .invite-card {
          width: 100%;
          max-width: 390px;
          aspect-ratio: 3 / 5;
          background-image: url('/DarkBlueIllustrativeBirthdayPartyInvitation.png');
          background-size: cover;
          background-position: center;
        
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          text-align: center;
          padding: 40px 20px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .invite-heading {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .invite-name {
          font-size: 36px;
          font-family: 'Brush Script MT', cursive;
          font-weight: bold;
        }

        .invite-occasion {
          font-size: 32px;
          margin: 20px 0 10px;
          font-family: 'Brush Script MT', cursive;
        }

        .invite-divider {
          margin: 10px auto 20px;
          font-size: 20px;
          color: #ffffffcc;
        }

        .invite-details {
          font-size: 16px;
          line-height: 1.6;
        }

        .invite-datetime {
          font-weight: 500;
          font-size: 16px;
          margin-bottom: 10px;
        }

        .invite-address {
          font-size: 14px;
          color: #dddddd;
        }
      `}</style>

      <div className="astro-invite">
        <div className="invite-card">
        
       
            <div className="invite-name">{name}</div>
          
          <div className="invite-details">
            <div className="invite-datetime">{date} &nbsp;&nbsp; At {time}</div>
            <div className="invite-address">{address}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AstroBirthdayInvite;

