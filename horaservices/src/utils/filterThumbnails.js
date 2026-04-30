 export const filterThumbnails = ({
  allThumbnails,
  matchedKeys,
  isMyPhotosTabActive,
  isSearchActive,
  activeSubFolderId,
  isEditing,
  isActualMyPhotos,
}) => {
      const normalize = (val) => (val || "").trim().toLowerCase();

    if (!isActualMyPhotos) {
      if (isEditing) {
        return allThumbnails;
      }
    }
    if (matchedKeys.length > 0 && (isMyPhotosTabActive || isSearchActive)) {

      const normalizedKeys = matchedKeys.map(normalize);

      return allThumbnails.filter(img => {
        if (img.type !== "image") return false;

        return normalizedKeys.includes(normalize(img.thumbnailKey));
      });
    }

    return allThumbnails;

};