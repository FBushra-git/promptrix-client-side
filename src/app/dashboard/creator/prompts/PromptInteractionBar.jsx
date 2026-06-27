"use client";
import { useState } from 'react';
import { Button, Toast } from "@heroui/react";
import { Bookmark, Copy, AlertTriangle } from 'lucide-react';

import { incrementCopyCount, toggleBookmark } from '@/lib/actions/prompts';
import toast from 'react-hot-toast';


export default function PromptInteractionBar({ prompt }) {
  const handleCopy = async () => {
    navigator.clipboard.writeText(prompt.content);
    // Call your server action to increment copy count
    await incrementCopyCount(prompt._id); 
    toast.success("Prompt copied to clipboard!");
  };

  const handleBookmark = async () => {
    await toggleBookmark({ promptId: prompt._id, userId: 'user-id-here' });
    toast.success("Bookmark status updated");
  };

  return (
    <div className="flex gap-4">
      <Button startContent={<Copy size={18}/>} onClick={handleCopy}>Copy</Button>
      <Button startContent={<Bookmark size={18}/>} onClick={handleBookmark} variant="flat">Bookmark</Button>
      <Button startContent={<AlertTriangle size={18}/>} color="danger" variant="light">Report</Button>
    </div>
  );
}