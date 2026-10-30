import axios from "axios";

const API_URL = "https://medio-driver-backend.vercel.app";

export const uploadByApi = async (files) => {
  if (!files || files.length === 0) throw new Error("No files selected");
  if (files.length > 5) throw new Error("Maximum 5 files at a time");
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  try {
    const res = await axios.post(
      `${API_URL}/api/v1/key/upload-media`,
      formData,
      {
        headers: {
          apikey: import.meta.env.VITE_Medio_Driver,
        },
      },
    );
    return res.data;
  } catch (err) {
    console.error("Upload error:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};
