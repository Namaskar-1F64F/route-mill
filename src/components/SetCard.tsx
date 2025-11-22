import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface SetCardProps {
  wallName: string;
  routeCount: number;
  date?: string;
  colors?: string[];
  wallId?: string;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  "Red": "bg-red-500",
  "Blue": "bg-blue-500",
  "Green": "bg-green-500",
  "Yellow": "bg-yellow-500",
  "Black": "bg-black",
  "White": "bg-white",
  "Purple": "bg-purple-500",
  "Orange": "bg-orange-500",
  "Pink": "bg-pink-500",
};

export function SetCard({ wallName, routeCount, date, colors = [], wallId, className }: SetCardProps) {
  const isNew = date && (new Date().getTime() - new Date(date).getTime()) < 1000 * 60 * 60 * 24 * 7; // 7 days

  const Content = (
    <Card className={cn("p-4 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-300 group", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-black uppercase tracking-tighter text-lg">{wallName}</div>
        {isNew && (
          <div className="text-xs font-mono bg-rockmill px-2 py-0.5 text-white transform -skew-x-12">
            <span className="transform skew-x-12 block">FRESH</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm font-mono text-slate-500">
          <span>{date ? new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "No Date"}</span>
          <span className="font-bold text-black">{routeCount} Routes</span>
        </div>
        
        <div className="flex gap-1 justify-end h-3">
          {colors.slice(0, 5).map((colorName, i) => (
             <div 
               key={i} 
               className={cn(
                 "h-3 w-3 rounded-full border border-slate-200 shadow-sm transition-all duration-500 group-hover:w-4", 
                 COLOR_MAP[colorName] || "bg-gray-400"
               )} 
             />
          ))}
        </div>
      </div>
    </Card>
  );

  if (wallId) {
    return <Link href={`/sets/${wallId}`} className="block">{Content}</Link>;
  }

  return Content;
}
