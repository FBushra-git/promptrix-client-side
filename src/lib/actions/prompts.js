"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export const createPrompt = async (newPromptData) => {
  const result = await serverMutation("/api/prompts", newPromptData, "POST");
  revalidatePath("/");
  revalidatePath("/prompts");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/creator/prompts");
  return result;
};

export const updatePrompt = async (id, data) => {
  const result = await serverMutation(`/api/prompts/${id}`, data, "PATCH");
  revalidatePath("/");
  revalidatePath("/prompts");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/creator/prompts");
  revalidatePath(`/dashboard/creator/prompts/${id}`);
   revalidatePath(`/dashboard/creator/prompts/${id}/edit`);

  return result;
};

export const deletePrompt = async (id) => {
  const result = await serverMutation(`/api/prompts/${id}`, null, "DELETE");
  revalidatePath("/");
  revalidatePath("/prompts");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/creator/prompts");
  return result;
};

export const toggleBookmark = async (bookmarkData) => {
  const result = await serverMutation("/api/bookmarks/toggle", bookmarkData);
  revalidatePath("/dashboard/user/saved-prompts");
  return result;
};
export const incrementCopyCount = async (id) => {
  const result = await serverMutation(
    `/api/prompts/${id}/increment-copy`,
    {},
    "PATCH",
  );
  revalidatePath(`/dashboard/creator/prompts/${id}`);
  revalidatePath("/dashboard/creator/prompts");
  revalidatePath("/prompts");
  revalidatePath("/");
  return result;
};

export const submitReport = async (reportData) => {
  const result = await serverMutation("/api/reports", reportData, "POST");
  return result;
};
