"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export const changeUserRole = async (email, role) => {
  const result = await serverMutation(`/api/users/${email}/role`, { role }, "PATCH");
  revalidatePath("/dashboard/admin/users");
  return result;
};

export const deleteUserByEmail = async (email) => {
  const result = await serverMutation(`/api/admin/users/${email}`, null, "DELETE");
  revalidatePath("/dashboard/admin/users");
  return result;
};

export const updatePromptStatus = async (id, data) => {
  const result = await serverMutation(`/api/admin/prompts/${id}/status`, data, "PATCH");
  revalidatePath("/dashboard/admin/prompts");
  revalidatePath("/prompts");
  revalidatePath("/");
  return result;
};

export const toggleFeaturePrompt = async (id, featured) => {
  const result = await serverMutation(`/api/admin/prompts/${id}/feature`, { featured }, "PATCH");
  revalidatePath("/dashboard/admin/prompts");
  revalidatePath("/");
  return result;
};

export const deletePromptByAdmin = async (id) => {
  const result = await serverMutation(`/api/admin/prompts/${id}`, null, "DELETE");
  revalidatePath("/dashboard/admin/prompts");
  revalidatePath("/prompts");
  return result;
};

export const updateReportStatus = async (id, data) => {
  const result = await serverMutation(`/api/admin/reports/${id}`, data, "PATCH");
  revalidatePath("/dashboard/admin/reports");
  return result;
};