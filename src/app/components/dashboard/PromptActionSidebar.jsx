"use client";
import {  incrementCopyCount, submitReport, toggleBookmark } from "@/lib/actions/prompts";
import { Button, Divider } from "@heroui/react";

import { Bookmark, Copy, AlertTriangle } from 'lucide-react';
import toast from "react-hot-toast";

export  default  function PromptActionSidebar({ prompt, isLocked }) {
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);
    await incrementCopyCount(prompt._id); // Calls your server action
    toast.success("Copied to clipboard and count updated!");
  };

  const handleBookmark = async () => {
    // Pass the required data to your server action
    await toggleBookmark({ promptId: prompt._id, userId: 'user-id-here' });
    toast.success("Bookmark status toggled");
  };

  const handleReport = async (reason) => {
    await submitReport({ promptId: prompt._id, reason });
    toast.success("Report submitted");
  };

  return (
    <div className="sticky top-24 bg-zinc-900 p-6 rounded-3xl border border-white/10 space-y-6">
      <div className="text-4xl font-black">${prompt.price || "2.99"}</div>
      
      {isLocked ? (
        <Button color="primary" size="lg" className="w-full" onClick={() => window.location.href='/premium'}>
          Subscribe to Premium
        </Button>
      ) : (
        <div className="flex gap-2">
            <Button  className="flex-1 btn-gradient" onClick={handleCopy}>Copy Prompt</Button>
            <Button isIconOnly variant="flat" onClick={handleBookmark}><Bookmark /></Button>
        </div>
      )}

      <div className="space-y-4 text-sm text-zinc-400">
        <div className="flex justify-between"><span>Tool:</span> <span>{prompt.aiTool}</span></div>
        <div className="flex justify-between"><span>Difficulty:</span> <span>{prompt.difficulty}</span></div>
        <div className="flex justify-between"><span>Copies:</span> <span>{prompt.copyCount}</span></div>
      </div>
      
      <Button variant="light" color="danger" size="sm" onClick={handleReport} startContent={<AlertTriangle size={16}/>}>
        Report Prompt
      </Button>
    </div>
  );
}