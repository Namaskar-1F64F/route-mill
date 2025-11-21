import { getBrowserRoutes } from "@/app/actions";
import { WALLS } from "@/lib/constants/walls";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function WallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wall = WALLS.find((w) => w.id === id);
  
  if (!wall) return notFound();

  const allRoutes = await getBrowserRoutes();
  const wallRoutes = allRoutes.filter((r) => r.wall_id === id);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen overflow-hidden">
      <div className="mb-12 relative z-10">
        <Link href="/gym" className="text-slate-500 hover:text-violet-600 mb-4 inline-flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Gym
        </Link>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{wall.name}</h1>
        <p className="text-slate-500 mt-2 text-lg">{wall.type}</p>
      </div>

      <div className="flex items-end justify-start pb-24 px-12 overflow-x-auto min-h-[500px] pt-12">
        {wallRoutes.map((route, index) => {
          // Angular, interlocking design
          // Use skew to make them lean
          // Use negative margin to overlap/lock
          const heightClass = index % 3 === 0 ? "h-96" : index % 3 === 1 ? "h-[28rem]" : "h-80"; 
          
          return (
            <Link 
              key={route.id} 
              href={`/route/${route.id}`} 
              className="group relative flex-shrink-0 w-24 transition-all duration-300 hover:z-20 -ml-4 first:ml-0 hover:-translate-y-4"
            >
              {/* Angular Body */}
              <div 
                className={cn(
                  "w-full transform -skew-x-12 flex flex-col justify-end relative shadow-lg hover:shadow-2xl transition-all border-r border-white/10 overflow-hidden",
                  heightClass
                )}
                style={{ backgroundColor: route.color.toLowerCase() }}
              >
                {/* Glassy overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 pointer-events-none" />
                
                {/* Shine effect */}
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shimmer" />

                {/* Content at bottom - unskewed */}
                <div className="p-4 text-white transform skew-x-12">
                  <div className="font-black text-3xl mb-1 drop-shadow-md tracking-tighter">
                    {route.difficulty_label || route.grade}
                  </div>
                  {route.difficulty_label && (
                    <div className="text-xs font-bold opacity-80 mb-1">{route.grade}</div>
                  )}
                  
                  <div className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest opacity-80">
                    {route.avg_rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white text-white" />
                        <span>{route.avg_rating.toFixed(1)}</span>
                      </div>
                    )}
                    {route.comment_count > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{route.comment_count}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Status Badge - unskewed */}
                {route.user_status && (
                  <div className="absolute top-4 right-2 transform skew-x-12">
                     <div className="bg-white text-slate-900 text-[10px] font-black px-2 py-1 shadow-sm uppercase tracking-wider">
                      {route.user_status === "FLASH" ? "⚡" : "✓"}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
        {wallRoutes.length === 0 && (
          <div className="w-full text-center py-24 bg-slate-50 border-2 border-dashed border-slate-200 -skew-x-6">
            <p className="text-slate-400 font-medium text-lg transform skew-x-6">No routes on this wall yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
