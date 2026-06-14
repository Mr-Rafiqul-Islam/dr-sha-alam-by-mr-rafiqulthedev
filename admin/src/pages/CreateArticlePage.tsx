import { useEffect, useRef } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import {

  ArticleForm,

  type ArticleFormRef,

} from "../components/articles/ArticleForm";

import { Button, Icon } from "../components/common";

import { DEFAULT_BLOG_AUTHOR } from "../constants/blog";

import {

  useCreateBlogMutation,

  useDeleteBlogImageMutation,

  useGetBlogByIdQuery,

  useUpdateBlogMutation,

} from "../store/api/blogsApi";

import type { BlogFormData } from "../types/blog";

import {

  blogToFormData,

  // formatBlogDate,

  getApiErrorMessage,

  toCreateBlogPayload,

  toUpdateBlogPayload,

} from "../utils/blog";



const EMPTY_FORM: BlogFormData = {

  title: "",

  slug: "",

  shortDesc: "",

  content: "",

  category: "",

  author: DEFAULT_BLOG_AUTHOR,

  published: true,

  image: "",

  imagePublicId: "",

  metaTitle: "",

  metaKeywords: "",

  metaDescription: "",

  notes: "",

};



export function CreateArticlePage() {

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const isEditMode = Boolean(id);

  const formRef = useRef<ArticleFormRef>(null);

  const pendingPublicIdRef = useRef<string | null>(null);

  const persistedPublicIdRef = useRef("");



  const {

    data: blog,

    isLoading: isLoadingBlog,

    isError: isBlogError,

    error: blogError,

  } = useGetBlogByIdQuery(id ?? "", { skip: !id });



  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [deleteBlogImage] = useDeleteBlogImageMutation();



  useEffect(() => {

    if (isEditMode && blog) {

      persistedPublicIdRef.current = blog.imagePublicId;

    }

  }, [isEditMode, blog]);



  useEffect(() => {

    if (isBlogError) {

      toast.error(getApiErrorMessage(blogError, "Failed to load blog"));

      navigate("/articles");

    }

  }, [isBlogError, blogError, navigate]);



  const isSubmitting = isCreating || isUpdating;



  const cleanupPendingUpload = async () => {

    const pendingId = pendingPublicIdRef.current;

    if (!pendingId || pendingId === persistedPublicIdRef.current) {

      return;

    }



    try {

      await deleteBlogImage({ imagePublicId: pendingId }).unwrap();

    } catch {

      // Best-effort cleanup

    } finally {

      pendingPublicIdRef.current = null;

    }

  };



  const handleBack = async () => {

    await cleanupPendingUpload();

    navigate("/articles");

  };



  const handleSubmit = async (data: BlogFormData, published: boolean) => {

    try {

      if (isEditMode && id) {

        await updateBlog({

          id,

          body: toUpdateBlogPayload(data, published),

        }).unwrap();

        toast.success(published ? "Blog published" : "Draft saved");

      } else {

        await createBlog(toCreateBlogPayload(data, published)).unwrap();

        toast.success(published ? "Blog published" : "Draft saved");

      }



      pendingPublicIdRef.current = null;

      navigate("/articles");

    } catch (error) {

      toast.error(

        getApiErrorMessage(

          error,

          isEditMode ? "Failed to update blog" : "Failed to create blog",

        ),

      );

    }

  };



  if (isEditMode && isLoadingBlog) {

    return (

      <div className="flex items-center justify-center py-20 text-on-surface-variant">

        <Icon name="progress_activity" size={32} className="animate-spin" />

      </div>

    );

  }



  if (isEditMode && !blog) {

    return null;

  }



  const formDefaults = isEditMode && blog ? blogToFormData(blog) : EMPTY_FORM;



  return (

    <>

      <div className="mb-stack-lg flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex min-w-0 items-center gap-3">

          <Button

            variant="icon"

            size="sm"

            aria-label="Back to blogs"

            onClick={() => void handleBack()}

            className="shrink-0"

          >

            <Icon name="arrow_back" size={22} />

          </Button>

          <div className="min-w-0">

            <h2 className="text-2xl font-semibold tracking-tight text-primary-container md:text-headline-lg">

              {isEditMode ? "Edit Blog" : "Create New Blog"}

            </h2>

          </div>

        </div>



        <div className="flex flex-wrap items-center gap-3">

          <Button

            variant="ghost"

            disabled={isSubmitting}

            onClick={() => formRef.current?.submitAsDraft()}

            className="border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface hover:bg-surface-container-high"

          >

            Save Draft

          </Button>

          <Button

            disabled={isSubmitting}

            onClick={() => formRef.current?.submitAsPublished()}

          >

            {isSubmitting ? "Saving..." : "Publish Blog"}

          </Button>

        </div>

      </div>



      <ArticleForm

        ref={formRef}

        key={isEditMode ? blog!.id : "create"}

        defaultValues={formDefaults}

        onSubmit={handleSubmit}

        isSubmitting={isSubmitting}

        persistedImagePublicId={blog?.imagePublicId ?? ""}

        onTrackPendingPublicId={(publicId) => {

          pendingPublicIdRef.current = publicId;

        }}

        // stats={

        //   blog

        //     ? {

        //         views: blog.views,

        //         comments: blog.comments.length,

        //         createdAt: formatBlogDate(blog.createdAt),

        //       }

        //     : undefined

        // }

      />

    </>

  );

}

