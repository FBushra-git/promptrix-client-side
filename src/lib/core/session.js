'use server'
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";


const getServerHeaders = () => {
  const nextHeaders = headers();
  const headerObj = {};

  if (typeof nextHeaders.forEach === "function") {
    nextHeaders.forEach((value, key) => {
      headerObj[key] = value;
    });
    return headerObj;
  }

  if (typeof nextHeaders[Symbol.iterator] === "function") {
    return Object.fromEntries(nextHeaders);
  }

  const keys = typeof nextHeaders.keys === "function" ? nextHeaders.keys() : null;
  if (keys && typeof keys[Symbol.iterator] === "function") {
    for (const key of keys) {
      headerObj[key] = nextHeaders.get(key);
    }
  }

  return headerObj;
};

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: getServerHeaders(),
  });

  return session?.user || null;
};

export const getUserToken = async () => {
  const session = await auth.api.getSession({
    headers: getServerHeaders(),
  });

  const token = session?.session?.token || null;
  try {
    // Temporary debug log — remove in production
    console.log("[debug] getUserToken -> token found:", Boolean(token));
  } catch (e) {}

  return token;
};

export const requireRole = async (role) => {
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/signin");
  }

  return user;
};