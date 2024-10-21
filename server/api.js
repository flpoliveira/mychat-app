import express from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

cloudinary.config({
  cloud_name: "dlggt4zhl",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.use(bodyParser.json({ limit: "2mb" }));
app.use(express.json());

app.post("/upload", async (req, res) => {
  const { fileName, base64 } = req.body;
  console.log("Received file: ", fileName);
  if (!fileName || !base64) {
    return res
      .status(400)
      .json({ message: "File name and base64 content are required" });
  }

  try {
    const uploadedField = await cloudinary.uploader.upload(base64, {
      //optional things just if you want some storage optimization
      overwrite: true,
      invalidate: true,
    });

    res.status(200).json({ url: uploadedField.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
