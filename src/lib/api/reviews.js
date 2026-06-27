import { serverFetch } from "../core/server";

export const getReviewsByPrompt = async (promptId) => {
    return serverFetch(`/api/reviews?promptId=${promptId}`);
}

export const getUserReviews = async (userEmail) => {
    return serverFetch(`/api/reviews?email=${userEmail}`);
}

export const getAllReviews = async () => {
  return serverFetch("/api/reviews");
};