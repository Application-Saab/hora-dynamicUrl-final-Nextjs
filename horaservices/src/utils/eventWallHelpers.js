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

// Measure heights + reorder
export async function processImagesWithHeight(list) {
  const enriched = await Promise?.all(
    list?.map(async (item) => ({
      ...item,
      height: await measureImageHeight(
        item?.postWebpUrl || item?.postUrl || item?.localPreview
      ),
    }))
  );

  return reorderByHeight(enriched);
}
