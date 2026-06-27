import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/users";

export const dynamic = "force-dynamic";

export default async function DashboardRedirectPage() {
  const user = await getCurrentUser();

  const role = user?.role?.toLowerCase() || "user";

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  if (role === "creator") {
    redirect("/dashboard/creator");
  }

  redirect("/dashboard/user");
}