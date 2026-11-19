import { fetchWithError } from "./fetchWithError";
import { BASE_URL } from "./apiconstants";


  export const downloadFile = async (url) => {
    const fileWithExt = url.split("/").pop();

    const parts = fileWithExt.split("-");
    const ext = parts.pop();
    const filename = parts.join("-") + "." + ext;
    try {
      const response = await fetchWithError(url, { mode: "cors" });
      const blob = await response.blob();

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename || "downloaded-image.jpg";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };


export const downloadVideoFile = async (url, useBackend = false) => {
  try {
    const fileWithExt = url.split("/").pop().split("?")[0];

    const parts = fileWithExt.split("-");
    const ext = parts.pop();
    const filename = parts.join("-") + "." + ext;

    const downloadUrl = useBackend
      ? `${BASE_URL}/api/internal/download-s3-video?url=${encodeURIComponent(url)}`
      : url;

    const response = await fetchWithError(downloadUrl, {
      mode: "cors",
    });

    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename || "downloaded-file";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

  } catch (error) {
    console.error("Error downloading the file:", error);
    throw error;
  }
};
