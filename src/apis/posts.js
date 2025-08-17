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

export const createPost = (payload, config = {}) => {
  // payload: plain object (JSON) or FormData (when including file: image)
  const isForm = typeof FormData !== "undefined" && payload instanceof FormData;
  const headers = {
    ...(config.headers || {}),
    ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
  };
  return postsApi.post("/", payload, { ...config, headers });
};

export const updatePost = (id, payload, config = {}) => {
  // payload: plain object (JSON) or FormData
  const isForm = typeof FormData !== "undefined" && payload instanceof FormData;
  const headers = {
    ...(config.headers || {}),
    ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
  };
  return postsApi.patch(`/${id}`, payload, { ...config, headers });
};

export const deletePost = (id) => postsApi.delete(`/${id}`);
