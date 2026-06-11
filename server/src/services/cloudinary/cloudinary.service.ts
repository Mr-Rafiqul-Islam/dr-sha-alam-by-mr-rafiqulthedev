import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureCloudinaryConfigured(): void {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  configured = true;
}

export type CloudinaryUploadResult = {
  imageId: string;
  optimizedUrl: string;
};

export async function uploadImageBuffer(
  buffer: Buffer,
  folder = "patient-reviews",
): Promise<CloudinaryUploadResult> {
  ensureCloudinaryConfigured();

  const result = await new Promise<{
    public_id: string;
    secure_url: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, res) => {
        if (err || !res) reject(err ?? new Error("Cloudinary upload failed"));
        else resolve(res);
      },
    );
    stream.end(buffer);
  });

  return {
    imageId: result.public_id,
    optimizedUrl: result.secure_url,
  };
}
