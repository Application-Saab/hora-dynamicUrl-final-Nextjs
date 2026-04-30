import { BASE_URL } from "../utils/apiconstants"
import { MEDIA_WORKER_URL } from "../utils/apiconstants";
import axios from "axios";

// get images api function 
export const getImagesbyFolderName = async ({ folderName, customerId, subFolderId, page = 1, limit = 10, }) => {
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

    const url = `${BASE_URL}/api/photo/thumbnailsWithinProject?${params.toString()}`;

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

// based on sub folder id images will get 
export const getSubFolders = async ({ folderName }) => {
  const res = await axios.get(`${BASE_URL}/api/internal/getSubFolders`, {
    params: { folderName },
  });
  return res.data;
};