import { baseApi } from "./baseApi";

export interface Author {
  id: number;
  username: string;
}

export interface Like {
  id: number;
  userId: number;
}

export interface Comment {
  id: number;
  content: string;
  author: Author;
  createdAt: string;
}

export interface Post {
  id: number;
  content: string;
  author: Author;
  likes: Like[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetPostsResponse {
  posts: Post[];
  pagination: Pagination;
}

export interface GetPostsRequest {
  page?: number;
  limit?: number;
}

export interface CreatePostRequest {
  content: string;
}

export interface CreatePostResponse {
  message: string;
  post: Post;
}

export interface LikeResponse {
  message: string;
  liked: boolean;
  likeCount: number;
}

export interface AddCommentRequest {
  postId: number;
  content: string;
}

export interface AddCommentResponse {
  message: string;
  comment: Comment;
}

export interface GetCommentsResponse {
  comments: Comment[];
}

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<GetPostsResponse, GetPostsRequest>({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/posts?page=${page}&limit=${limit}`,
      providesTags: ["Posts"],
    }),
    createPost: builder.mutation<CreatePostResponse, CreatePostRequest>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    toggleLike: builder.mutation<LikeResponse, number>({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Posts"],
    }),
    addComment: builder.mutation<AddCommentResponse, AddCommentRequest>({
      query: ({ postId, content }) => ({
        url: `/posts/${postId}/comment`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Posts", "Comments"],
    }),
    getComments: builder.query<GetCommentsResponse, number>({
      query: (postId) => `/posts/${postId}/comments`,
      providesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useToggleLikeMutation,
  useAddCommentMutation,
  useGetCommentsQuery,
} = postsApi;
