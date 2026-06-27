import { protectedFetch } from "../core/server";

export const getCurrentUser = async () => {
  const result = await protectedFetch("/api/me");
  console.log(result.user)
  return result?.user || null;
};

export const getUserByEmail = async (email) => {
  const result = await protectedFetch(`/api/users/${email}`);
  return result || null;
};