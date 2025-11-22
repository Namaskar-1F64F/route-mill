import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");
  redirect(`/profile/${session.user.id}`);
}
