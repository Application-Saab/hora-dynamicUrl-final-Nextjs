// export default function getCroppedImg(imageSrc, crop) {
//   return new Promise((resolve) => {
//     const image = new Image();
//     image.src = imageSrc;
//     image.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = crop.width;
//       canvas.height = crop.height;

//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(
//         image,
//         crop.x,
//         crop.y,
//         crop.width,
//         crop.height,
//         0,
//         0,
//         crop.width,
//         crop.height
//       );

//       resolve(canvas.toDataURL("image/jpeg", 0.95));
//     };
//   });
// }



export default function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };
    image.onerror = reject;
  });
}
