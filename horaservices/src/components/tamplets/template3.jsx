  useEffect(() => {
    const mockTemplate = {
      templateId: 'template-1',
      fontUrls: [
        'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Brush+Script+MT&display=swap'
      ],
      cssCode: `
        .invite-wrapper {
          background: url('/balloon-bg.png') no-repeat center center;
          background-size: cover;
        //   padding: 30px 16px;
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
          background-image: url('/DarkBlueIllustrativeBirthdayPartyInvitation.png');
          background-size: cover;
          background-position: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          font-family: 'Roboto', sans-serif;
          text-align: center;
        }

        .name {
          position: absolute;
          top: 13%;
          width: 100%;
          text-align: center;
          font-size: 340%;
          font-family: 'Monotype Corsiva', cursive;
          color: white;
        }

        .datetime {
          position: absolute;
          top: 65%;
          left: 0%;
          right: 0%;
          width: 100%;
          text-align: center;
          font-size: 18px;
          font-weight: 500;
          color: white;
        }

        .time {
          position: absolute;
          top: 71%;
          left: 0%;
          right: 0%;
          width: 100%;
          text-align: center;
          font-size: 18px;
          font-weight: 500;
          color: white;
        }

        .address {
          position: absolute;
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
          width: 85%;
          text-align: center;
          font-size: 14px;
          color: white;
          line-height: 1.4;
        }

        @media (min-width: 600px) {
          .name { font-size: 44px; }
          .datetime, .time { font-size: 20px; }
          .address { font-size: 16px; }
        }
      `,
      jsCode: `
        <div class="invite-wrapper">
          <div class="invite-card">
            <div class="name">{{name}}</div>
            <div class="datetime">{{date}} {{month}}</div>
            <div class="time">at {{time}}</div>
            <div class="address">{{address}}</div>
          </div>
        </div>
      `
    };

    setTemplate(mockTemplate);
  }, [templateId]);