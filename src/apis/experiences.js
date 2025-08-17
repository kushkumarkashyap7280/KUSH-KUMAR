import axios from "axios";

// Experiences API

const experiencesApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/experiences`,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

export const getPublicExperiences = () => experiencesApi.get("/public");
export const getPublicExperienceById = (id) => experiencesApi.get(`/public/${id}`);
export const listExperiences = () => experiencesApi.get("/");
export const getExperienceById = (id) => experiencesApi.get(`/${id}`);

export const createExperience = (payload, config = {}) => {
  // payload: plain object (JSON) or FormData (when including files: image, logo)
  const isForm = typeof FormData !== "undefined" && payload instanceof FormData;
  const headers = {
    ...(config.headers || {}),
    ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
  };
  return experiencesApi.post("/", payload, { ...config, headers });
};

export const updateExperience = (id, payload, config = {}) => {
  // payload: plain object (JSON) or FormData
  const isForm = typeof FormData !== "undefined" && payload instanceof FormData;
  const headers = {
    ...(config.headers || {}),
    ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
  };
  return experiencesApi.patch(`/${id}`, payload, { ...config, headers });
};

export const deleteExperience = (id) => experiencesApi.delete(`/${id}`);
