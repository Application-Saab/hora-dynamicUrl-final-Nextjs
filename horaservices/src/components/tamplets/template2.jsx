 useEffect(() => {
    // Replace with API call if needed
    const mockTemplate = {
      templateId: 'template-1',
      fontUrls: [
        'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Monotype+Corsiva&display=swap',
      ],
      cssCode: `
        .astro-invite {
          background: #f0f0f0;
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
          background-image: url('/PurpleWatercolorBirthdayPartyInvitation.png');
          background-size: cover;
          background-position: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          font-family: 'Roboto', sans-serif;
          text-align: center;
        }

        .name {
          position: absolute;
          top: 14%;
          width: 100%;
          text-align: center;
          font-family: 'Lato', sans-serif;
          font-size: 20px;
          font-weight: 700;
        }

        .date {
          position: absolute;
          top: 55%;
          left: 10%;
          text-align: center;
          font-weight: bold;
          font-family: 'Roboto', sans-serif;
          font-size: 32px;
        }

        .month {
          position: absolute;
          top: 63%;
          left: 5%;
          text-align: center;
          font-size: 16px;
          text-transform: uppercase;
          font-family: 'Roboto', sans-serif;
        }

        .time {
          position: absolute;
          top: 69%;
          left: 8%;
          text-align: center;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Roboto', sans-serif;
        }

        .address {
          position: absolute;
          top: 75%;
          left: 5%;
          width: 30%;
          font-family: 'Roboto', sans-serif;
          font-size: 14px;
        }
      `,
      jsCode: `
        <div class="astro-invite">
          <div class="invite-card">
            <div class="name">{{name}}'s</div>
            <div class="date">{{date}}</div>
            <div class="month">{{month}}</div>
            <div class="time">{{time}}</div>
            <div class="address">{{address}}</div>
          </div>
        </div>
      `,
    };

    setTemplate(mockTemplate);
  }, [templateId]);