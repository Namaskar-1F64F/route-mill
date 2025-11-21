import { getUserActivity } from "@/app/actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import GradeDistribution from "@/components/GradeDistribution";
import ProfileStats from "@/components/ProfileStats";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");
  redirect(`/profile/${session.user.id}`);
}
