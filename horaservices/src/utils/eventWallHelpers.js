// utils/eventWallHelpers.js
// Measure height of thumbnail/local image
function measureImageHeight(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img.height);
    img.onerror = () => resolve(0);
  });
}

// Reorder — Tallest image → Big block (pos 3)
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
    (item) => item.isPin && Number.isInteger(item.pinPosition)
  );

  const unpinned = list.filter((item) => !item.isPin);

  // Measure height ONLY for unpinned
  const enrichedUnpinned = await Promise.all(
    unpinned.map(async (item) => ({
      ...item,
      height: await measureImageHeight(
        item?.postWebpUrl || item?.postUrl || item?.localPreview
      ),
    }))
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



// utils/opfsHelper.js
const OPFS_ROOT_DIR = 'eventwall-temp-uploads';

export async function saveFileToOPFS(file, eventId, uniqueId) {
  try {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle(OPFS_ROOT_DIR, { create: true });
    const fileHandle = await dir.getFileHandle(`${eventId}__${uniqueId}`, { create: true });

    const writable = await fileHandle.createWritable();
    await writable.write(file);
    await writable.close();

    return true;
  } catch (err) {
    console.error('OPFS save failed:', err);
    return false;
  }
}

export async function getFileFromOPFS(eventId, uniqueId) {
  const root = await navigator.storage.getDirectory();
  const dir = await root.getDirectoryHandle(OPFS_ROOT_DIR, { create: false });
  const fileHandle = await dir.getFileHandle(`${eventId}__${uniqueId}`, { create: false });
  return await fileHandle.getFile();
}

export async function deleteFromOPFS(eventId, uniqueId) {
  try {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle(OPFS_ROOT_DIR, { create: false });
    await dir.removeEntry(`${eventId}__${uniqueId}`);
  } catch {}
}