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

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<GetPostsResponse, GetPostsRequest>({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/posts?page=${page}&limit=${limit}`,
      providesTags: ["Posts"],
    }),
  }),
});

export const { useGetPostsQuery } = postsApi;
