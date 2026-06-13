import {
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { BlogFormData } from "../../types/blog";
import { slugify } from "../../utils/blog";
import { cn } from "../../lib/cn";
import { BlogImageUpload } from "./BlogImageUpload";
import { CollapsibleSection } from "./CollapsibleSection";
import { RichTextEditor } from "./RichTextEditor";
import { ToggleSwitch } from "./ToggleSwitch";

const blogFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  shortDesc: z.string().trim().min(1, "Short description is required"),
  content: z
    .string()
    .refine(
      (value) => value.replace(/<[^>]*>/g, "").trim().length > 0,
      "Content is required",
    ),
  category: z.string().trim().min(1, "Category is required"),
  author: z.string().trim().min(1, "Author is required"),
  published: z.boolean(),
  isFeatured: z.boolean(),
  image: z.string().trim().min(1, "Featured image is required"),
  imagePublicId: z.string().trim().min(1, "Featured image is required"),
  metaTitle: z.string(),
  metaKeywords: z.string(),
  metaDescription: z.string(),
  notes: z.string(),
});

export type ArticleFormRef = {
  submitAsDraft: () => void;
  submitAsPublished: () => void;
};

type ArticleFormProps = {
  defaultValues: BlogFormData;
  onSubmit: (data: BlogFormData, published: boolean) => void | Promise<void>;
  isSubmitting?: boolean;
  persistedImagePublicId?: string;
  onTrackPendingPublicId?: (publicId: string | null) => void;
  stats?: {
    views: number;
    comments: number;
    createdAt: string;
  };
};

const fieldClass = cn(
  "w-full min-h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-body-md text-on-surface",
  "placeholder:text-on-surface-variant focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container",
);

const labelClass = "mb-1.5 block text-label-md font-medium text-on-surface";

export const ArticleForm = forwardRef<ArticleFormRef, ArticleFormProps>(
  function ArticleForm(
    {
      defaultValues,
      onSubmit,
      isSubmitting = false,
      persistedImagePublicId = "",
      onTrackPendingPublicId,
      stats,
    },
    ref,
  ) {
    const {
      control,
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
    } = useForm<BlogFormData>({
      resolver: zodResolver(blogFormSchema) as Resolver<BlogFormData>,
      defaultValues,
    });

    const title = watch("title");

    useEffect(() => {
      if (title) {
        setValue("slug", slugify(title));
      }
    }, [title, setValue]);

    useImperativeHandle(ref, () => ({
      submitAsDraft: () => {
        handleSubmit((data) => onSubmit(data, false))();
      },
      submitAsPublished: () => {
        handleSubmit((data) => onSubmit(data, true))();
      },
    }));

    return (
      <form className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5">
            <div className="flex flex-col gap-5">
              <div>
                <label htmlFor="title" className={labelClass}>
                  Blog Title
                </label>
                <input
                  id="title"
                  {...register("title")}
                  placeholder="e.g., Understanding Modern Knee Replacement Techniques"
                  className={fieldClass}
                  disabled={isSubmitting}
                />
                {errors.title ? (
                  <p className="mt-1 text-label-sm text-error">
                    {errors.title.message}
                  </p>
                ) : null}
              </div>


              <div>
                <label htmlFor="shortDesc" className={labelClass}>
                  Short Description
                </label>
                <textarea
                  id="shortDesc"
                  {...register("shortDesc")}
                  rows={3}
                  className={cn(fieldClass, "min-h-24 resize-y py-3")}
                  disabled={isSubmitting}
                />
                {errors.shortDesc ? (
                  <p className="mt-1 text-label-sm text-error">
                    {errors.shortDesc.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="category" className={labelClass}>
                  Category
                </label>
                <input
                  id="category"
                  {...register("category")}
                  placeholder="Orthopedic Surgery, Patient Education, Rehabilitation"
                  className={fieldClass}
                  disabled={isSubmitting}
                />
                {errors.category ? (
                  <p className="mt-1 text-label-sm text-error">
                    {errors.category.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label className={labelClass}>Full Blog Content</label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.content ? (
                  <p className="mt-1 text-label-sm text-error">
                    {errors.content.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <CollapsibleSection title="SEO & Metadata" defaultOpen>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="metaTitle" className={labelClass}>
                  Meta Title
                </label>
                <input
                  id="metaTitle"
                  {...register("metaTitle")}
                  className={fieldClass}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="metaKeywords" className={labelClass}>
                  Keywords (Comma separated)
                </label>
                <input
                  id="metaKeywords"
                  {...register("metaKeywords")}
                  placeholder="orthopedic, surgery, knee, health"
                  className={fieldClass}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="metaDescription" className={labelClass}>
                  Meta Description
                </label>
                <textarea
                  id="metaDescription"
                  {...register("metaDescription")}
                  rows={3}
                  className={cn(fieldClass, "min-h-24 resize-y py-3")}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Additional Notes">
            <div>
              <label htmlFor="notes" className={labelClass}>
                Internal Notes
              </label>
              <textarea
                id="notes"
                {...register("notes")}
                rows={4}
                className={cn(fieldClass, "min-h-28 resize-y py-3")}
                disabled={isSubmitting}
              />
            </div>
          </CollapsibleSection>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
            <h3 className="mb-4 text-label-md font-semibold text-on-surface">
              Publishing
            </h3>
            <div className="flex flex-col gap-5">
              <Controller
                name="published"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch
                    id="published"
                    label="Published"
                    description="Show on live website"
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch
                    id="isFeatured"
                    label="Featured"
                    description="Pin to top of blog home"
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />

              <div>
                <label htmlFor="author" className={labelClass}>
                  Author
                </label>
                <input
                  id="author"
                  {...register("author")}
                  placeholder="Dr. Shah Alam, Jane Doe"
                  className={fieldClass}
                  disabled={isSubmitting}
                />
                {errors.author ? (
                  <p className="mt-1 text-label-sm text-error">
                    {errors.author.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <Controller
            name="image"
            control={control}
            render={({ field: imageField }) => (
              <Controller
                name="imagePublicId"
                control={control}
                render={({ field: publicIdField }) => (
                  <BlogImageUpload
                    image={imageField.value}
                    imagePublicId={publicIdField.value}
                    persistedPublicId={persistedImagePublicId}
                    disabled={isSubmitting}
                    onTrackPendingPublicId={onTrackPendingPublicId}
                    onChange={(image, imagePublicId) => {
                      imageField.onChange(image);
                      publicIdField.onChange(imagePublicId);
                    }}
                  />
                )}
              />
            )}
          />
          {errors.image || errors.imagePublicId ? (
            <p className="-mt-4 text-label-sm text-error">
              Featured image is required
            </p>
          ) : null}

          {stats ? (
            <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
              <h3 className="mb-3 text-label-md font-semibold text-on-surface">
                Stats
              </h3>
              <dl className="space-y-2 text-body-md">
                <div className="flex justify-between gap-4">
                  <dt className="text-on-surface-variant">Views</dt>
                  <dd className="font-medium text-on-surface">{stats.views}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-on-surface-variant">Comments</dt>
                  <dd className="font-medium text-on-surface">
                    {stats.comments}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-on-surface-variant">Created</dt>
                  <dd className="font-medium text-on-surface">
                    {stats.createdAt}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>
      </form>
    );
  },
);
