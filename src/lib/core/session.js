'use server'
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";


export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
};

export const getUserToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
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