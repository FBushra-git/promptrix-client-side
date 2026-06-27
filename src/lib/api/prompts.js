import { serverFetch,protectedFetch } from "../core/server";

export const getPrompts = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== undefined && value !== null
    )
  );

  const query = new URLSearchParams(cleanParams).toString();

  return serverFetch(`/api/prompts${query ? `?${query}` : ""}`);
};

export const getPromptById = async (promptId) => {
  return serverFetch(`/api/prompts/${promptId}`);
};

export const getCreatorPrompts = async (creatorEmail) => {
  return serverFetch(`/api/prompts?creatorEmail=${creatorEmail}`);
};

export const getBookmarkedPrompts = async () => {
  return protectedFetch("/api/bookmarks");
};