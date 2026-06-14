import { useRef, useState, type DragEvent } from "react";
import { toast } from "react-toastify";
import { Button, Icon } from "../common";
import { cn } from "../../lib/cn";
import {
  useDeleteBlogImageMutation,
  useUploadBlogImageMutation,
} from "../../store/api/blogsApi";
import { getApiErrorMessage } from "../../utils/blog";

type BlogImageUploadProps = {
  image: string;
  imagePublicId: string;
  onChange: (image: string, imagePublicId: string) => void;
  disabled?: boolean;
  /** Saved blog image — never delete from Cloudinary during replace/remove */
  persistedPublicId?: string;
  /** Public IDs uploaded during this session but not yet saved to a blog */
  onTrackPendingPublicId?: (publicId: string | null) => void;
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function BlogImageUpload({
  image,
  imagePublicId,
  onChange,
  disabled = false,
  persistedPublicId = "",
  onTrackPendingPublicId,
}: BlogImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadImage, { isLoading: isUploading }] = useUploadBlogImageMutation();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteBlogImageMutation();

  const isBusy = isUploading || isDeleting || disabled;

  const cleanupIfPending = async (publicId: string) => {
    if (!publicId || publicId === persistedPublicId) return;

    try {
      await deleteImage({ imagePublicId: publicId }).unwrap();
    } catch {
      // Orphan cleanup is best-effort
    }
  };

  const handleFile = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, WebP, or GIF image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be 10 MB or smaller");
      return;
    }

    const previousPublicId = imagePublicId;

    try {
      const payload = await uploadImage(file).unwrap();
      onChange(payload.image, payload.imagePublicId);
      onTrackPendingPublicId?.(payload.imagePublicId);

      if (previousPublicId && previousPublicId !== payload.imagePublicId) {
        await cleanupIfPending(previousPublicId);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to upload image"));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      void handleFile(file);
    }
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (isBusy) return;

    const file = event.dataTransfer.files[0];
    if (file) {
      void handleFile(file);
    }
  };

  const handleRemove = async () => {
    if (imagePublicId && imagePublicId !== persistedPublicId) {
      try {
        await deleteImage({ imagePublicId }).unwrap();
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to remove image"));
        return;
      }
    }

    onChange("", "");
    onTrackPendingPublicId?.(null);
  };

  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
      <h3 className="mb-3 text-label-md font-semibold text-on-surface">
        Featured Image
      </h3>

      {image ? (
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={image}
            alt="Featured"
            className="aspect-16/10 w-full object-cover"
          />
          <div className="absolute right-2 top-2 flex gap-2">
            <Button
              variant="icon"
              size="sm"
              aria-label="Replace image"
              disabled={isBusy}
              onClick={() => inputRef.current?.click()}
              className="bg-surface-container-lowest/90 backdrop-blur-sm"
            >
              <Icon name="edit" size={18} />
            </Button>
            <Button
              variant="icon"
              size="sm"
              aria-label="Remove image"
              disabled={isBusy}
              onClick={() => void handleRemove()}
              className="bg-surface-container-lowest/90 backdrop-blur-sm hover:bg-error-container/20 hover:text-error"
            >
              <Icon name="delete" size={18} />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            if (!isBusy) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-10 text-center transition-colors",
            isDragging
              ? "border-secondary bg-secondary/5"
              : "border-outline-variant/50 bg-surface-container-low",
            isBusy && "cursor-not-allowed opacity-60",
          )}
        >
          {isUploading ? (
            <Icon
              name="progress_activity"
              size={32}
              className="animate-spin text-on-surface-variant"
            />
          ) : (
            <>
              <Icon name="cloud_upload" size={36} className="text-on-surface-variant" />
              <p className="mt-3 text-body-md text-on-surface-variant">
                Drag &amp; drop or{" "}
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => inputRef.current?.click()}
                  className="font-medium text-secondary hover:underline disabled:cursor-not-allowed"
                >
                  browse
                </button>
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        disabled={isBusy}
        onChange={handleInputChange}
      />
    </div>
  );
}
