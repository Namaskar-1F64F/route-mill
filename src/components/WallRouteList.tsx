"use client";

import { BrowserRoute } from "@/app/actions";
import Link from "next/link";
import { Star, MessageSquare, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function WallRouteList({ routes }: { routes: BrowserRoute[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden perspective-1000">
      <div className="h-full flex items-center px-32 min-w-max pb-24 pt-8">
        {routes.map((route) => {
          const isExpanded = hoveredId === route.id;

          return (
            <div
              key={route.id}
              className={cn(
                "group relative h-[60vh] md:h-[70vh] transition-all duration-500 ease-out -ml-4 first:ml-12",
                isExpanded ? "z-50 -ml-0 mr-4" : "hover:z-50 hover:-ml-0 hover:mr-4"
              )}
              onMouseEnter={() => setHoveredId(route.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setHoveredId(route.id)}
            >
              <Link
                href={`/route/${route.id}`}
                className={cn(
                  "block h-full focus:outline-none",
                  !isExpanded && "pointer-events-none"
                )}
              >
                {/* The Shard */}
                <div
                  className={cn(
                    "h-full w-20 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] relative overflow-hidden shadow-2xl",
                    "transform -skew-x-12 border-r border-white/20",
                    isExpanded ? "w-[30rem]" : "group-hover:w-[30rem]"
                  )}
                  style={{ backgroundColor: route.color.toLowerCase() }}
                >
                  {/* Background Texture */}
                  <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                  {/* Status Indicator (Top Edge) */}
                  {route.user_status && (
                    <div
                      className={cn(
                        "absolute top-0 left-0 right-0 h-2 z-20",
                        route.user_status === "FLASH"
                          ? "bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]"
                          : "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                      )}
                    />
                  )}

                  {/* Content Container */}
                  <div className="absolute inset-0 p-4 text-white">
                    {/* Collapsed State: Vertical Slanted Text */}
                    <div
                      className={cn(
                        "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                        isExpanded ? "opacity-0" : "opacity-100"
                      )}
                    >
                      <div className="transform -rotate-90 whitespace-nowrap origin-center">
                        <span className="text-5xl font-black tracking-tighter uppercase drop-shadow-md block">
                          {route.difficulty_label || route.grade}
                        </span>
                      </div>
                    </div>

                    {/* Expanded State: Horizontal Layout */}
                    <div
                      className={cn(
                        "transition-all duration-500 delay-100 flex flex-col h-full relative z-10 transform skew-x-12 origin-left pl-16 pr-4",
                        isExpanded ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start border-b border-white/20 pb-4 mb-4">
                        <div className="min-w-0 flex-1 mr-4">
                          <h2 className="text-6xl font-black tracking-tighter leading-none drop-shadow-xl truncate">
                            {route.difficulty_label || route.grade}
                          </h2>
                          {route.difficulty_label && (
                            <div className="text-sm font-mono opacity-80 mt-1">
                              Grade: {route.grade}
                            </div>
                          )}
                        </div>
                        {route.user_status && (
                          <div className="bg-white text-black font-black px-2 py-1 text-xs uppercase tracking-wider flex-shrink-0">
                            {route.user_status}
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">
                            Rating
                          </div>
                          <div className="flex items-center gap-1 text-3xl font-bold">
                            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                            {route.avg_rating > 0
                              ? route.avg_rating.toFixed(1)
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">
                            Comments
                          </div>
                          <div className="flex items-center gap-1 text-3xl font-bold">
                            <MessageSquare className="w-6 h-6" />
                            {route.comment_count}
                          </div>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="mt-auto space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded border border-white/10">
                          <User className="w-5 h-5 opacity-70" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] uppercase tracking-widest opacity-50">
                              Setter
                            </span>
                            <span className="text-sm font-bold truncate">
                              {route.setter_name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-black/20 rounded border border-white/10">
                          <Calendar className="w-5 h-5 opacity-70" />
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest opacity-50">
                              Set Date
                            </span>
                            <span className="text-sm font-bold">
                              {new Date(route.set_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}

        {/* Empty State */}
        {routes.length === 0 && (
          <div className="h-[60vh] w-64 flex items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50/50 transform -skew-x-12 ml-12">
            <div className="transform skew-x-12 text-center">
              <p className="text-slate-400 font-black uppercase tracking-widest">
                No Routes
              </p>
              <p className="text-xs text-slate-400 font-mono mt-1">
                // Awaiting Setter Action
              </p>
            </div>
          </div>
        )}

        <div className="w-32 flex-shrink-0" />
      </div>
    </div>
  );
}
