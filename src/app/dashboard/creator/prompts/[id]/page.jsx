import { getPromptById } from "@/lib/api/prompts";
import { getReviewsByPrompt } from "@/lib/api/reviews";
import { getUserByEmail } from "@/lib/api/users";
import PromptDetailsClient from "@/app/components/dashboard/PromptDetailsClient";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PromptDetailsPage({ params }) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const prompt = await getPromptById(id);
  const dbUser = await getUserByEmail(session.user.email);

  let reviews = [];

  try {
    const reviewsResult = await getReviewsByPrompt(id);
    reviews = Array.isArray(reviewsResult)
      ? reviewsResult
      : reviewsResult?.reviews || [];
  } catch (error) {
    console.error("Failed to load reviews:", error);
    reviews = [];
  }

  return (
    <PromptDetailsClient
      prompt={prompt}
      reviews={reviews}
      user={{
        ...session.user,
        ...dbUser,
      }}
    />
  );
}