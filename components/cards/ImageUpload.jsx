// src/components/ImageUpload.js
import React, { useState } from "react";
import { PaintBucket, X } from "lucide-react";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

const ImageUpload = ({ imagePreview, setImagePreview, onImageUrl }) => {
  const [fileUrl, setFileUrl] = useState(null);

  async function onChange(e) {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("No file selected.");
      return;
    }

    const file = e.target.files[0];
    console.log("file:", file);

    // Show image preview locally before upload
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Show preview only
    };
    reader.readAsDataURL(file);

    // Upload to Pinata
    let url = process.env.NEXT_PUBLIC_PINATA_GATEWAY;
    try {
      const upload = await pinata.upload.file(file);
      if (!upload || !upload.IpfsHash) {
        throw new Error("Invalid upload response from Pinata");
      }

      const fileUrl = `https://${url}/ipfs/${upload.IpfsHash}`;
      setImagePreview(fileUrl); // Update preview with actual uploaded URL
      onImageUrl(fileUrl); // Send only file URL to the parent
      console.log("Uploaded File URL:", fileUrl);
    } catch (error) {
      console.error("Upload Error:", error);
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null);
    document.getElementById("image").value = "";
  };

  return (
    <div
      className={
        imagePreview ? "image-container image-added" : "image-container"
      }
    >
      <PaintBucket />
      <label htmlFor="image">
        {" "}
        <span>Drag & Drop</span> Or Browse
      </label>
      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        onChange={onChange}
      />
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" />
          <div className="remove-image" onClick={handleRemoveImage}>
            <X />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
