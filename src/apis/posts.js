import axios from "axios";

// Posts API

const postsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/posts`,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

export const getPublicPosts = () => postsApi.get("/public");
export const getPublicPostById = (id) => postsApi.get(`/public/${id}`);
export const listPosts = () => postsApi.get("/");
export const getPostById = (id) => postsApi.get(`/${id}`);

export const createPost = (payload) => {
  // payload: plain object (JSON) or FormData (when including file: image)
  return postsApi.post("/", payload);
};

export const updatePost = (id, payload) => {
  // payload: plain object (JSON) or FormData
  return postsApi.patch(`/${id}`, payload);
};

export const deletePost = (id) => postsApi.delete(`/${id}`);
