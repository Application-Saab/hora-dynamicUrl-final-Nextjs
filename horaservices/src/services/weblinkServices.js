import { BASE_URL } from "../utils/apiconstants"
import { MEDIA_WORKER_URL } from "../utils/apiconstants";
import axios from "axios";

// get images api function 
export const getImagesbyFolderName = async ({ folderName, customerId, subFolderId, page = 1, limit = 24, }) => {
  try {

    const params = new URLSearchParams({
      folderName,
      customerId,
      page,
      limit,
    });

    if (subFolderId) {
      params.append("subFolderId", subFolderId);
    }

    const url = `${BASE_URL}/api/internal/weblink-gallery-images?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error("getThumbnails error:", error);
    throw error;
  }
};

//create subb folder api function
export const createSubfolder = async (formData) => {
  try {
    const res = await fetch(`${MEDIA_WORKER_URL}/create-subfolder`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to create subfolder");
    }

    return await res.json();
  } catch (error) {
    console.error("createSubfolder error:", error);
    throw error;
  }
};

//update subfolder dp api fumction
export const updateSubfolderDP = async (formData) => {
  try {
    const res = await fetch(`${MEDIA_WORKER_URL}/update-subfolder-dp`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to update subfolder DP");
    }

    return await res.json();
  } catch (error) {
    console.error("updateSubfolderDP error:", error);
    throw error;
  }
};

// add to images in subfolder function 
export const assignToSubfolder = async ({
  subFolderId,
  addImageIds,
  removeImageIds,
}) => {
  try {
    const res = await fetch(`${BASE_URL}/api/internal/assign-to-subfolder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subFolderId,
        addImageIds,
        removeImageIds,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to assign to subfolder");
    }

    return await res.json(); 
  } catch (error) {
    console.error("assignToSubfolder error:", error);
    throw error;
  }
};

//api for download and share tracking
export const trackActivity = async (mediaId, action) => {
  if (!mediaId) return;
  try {
    await fetch(`${BASE_URL}/api/internal/track-activity/${mediaId}`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }), 
    });
  } catch (error) {
    console.error(`Failed to track ${action}:`, error);
  }
};

//api for newly registered user
export const trackGalleryView = async (userId, mainFolderId) => {
  try {
    await fetch(`${BASE_URL}/api/internal/track-gallery-view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, mainFolderId }),
    });
  } catch (err) {
    console.error("Tracking failed:", err);
  }
};

// tracking folder click function 
export const trackFolderClick = async (mainFolderId) => { 
    try {
      const response = await fetch(`${BASE_URL}/api/internal/track-click`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mainFolderId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error("Error in trackFolderClick service:", error);
      throw error;
    }
};

// track device type api
export const trackDevice = async ({
  mainFolderId,
  userId,
  deviceType,
}) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/internal/track-device`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mainFolderId,
          userId,
          deviceType,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to track device");
    }

    return await response.json();
  } catch (error) {
    console.error("trackDevice error:", error);
    throw error;
  }
};


// tracking share capsule click function 
export const trackShareCapsuleClick = async (mainFolderId) => { 
    try {
      const response = await fetch(`${BASE_URL}/api/internal/track-capsule-share-click`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mainFolderId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error("Error in trackShareCapsuleClick service:", error);
      throw error;
    }
  }

//get subfolder api function 
export const getSubFolders = async ({ folderName }) => {
  const res = await axios.get(`${BASE_URL}/api/internal/getSubFolders`, {
    params: { folderName },
  });
  return res.data;
};