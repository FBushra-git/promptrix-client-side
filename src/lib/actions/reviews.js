'use server'

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export const createReview = async (reviewData) => {
    const result = await serverMutation('/api/reviews', reviewData);
    revalidatePath(`/prompt/${reviewData.promptId}`);
    revalidatePath('/dashboard/user/my-reviews');
    return result;
}