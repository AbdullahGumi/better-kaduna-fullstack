import { toast } from "react-toastify";

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "dos3s9rhz";
const CLOUDINARY_UPLOAD_PRESET = "betterkaduna";

const uploadToCloudinary = async (file) => {
  if (!file || !file.type.startsWith("image/")) {
    toast.error("Please upload a valid image file", { autoClose: 3000 });
    throw new Error("Invalid file type");
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url; // Return the Cloudinary URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    toast.error("Failed to upload image", { autoClose: 3000 });
    throw error;
  }
};

export { uploadToCloudinary };
