// Convert a Base64-encoded string to a File object
export function base64StringtoFile(base64String, filename) {
  var arr = base64String.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function downloadBase64File(base64Data, filename) {
  var element = document.createElement("a");
  element.setAttribute("href", base64Data);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function extractImageFileExtensionFromBase64(base64Data) {
  return base64Data.substring(
    "data:image/".length,
    base64Data.indexOf(";base64")
  );
}

export function image64toCanvasRef(
  canvasRef,
  image64,
  pixelCrop,
  naturalSize,
  currentSize
) {
  const widthDifference = (naturalSize.width / currentSize.width).toFixed(2);
  const heightDifference = (naturalSize.height / currentSize.height).toFixed(2);

  const canvas = canvasRef;
  canvas.width = pixelCrop.width * heightDifference;
  canvas.height = pixelCrop.height * widthDifference;
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.src = image64;
  image.onload = function () {
    ctx.drawImage(
      image,
      pixelCrop.x * widthDifference,
      pixelCrop.y * heightDifference,
      pixelCrop.width * widthDifference,
      pixelCrop.height * heightDifference,
      0,
      0,
      pixelCrop.width * widthDifference,
      pixelCrop.height * heightDifference
    );
  };
}
