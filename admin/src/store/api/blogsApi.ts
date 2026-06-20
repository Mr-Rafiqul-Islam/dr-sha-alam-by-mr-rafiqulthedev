import { adminApiFetch } from "../../lib/adminAuth";
import type {
  Blog,
  BlogImageDeleteResponse,
  BlogImageUploadResponse,
  BlogListQueryParams,
  BlogListResponse,
  BlogResponse,
  CreateBlogPayload,
  UpdateBlogPayload,
} from "../../types/blog";
import type { DeleteMutationResponse } from "../../types/deleteRequest";
import { baseApi } from "./baseApi";

export const blogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<Blog[], BlogListQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.published) {
          searchParams.set("published", params.published);
        }
        if (params?.category) {
          searchParams.set("category", params.category);
        }
        if (params?.featured) {
          searchParams.set("featured", params.featured);
        }
        const query = searchParams.toString();
        return `/api/v1/admin/blogs${query ? `?${query}` : ""}`;
      },
      transformResponse: (response: BlogListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Blog" as const, id })),
              { type: "Blog", id: "LIST" },
            ]
          : [{ type: "Blog", id: "LIST" }],
    }),
    getBlogById: builder.query<Blog, string>({
      query: (id) => `/api/v1/admin/blogs/${id}`,
      transformResponse: (response: BlogResponse) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Blog", id }],
    }),
    createBlog: builder.mutation<Blog, CreateBlogPayload>({
      query: (body) => ({
        url: "/api/v1/admin/blogs",
        method: "POST",
        body,
      }),
      transformResponse: (response: BlogResponse) => response.data,
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),
    updateBlog: builder.mutation<
      Blog,
      { id: string; body: UpdateBlogPayload }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/admin/blogs/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: BlogResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
      ],
    }),
    deleteBlog: builder.mutation<DeleteMutationResponse, string>(
      {
        query: (id) => ({
          url: `/api/v1/admin/blogs/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, id) =>
          _result?.pending
            ? [{ type: "DeleteRequest", id: "LIST" }]
            : [
                { type: "Blog", id },
                { type: "Blog", id: "LIST" },
              ],
      },
    ),
    setBlogFeatured: builder.mutation<
      Blog,
      { id: string; isFeatured: boolean }
    >({
      query: ({ id, isFeatured }) => ({
        url: `/api/v1/admin/blogs/${id}/featured`,
        method: "PATCH",
        body: { isFeatured },
      }),
      transformResponse: (response: BlogResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
      ],
    }),
    uploadBlogImage: builder.mutation<
      BlogImageUploadResponse["payload"],
      File
    >({
      queryFn: async (file) => {
        try {
          const formData = new FormData();
          formData.append("drsa-file", file);

          const response = await adminApiFetch(
            "/api/v1/admin/blogs/upload-image",
            {
              method: "POST",
              body: formData,
            },
          );

          const data = (await response.json()) as
            | BlogImageUploadResponse
            | { success: false; message: string };

          if (!response.ok || !data.success) {
            const message =
              "message" in data ? data.message : "Image upload failed";
            return {
              error: {
                status: response.status,
                data: { message },
              },
            };
          }

          return { data: data.payload };
        } catch {
          return {
            error: {
              status: "FETCH_ERROR" as const,
              error: "Image upload failed",
            },
          };
        }
      },
    }),
    deleteBlogImage: builder.mutation<
      BlogImageDeleteResponse,
      { imagePublicId: string }
    >({
      query: ({ imagePublicId }) => ({
        url: "/api/v1/admin/blogs/upload-image",
        method: "DELETE",
        body: { imagePublicId },
      }),
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useSetBlogFeaturedMutation,
  useUploadBlogImageMutation,
  useDeleteBlogImageMutation,
} = blogsApi;
