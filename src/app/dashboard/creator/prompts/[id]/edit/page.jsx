import { getPromptById } from "@/lib/api/prompts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import EditPromptForm from "./EditPromptForm";

export default async function EditPromptPage({ params }) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const prompt = await getPromptById(id);

  if (!prompt) {
    redirect("/dashboard/creator/prompts");
  }

  if (prompt.creatorEmail !== session.user.email) {
    redirect("/dashboard/creator/prompts");
  }

  return <EditPromptForm prompt={prompt} user={session.user} />;
}