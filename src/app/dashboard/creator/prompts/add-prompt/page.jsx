import { getCurrentUser } from "@/lib/api/users";
import AddPromptForm from "./AddPromptFrom";


export const dynamic = "force-dynamic";

export default async function AddPromptPage() {
  const user = await getCurrentUser();

  return <AddPromptForm user={user} />;
}