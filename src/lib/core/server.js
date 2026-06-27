import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL;

export const authHeader = async () => {
  const token = await getUserToken();

  if (!token) {
    try {
      // Temporary debug log — remove in production
      console.log("[debug] authHeader -> no token available");
    } catch (e) {}
    return {};
  }

  try {
    // Temporary debug log — remove in production
    console.log("[debug] authHeader -> sending Authorization header");
  } catch (e) {}

  return {
    authorization: `Bearer ${token}`,
  };
};

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });

  return handleStatusCode(res);
};

export const protectedFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: await authHeader(),
    cache: "no-store",
  });

  return handleStatusCode(res);
};

export const serverMutation = async (path, data, method = "POST") => {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: data ? JSON.stringify(data) : undefined,
    cache: "no-store",
  });

  return handleStatusCode(res);
};

const handleStatusCode = async (res) => {
  if (res.status === 401 || res.status === 403) {
    redirect("/unauthorized");
  }

  const text = await res.text();
  if (!text) return null;

  return JSON.parse(text);
};