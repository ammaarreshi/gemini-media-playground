// Convert a File object to base64 string
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Extract the base64 data from the data URL
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

// Convert a base64 string to data URL for rendering
export const base64ToDataURL = (
  base64: string,
  mimeType: string = "image/png"
): string => {
  // Check if the base64 string is already a data URL
  if (base64.startsWith("data:")) {
    return base64;
  }

  return `data:${mimeType};base64,${base64}`;
};

// Download a base64 image
export const downloadBase64Image = (
  base64: string,
  fileName: string = "generated-image.png"
): void => {
  const dataURL = base64ToDataURL(base64);
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
