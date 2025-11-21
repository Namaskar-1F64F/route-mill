"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { logActivity, savePersonalNote, logAttempt } from "@/app/actions";
import { Send, Zap, MessageSquare, Eye, EyeOff, StickyNote, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ActivityLog = {
  id: string;
  user_id: string;
  user_name: string | null;
  user_image: string | null;
  route_id: string;
  action_type: string;
  content: string | null;
  metadata: { is_beta?: boolean } | null;
  created_at: Date | null;
};

type UserSession = {
  email: string;
  name: string | null;
  image: string | null;
};

export default function RouteActivity({ 
  routeId, 
  initialActivity, 
  initialPersonalNote,
  user 
}: { 
  routeId: string; 
  initialActivity: ActivityLog[];
  initialPersonalNote: string;
  user: UserSession | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [optimisticActivity, addOptimisticActivity] = useOptimistic(
    initialActivity,
    (state, newActivity: ActivityLog) => [newActivity, ...state]
  );
  const [isPending, startTransition] = useTransition();
  const [personalNote, setPersonalNote] = useState(initialPersonalNote);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isBeta, setIsBeta] = useState(false);
  const [revealedBeta, setRevealedBeta] = useState<Set<string>>(new Set());

  async function handleAction(actionType: string, content: string, metadata: { is_beta?: boolean } = {}) {
    if (!user) return;

    const newLog: ActivityLog = {
      id: Math.random().toString(), // Temporary ID
      user_id: user.email,
      user_name: user.name,
      user_image: user.image,
      route_id: routeId,
      action_type: actionType,
      content: content,
      metadata,
      created_at: new Date(),
    };

    startTransition(async () => {
      addOptimisticActivity(newLog);
      
      // Server Action
      await logActivity({
        user_id: user.email,
        user_name: user.name,
        user_image: user.image,
        route_id: routeId,
        action_type: actionType,
        content: content,
        metadata,
      });
    });

    if (actionType === "COMMENT") {
      formRef.current?.reset();
      setIsBeta(false);
    }
  }

  async function handleSaveNote() {
    setIsSavingNote(true);
    await savePersonalNote(routeId, personalNote);
    setIsSavingNote(false);
  }

  async function handleAttempt() {
    if (!user) return;
    await logAttempt(routeId);
  }

  const sends = optimisticActivity.filter(a => a.action_type === "SEND" || a.action_type === "FLASH");
  const comments = optimisticActivity.filter(a => a.action_type === "COMMENT");

  const toggleBeta = (id: string) => {
    const newRevealed = new Set(revealedBeta);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedBeta(newRevealed);
  };

  return (
    <div className="space-y-12">
      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => handleAction("SEND", "Sent it!")}
          disabled={!user || isPending}
          className="h-12 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm"
        >
          <Send className="w-4 h-4" /> Log Send
        </button>

        <button 
          onClick={() => handleAction("FLASH", "Flashed it!")}
          disabled={!user || isPending}
          className="h-12 bg-white border-2 border-black hover:bg-yellow-400 hover:border-yellow-400 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm"
        >
          <Zap className="w-4 h-4" /> Log Flash
        </button>

        <button 
          onClick={handleAttempt}
          disabled={!user || isPending}
          className="h-12 bg-white border-2 border-black hover:bg-slate-200 hover:border-slate-200 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-sm"
        >
          <CheckCircle2 className="w-4 h-4" /> Log Attempt
        </button>
      </div>

      {/* Personal Notes */}
      {user && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-800 flex items-center gap-2">
              <StickyNote className="w-3 h-3" /> Personal Notes
            </h3>
            {isSavingNote && <span className="text-[10px] font-mono text-yellow-600">Saving...</span>}
          </div>
          <textarea
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            onBlur={handleSaveNote}
            placeholder="Add private notes..."
            className="w-full bg-transparent text-slate-800 text-sm focus:outline-none min-h-[80px] resize-y placeholder:text-yellow-700/30"
          />
        </div>
      )}

      {/* Sends Ticker */}
      {sends.length > 0 && (
        <div className="border-y border-slate-200 py-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Recent Sends</h3>
          <div className="flex flex-wrap gap-2">
            {sends.map((log) => (
              <div key={log.id} className="flex items-center gap-2 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700" title={new Date(log.created_at!).toLocaleDateString()}>
                <span>{log.user_name}</span>
                {log.action_type === "FLASH" && <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Stream */}
      <div className="relative">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
          <MessageSquare className="w-3 h-3" /> Activity Log
        </h3>

        {/* Input Area */}
        <div className="mb-10">
          <form 
            ref={formRef}
            action={async (formData) => {
              const content = formData.get("content") as string;
              if (!content) return;
              await handleAction("COMMENT", content, { is_beta: isBeta });
            }} 
          >
            <div className="flex gap-4">
              <input 
                name="content" 
                type="text" 
                placeholder={user ? "Write a comment..." : "Sign in to comment"} 
                className="flex-1 border-b-2 border-slate-200 bg-transparent py-2 text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                required
                disabled={!user}
              />
              <button 
                type="submit" 
                disabled={!user || isPending}
                className="font-bold text-xs uppercase tracking-widest hover:text-violet-600 transition-colors disabled:opacity-50"
              >
                Post
              </button>
            </div>
            {user && (
              <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer mt-2 w-fit hover:text-black transition-colors">
                <input 
                  type="checkbox" 
                  checked={isBeta} 
                  onChange={(e) => setIsBeta(e.target.checked)}
                  className="rounded border-slate-300 text-black focus:ring-0"
                />
                <span>Contains Beta</span>
              </label>
            )}
          </form>
        </div>

        {/* Stream Items */}
        <div className="space-y-8 pl-4 border-l-2 border-slate-100">
          {comments.map((log) => {
            const isHidden = log.metadata?.is_beta && !revealedBeta.has(log.id);
            
            return (
              <div key={log.id} className="relative pl-6 animate-in fade-in slide-in-from-left-2 duration-300">
                {/* Timeline Dot */}
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-slate-300 rounded-full ring-4 ring-white" />

                <div className="flex items-baseline gap-3 mb-1">
                  <Link href={`/profile/${encodeURIComponent(log.user_id)}`} className="font-bold text-sm hover:underline">
                    {log.user_name || "Unknown"}
                  </Link>
                  <span className="text-xs text-slate-400">
                    {log.created_at ? new Date(log.created_at).toLocaleDateString() : "Just now"}
                  </span>
                  {log.metadata?.is_beta && (
                    <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">BETA</span>
                  )}
                </div>
                
                <div className="text-sm text-slate-600 leading-relaxed">
                  {isHidden ? (
                    <button 
                      onClick={() => toggleBeta(log.id)}
                      className="flex items-center gap-2 text-slate-400 hover:text-black transition-colors italic"
                    >
                      <EyeOff className="w-3 h-3" />
                      <span>Spoiler hidden. Click to reveal.</span>
                    </button>
                  ) : (
                    <div className="relative group">
                      <p>{log.content}</p>
                      {log.metadata?.is_beta && (
                        <button 
                          onClick={() => toggleBeta(log.id)}
                          className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-black"
                          title="Hide beta"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {comments.length === 0 && (
            <div className="pl-6">
               <p className="text-slate-400 text-sm italic">No activity logged yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
