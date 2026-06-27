import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/users";

export const requireAdmin = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }
  console.log(user?.role)
  if (user?.role?.toLowerCase() !== "admin") {
    redirect("/unauthorized");
  }

  return user;
};