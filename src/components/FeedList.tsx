import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Check, Zap, Star, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RouteBadge } from "@/components/RouteBadge";

// Define the type based on what getGlobalActivity returns
type ActivityItem = {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_image: string | null;
  action_type: string;
  content: string | null;
  created_at: Date | null;
  route_grade: string | null;
  route_color: string | null;
  route_label: string | null;
  route_id: string | null;
  wall_id: string | null;
  setter_name: string | null;
  set_date: string | null;
};

export default function FeedList({ activity }: { activity: ActivityItem[] }) {
  return (
    <div className="space-y-4">
      {activity.map((item) => (
        <Card key={item.id} className="p-5 flex gap-4 items-start">
          <Link href={`/profile/${item.user_id}`} className="flex-shrink-0">
            <div className="w-10 h-10 bg-slate-200 border-2 border-black transform -skew-x-6 flex items-center justify-center overflow-hidden">
              {item.user_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.user_image} alt={item.user_name || "User"} className="w-full h-full object-cover transform skew-x-6 scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold transform skew-x-6">
                  {item.user_name?.[0] || "?"}
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <p className="text-sm font-bold text-slate-900">
                  <Link href={`/profile/${item.user_id}`} className="hover:text-violet-600 transition-colors">
                    {item.user_name?.split(' ')[0] || "Someone"}
                  </Link>
                </p>
                <p className="text-xs text-slate-500">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                </p>
              </div>

              {item.route_id && (
                <div className="flex flex-col items-end gap-1">
                  <Link href={`/route/${item.route_id}`}>
                    <RouteBadge
                      route={{
                        id: item.route_id,
                        grade: item.route_grade || "?",
                        difficulty_label: item.route_label,
                        color: item.route_color || "gray",
                        wall_id: item.wall_id || "unknown",
                        setter_name: item.setter_name || "Unknown",
                        set_date: item.set_date || new Date().toISOString(),
                      }}
                      className="scale-90 origin-right"
                    />
                  </Link>
                  <Link
                    href={`/route/${item.route_id}`}
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-black transition-colors flex items-center gap-1"
                  >
                    View Route &rarr;
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                {item.action_type === "SEND" && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                    <Check className="w-3 h-3 mr-1" /> Sent
                  </Badge>
                )}
                {item.action_type === "FLASH" && (
                  <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-100">
                    <Zap className="w-3 h-3 mr-1" /> Flashed
                  </Badge>
                )}
                {item.action_type === "ATTEMPT" && (
                  <Badge variant="secondary" className="bg-slate-50 text-slate-700 border-slate-100">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Attempted
                  </Badge>
                )}
                {item.action_type === "COMMENT" && (
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Commented</span>
                )}
                {item.action_type === "RATING" && (
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rated</span>
                )}
              </div>

              {item.content && (
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {item.action_type === "RATING" ? (
                    <div className="flex items-center gap-1 text-yellow-600 font-bold">
                      {item.content} <Star className="w-4 h-4 fill-current" />
                    </div>
                  ) : (
                    <div className="text-slate-500 italic">&quot;{item.content}&quot;</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
      {activity.length === 0 && (
        <div className="text-center py-12 text-slate-400">No recent activity. Go climb something!</div>
      )}
    </div>
  );
}
