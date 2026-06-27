import { protectedFetch } from "../core/server";

export const getAllPayments = async () => {
  return protectedFetch("/api/payments");
};

export const getPaymentHistory = async (email) => {
  return protectedFetch(`/api/payments?email=${email}`);
};