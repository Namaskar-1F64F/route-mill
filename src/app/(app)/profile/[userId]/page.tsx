import { getUserActivity } from "@/app/actions";
import Link from "next/link";
import GradeDistribution from "@/components/GradeDistribution";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileStats from "@/components/ProfileStats";

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const { userId } = await params;
  const decodedUserId = decodeURIComponent(userId);
  const activity = await getUserActivity(decodedUserId);

  if (activity.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h1>
        <p className="text-gray-500">This user has no public activity.</p>
      </div>
    );
  }

  const user = {
    name: activity[0].user_name || "Unknown Climber",
    image: activity[0].user_image,
    email: activity[0].user_id,
  };

  const stats = {
    sends: activity.filter(a => a.action_type === "SEND").length,
    flashes: activity.filter(a => a.action_type === "FLASH").length,
    comments: activity.filter(a => a.action_type === "COMMENT").length,
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-6 mb-8">
        {user.image ? (
          <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-3xl shadow-md">
            {user.name[0]}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500">Climber</p>
        </div>
      </div>

      <ProfileStats activity={activity} />
    </div>
  );
}
