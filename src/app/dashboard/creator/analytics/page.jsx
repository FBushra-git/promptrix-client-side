import { getCurrentUser } from "@/lib/api/users";
import { getPrompts } from "@/lib/api/prompts";
import { protectedFetch, serverFetch } from "@/lib/core/server";
import CreatorAnalyticsClient from "./CreatorAnalyticsClient";


export const dynamic = "force-dynamic";

export default async function CreatorAnalyticsPage() {
  const user = await getCurrentUser();

  const [promptsData, bookmarksData, reviewsData] = await Promise.all([
    getPrompts({ creatorEmail: user.email }),
    protectedFetch("/api/bookmarks"),
    serverFetch("/api/reviews"),
  ]);

  return (
    <CreatorAnalyticsClient
      user={user}
      prompts={promptsData?.prompts || []}
      bookmarks={Array.isArray(bookmarksData) ? bookmarksData : []}
      reviews={Array.isArray(reviewsData) ? reviewsData : []}
    />
  );
}