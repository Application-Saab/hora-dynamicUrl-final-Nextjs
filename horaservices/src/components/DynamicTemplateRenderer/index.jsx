'use client';
import { useEffect, useState } from 'react';

const DynamicTemplateRenderer = ({ templateId}) => {
  const [template, setTemplate] = useState(null);
  const [data, setData] = useState({
    name: "Riya",
    time: "6:00 PM",
    date: "20",
    month: "August 2025",
    address: "4th Floor, 5 & 10, Arakere Bannerghatta Rd, Syndicate Bank Colony, Omkar Nagar, Arekere, Bengaluru, Karnataka 560076",
  });

   useEffect(() => {
    // Replace this with API call later
    const mockTemplate = {
      templateId: 'template-1',
      fontUrls: [
        'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Monotype+Corsiva&display=swap',
      ],
      cssCode: `.invite-wrapper {
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
        }`, // your full CSS here
      jsCode: `
        <div class="invite-wrapper">
          <div class="invite-card">
            <div class="name">{{name}}</div>
            <div class="time">Time: At {{time}}</div>
            <div class="date">Date: {{date}} {{month}}</div>
            <div class="address">{{address}}</div>
          </div>
        </div>
      `,
    };

    setTemplate(mockTemplate);
  }, [templateId]);

//    useEffect(() => {
//     // Replace with API call if needed
//     const mockTemplate = {
//       templateId: 'template-2',
//       fontUrls: [
//         'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
//         'https://fonts.googleapis.com/css2?family=Monotype+Corsiva&display=swap',
//       ],
//       cssCode: `
//         .astro-invite {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           min-height: 100vh;
//         }

//         .invite-card {
//           position: relative;
//           width: 100%;
//           max-width: 390px; 
//           aspect-ratio: 11 / 19;
//           background-image: url('/PurpleWatercolorBirthdayPartyInvitation.png');
//           background-size: cover;
//           background-position: center;
//           box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
//           overflow: hidden;
//           font-family: 'Roboto', sans-serif;
//           text-align: center;
//         }

//         .name {
//           position: absolute;
//           top: 14%;
//           width: 100%;
//           text-align: center;
//           font-family: 'Lato', sans-serif;
//           font-size: 20px;
//           font-weight: 700;
//         }

//         .date {
//           position: absolute;
//           top: 55%;
//           left: 10%;
//           text-align: center;
//           font-weight: bold;
//           font-family: 'Roboto', sans-serif;
//           font-size: 32px;
//         }

//         .month {
//           position: absolute;
//           top: 63%;
//           left: 5%;
//           text-align: center;
//           font-size: 16px;
//           text-transform: uppercase;
//           font-family: 'Roboto', sans-serif;
//         }

//         .time {
//           position: absolute;
//           top: 69%;
//           left: 8%;
//           text-align: center;
//           font-size: 16px;
//           font-weight: 600;
//           font-family: 'Roboto', sans-serif;
//         }

//         .address {
//           position: absolute;
//           top: 75%;
//           left: 5%;
//           width: 30%;
//           font-family: 'Roboto', sans-serif;
//           font-size: 14px;
//         }
//       `,
//       jsCode: `
//         <div class="astro-invite">
//           <div class="invite-card">
//             <div class="name">{{name}}'s</div>
//             <div class="date">{{date}}</div>
//             <div class="month">{{month}}</div>
//             <div class="time">{{time}}</div>
//             <div class="address">{{address}}</div>
//           </div>
//         </div>
//       `,
//     };

//     setTemplate(mockTemplate);
//   }, [templateId]);

//     useEffect(() => {
//     const mockTemplate = {
//       templateId: 'template-3',
//       fontUrls: [
//         'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
//         'https://fonts.googleapis.com/css2?family=Brush+Script+MT&display=swap'
//       ],
//       cssCode: `
//         .invite-wrapper {
//           background: url('/balloon-bg.png') no-repeat center center;
//           background-size: cover;
//         //   padding: 30px 16px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           min-height: 100vh;
//         }

//         .invite-card {
//           position: relative;
//           width: 100%;
//           max-width: 390px;
//           aspect-ratio: 11 / 19;
//           background-image: url('/DarkBlueIllustrativeBirthdayPartyInvitation.png');
//           background-size: cover;
//           background-position: center;
//           box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
//           overflow: hidden;
//           font-family: 'Roboto', sans-serif;
//           text-align: center;
//         }

//         .name {
//           position: absolute;
//           top: 13%;
//           width: 100%;
//           text-align: center;
//           font-size: 340%;
//           font-family: 'Monotype Corsiva', cursive;
//           color: white;
//         }

//         .datetime {
//           position: absolute;
//           top: 65%;
//           left: 0%;
//           right: 0%;
//           width: 100%;
//           text-align: center;
//           font-size: 18px;
//           font-weight: 500;
//           color: white;
//         }

//         .time {
//           position: absolute;
//           top: 71%;
//           left: 0%;
//           right: 0%;
//           width: 100%;
//           text-align: center;
//           font-size: 18px;
//           font-weight: 500;
//           color: white;
//         }

//         .address {
//           position: absolute;
//           bottom: 5%;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 85%;
//           text-align: center;
//           font-size: 14px;
//           color: white;
//           line-height: 1.4;
//         }

//         @media (min-width: 600px) {
//           .name { font-size: 44px; }
//           .datetime, .time { font-size: 20px; }
//           .address { font-size: 16px; }
//         }
//       `,
//       jsCode: `
//         <div class="invite-wrapper">
//           <div class="invite-card">
//             <div class="name">{{name}}</div>
//             <div class="datetime">{{date}} {{month}}</div>
//             <div class="time">at {{time}}</div>
//             <div class="address">{{address}}</div>
//           </div>
//         </div>
//       `
//     };

//     setTemplate(mockTemplate);
//   }, [templateId]);

// useEffect(() => {
//   const mockTemplate = {
//     templateId: 'template-4',
//     fontUrls: [
//       'https://fonts.googleapis.com/css2?family=Poppins&display=swap',
//       'https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap'
//     ],
//     cssCode: `
//       .haldi-wrapper {
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         min-height: 100vh;
//       }

//       .haldi-card {
//         position: relative;
//         width: 100%;
//         max-width: 390px;
//         aspect-ratio: 11 / 19;
//         background-image: url('/Final.png'); /* final uploaded image */
//         background-size: cover;
//         background-position: center;
//         font-family: 'Poppins', sans-serif;
//         text-align: center;
//       }

//       .name {
//         position: absolute;
//         top: 77%;
//         width: 100%;
//         font-family: 'Tenor Sans', sans-serif;
//         font-size: 30px;
//         color: #c01c28;
//       }

//       .datetime {
//         position: absolute;
//         top: 85%;
//         width: 100%;
//         font-size: 14px;
//         color: #000;
//       }

//       .address {
//         position: absolute;
//         bottom: 7%;
//         width: 100%;
//         font-size: 8px;
//         color: #000;
//       }
//     `,
//     jsCode: `
//       <div class="haldi-wrapper">
//         <div class="haldi-card">
//           <div class="name">{{name}}</div>
//           <div class="datetime">{{date}} {{month}} {{year}} | {{time}}</div>
//           <div class="address">{{address}}</div>
//         </div>
//       </div>
//     `
//   };

//   setTemplate(mockTemplate);
// }, [templateId]);


  const renderHTML = (jsCode, rawData) => {
    const truncate = (str, max) => str?.toString().slice(0, max) || '';

    const data = {
      name: truncate(rawData.name, 10),
      time: truncate(rawData.time, 5),
      date: truncate(rawData.date, 2),
      month: truncate(rawData.month, 7),
      address: truncate(rawData.address, 50),
    };

    return jsCode.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || '');
  };

  if (!template) return <p>Loading template...</p>;

  return (
    <>
      {template.fontUrls.map((url, index) => (
        <link key={index} href={url} rel="stylesheet" />
      ))}
      <style dangerouslySetInnerHTML={{ __html: template.cssCode }} />
      <div dangerouslySetInnerHTML={{ __html: renderHTML(template.jsCode, data) }} />
    </>
  );
};

export default DynamicTemplateRenderer;
