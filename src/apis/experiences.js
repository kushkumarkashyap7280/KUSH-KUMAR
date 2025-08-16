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

export const createExperience = (payload) => {
  // payload: plain object (JSON) or FormData (when including files: image, logo)
  return experiencesApi.post("/", payload);
};

export const updateExperience = (id, payload) => {
  // payload: plain object (JSON) or FormData
  return experiencesApi.patch(`/${id}`, payload);
};

export const deleteExperience = (id) => experiencesApi.delete(`/${id}`);
