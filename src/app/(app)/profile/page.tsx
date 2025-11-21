import { getUserActivity } from "@/app/actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import GradeDistribution from "@/components/GradeDistribution";
import ProfileStats from "@/components/ProfileStats";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/api/auth/signin");

  const activity = await getUserActivity(session.user.email);

  const stats = {
    sends: activity.filter(a => a.action_type === "SEND").length,
    flashes: activity.filter(a => a.action_type === "FLASH").length,
    comments: activity.filter(a => a.action_type === "COMMENT").length,
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-6 mb-8">
        {session.user.image ? (
          <img src={session.user.image} alt={session.user.name || "User"} className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-3xl shadow-md">
            {session.user.name?.[0] || "?"}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{session.user.name}</h1>
          <p className="text-gray-500">{session.user.email}</p>
        </div>
      </div>

      <ProfileStats activity={activity} />
    </div>
  );
}
