import { protectedFetch } from "../core/server";

export const getAdminStats = async () => {
  return protectedFetch("/api/admin/stats");
};

export const getAllUsers = async () => {
  return protectedFetch("/api/users");
};

export const getAllPromptsForAdmin = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== undefined && value !== null
    )
  );

  const query = new URLSearchParams(cleanParams).toString();

  return protectedFetch(`/api/prompts${query ? `?${query}` : ""}`);
};

export const getAllPaymentsForAdmin = async () => {
  return protectedFetch("/api/payments");
};

export const getAllReports = async () => {
  return protectedFetch("/api/reports");
};