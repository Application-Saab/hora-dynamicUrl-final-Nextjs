import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faMessage, faTicketAlt } from "@fortawesome/free-solid-svg-icons";

import Tabs from "../Tabs";
import WanderlandUploadImage from "./WanderlandUploadImage";
import WanderlandThankYouNote from "./WanderlandThankYouNote";
import WanderlandTryYourLuck from "./WanderlandTryYourLuck";

const WanderlandTabSection = () => {
  const tabList = [
    {
      id: "upload",
      title: (
        <>
          <FontAwesomeIcon icon={faCamera} style={{ marginRight: 8 }} />
          Upload Image
        </>
      ),
      content: <WanderlandUploadImage />,
    },
    {
      id: "thankyou",
      title: (
        <>
          <FontAwesomeIcon icon={faMessage} style={{ marginRight: 8 }} />
          Thank You Note
        </>
      ),
      content: <WanderlandThankYouNote />,
    },
    {
      id: "luck",
      title: (
        <>
          <FontAwesomeIcon icon={faTicketAlt} style={{ marginRight: 8 }} />
          Try Your Luck!
        </>
      ),
      content: <WanderlandTryYourLuck />,
    },
  ];

  return <Tabs tabs={tabList} defaultTab="upload" />;
};

export default WanderlandTabSection;
