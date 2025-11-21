"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { logActivity, savePersonalNote, logAttempt } from "@/app/actions";
import { Send, Zap, MessageSquare, Eye, EyeOff, StickyNote, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
    // Optimistic update not strictly necessary for attempt count unless we show it immediately, 
    // but we can show a toast or just rely on revalidation.
    // For now, just call the action.
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
    <div className="space-y-8">
      {/* Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => handleAction("SEND", "Sent it!")}
          disabled={!user || isPending}
          className="flex flex-col items-center justify-center gap-1 bg-green-50 text-green-700 border border-green-200 py-3 rounded-xl font-bold hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" /> 
          <span className="text-xs">Log Send</span>
        </button>

        <button 
          onClick={() => handleAction("FLASH", "Flashed it!")}
          disabled={!user || isPending}
          className="flex flex-col items-center justify-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-200 py-3 rounded-xl font-bold hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-5 h-5" /> 
          <span className="text-xs">Log Flash</span>
        </button>

        <button 
          onClick={handleAttempt}
          disabled={!user || isPending}
          className="flex flex-col items-center justify-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-5 h-5" /> 
          <span className="text-xs">Log Attempt</span>
        </button>
      </div>

      {/* Personal Notes */}
      {user && (
        <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-yellow-800 flex items-center gap-2">
              <StickyNote className="w-4 h-4" /> Personal Notes
            </h3>
            {isSavingNote && <span className="text-xs text-yellow-600 animate-pulse">Saving...</span>}
          </div>
          <textarea
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            onBlur={handleSaveNote}
            placeholder="Add private notes about beta, attempts, etc..."
            className="w-full bg-white border border-yellow-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[80px] resize-y"
          />
        </div>
      )}

      {/* Sends List */}
      {sends.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Sends</h3>
          <div className="flex flex-wrap gap-2">
            {sends.map((log) => (
              <div key={log.id} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100" title={new Date(log.created_at!).toLocaleDateString()}>
                {log.user_image ? (
                  <img src={log.user_image} alt={log.user_name || "User"} className="w-5 h-5 rounded-full" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {log.user_name?.[0] || "?"}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700">{log.user_name}</span>
                {log.action_type === "FLASH" && <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Comments
        </h3>

        <form 
          ref={formRef}
          action={async (formData) => {
            const content = formData.get("content") as string;
            if (!content) return;
            await handleAction("COMMENT", content, { is_beta: isBeta });
          }} 
          className="mb-8"
        >
          <div className="flex gap-2 mb-2">
            <input 
              name="content" 
              type="text" 
              placeholder={user ? "Add a comment..." : "Sign in to comment"} 
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100"
              required
              disabled={!user}
            />
            <button 
              type="submit" 
              disabled={!user || isPending}
              className="bg-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
          {user && (
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer w-fit">
              <input 
                type="checkbox" 
                checked={isBeta} 
                onChange={(e) => setIsBeta(e.target.checked)}
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <span>Contains Beta (Spoiler)</span>
            </label>
          )}
        </form>

        <div className="space-y-6">
          {comments.map((log) => {
            const isHidden = log.metadata?.is_beta && !revealedBeta.has(log.id);
            
            return (
              <div key={log.id} className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {log.user_image ? (
                  <img src={log.user_image} alt={log.user_name || "User"} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {log.user_name?.[0] || "?"}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/profile/${encodeURIComponent(log.user_id)}`} className="font-bold text-gray-900 hover:underline">
                      {log.user_name || "Unknown Climber"}
                    </Link>
                    <span className="text-xs text-gray-500">
                      • {log.created_at ? new Date(log.created_at).toLocaleDateString() : "Just now"}
                    </span>
                    {log.metadata?.is_beta && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">BETA</span>
                    )}
                  </div>
                  
                  <div className="text-gray-800">
                    {isHidden ? (
                      <button 
                        onClick={() => toggleBeta(log.id)}
                        className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-2 rounded-lg text-sm hover:bg-slate-100 transition-colors w-full text-left"
                      >
                        <EyeOff className="w-4 h-4" />
                        <span>Spoiler: Click to reveal beta</span>
                      </button>
                    ) : (
                      <div className="relative group">
                        <p>{log.content}</p>
                        {log.metadata?.is_beta && (
                          <button 
                            onClick={() => toggleBeta(log.id)}
                            className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
                            title="Hide beta"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {comments.length === 0 && (
            <p className="text-gray-500 italic text-center py-4 text-sm">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
