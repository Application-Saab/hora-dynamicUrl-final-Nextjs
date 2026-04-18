// Measure height of thumbnail/local image
function measureImageHeight(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img.height);
    img.onerror = () => resolve(0);
  });
}

// Reorder -> Tallest image -> Big block
function reorderByHeight(items) {
  const result = [];

  for (let i = 0; i < items.length; i += 6) {
    const chunk = items.slice(i, i + 6);

    if (chunk.length < 6) {
      result.push(...chunk);
      continue;
    }

    const tallest = [...chunk].sort((a, b) => b.height - a.height)[0];

    const arranged = [];
    chunk.forEach((img) => {
      if (img === tallest) return;
      arranged.push(img);
    });

    arranged.splice(3, 0, tallest);
    result.push(...arranged);
  }

  return result;
}

// Pin-aware processing
export async function processImagesWithHeight(list) {
  if (!Array.isArray(list)) return [];

  // Separate pinned & unpinned
  const pinned = list.filter(
    (item) => item.isPin && Number.isInteger(item.pinPosition),
  );

  const unpinned = list.filter((item) => !item.isPin);

  // Measure height ONLY for unpinned
  const enrichedUnpinned = await Promise.all(
    unpinned.map(async (item) => ({
      ...item,
      height: await measureImageHeight(
        item?.postWebpUrl || item?.postUrl || item?.localPreview,
      ),
    })),
  );

  // Apply existing height-based reorder
  const reorderedUnpinned = reorderByHeight(enrichedUnpinned);

  // Inject pinned back at fixed positions
  const finalResult = [...reorderedUnpinned];

  pinned
    .sort((a, b) => a.pinPosition - b.pinPosition)
    .forEach((item) => {
      const index = item.pinPosition - 1;
      finalResult.splice(index, 0, item);
    });

  return finalResult;
}

const OPFS_ROOT_DIR = "eventwall-temp-uploads";

export async function saveFileToOPFS(file, eventId, uniqueId) {
  try {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle(OPFS_ROOT_DIR, { create: true });
    const ext = file.name.split(".").pop();

    const fileHandle = await dir.getFileHandle(
      `${eventId}__${uniqueId}.${ext}`,
      { create: true },
    );

    const writable = await fileHandle.createWritable();
    await writable.write(file);
    await writable.close();

    return true;
  } catch (err) {
    console.error("OPFS save failed:", err);
    return false;
  }
}

export async function getFileFromOPFS(eventId, uniqueId, mimeType, fileName) {
  const root = await navigator.storage.getDirectory();
  const dir = await root.getDirectoryHandle(OPFS_ROOT_DIR, { create: false });

  const ext = fileName.split(".").pop();

  const fileHandle = await dir.getFileHandle(`${eventId}__${uniqueId}.${ext}`, {
    create: false,
  });

  const blob = await fileHandle.getFile();

  return new File([blob], fileName, { type: mimeType });
}

export async function deleteFromOPFS(eventId, uniqueId) {
  try {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle(OPFS_ROOT_DIR, { create: false });
    await dir.removeEntry(`${eventId}__${uniqueId}`);
  } catch {}
}

export async function getPreviewFromOPFS(eventId, id, fileName) {
  try {
    const file = await getFileFromOPFS(eventId, id, "", fileName);
    return URL.createObjectURL(file);
  } catch (err) {
    console.error("Preview load failed", err);
    return null;
  }
}
