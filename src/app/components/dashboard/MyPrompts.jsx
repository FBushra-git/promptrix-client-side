"use client";
import { Card, Chip, Button,  Tooltip } from "@heroui/react";
import { Edit2, Trash2, Cpu, Copy, Eye, EyeOff, Sparkles } from "lucide-react";

export default function MyPrompts({ prompts = [] }) {
    // Handling empty state gracefully
    if (!prompts || prompts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-3xl bg-[#131316]/30">
                <Sparkles className="w-12 h-12 text-purple-500 mb-4 animate-pulse" />
                <h3 className="text-xl font-bold text-white">No Prompts Engineered Yet</h3>
                <p className="text-zinc-500 text-sm">Start creating your first masterpiece to see it here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
                <Card 
                    key={prompt._id} 
                    className="group bg-[#131316]/60 border border-white/5 hover:border-purple-500/30 transition-all duration-500 p-6 rounded-3xl backdrop-blur-md overflow-hidden relative"
                >
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <Chip color="secondary" variant="dot" className="text-[10px] font-bold uppercase tracking-widest bg-purple-950/30 border-purple-500/20">
                            {prompt.category}
                        </Chip>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Tooltip content={prompt.isVisible ? "Visible" : "Hidden"}>
                                <Button isIconOnly size="sm" variant="light" className="text-zinc-400">
                                    {prompt.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                </Button>
                            </Tooltip>
                            <Button isIconOnly size="sm" variant="light" className="text-zinc-400 hover:text-white"><Edit2 size={16}/></Button>
                            <Button isIconOnly size="sm" variant="light" color="danger"><Trash2 size={16} /></Button>
                        </div>
                    </div>

                    <h3 className="text-xl font-black text-white mb-2 line-clamp-1 relative z-10">{prompt.title}</h3>
                    <p className="text-sm text-zinc-500 mb-6 line-clamp-2 h-10 relative z-10 font-medium">{prompt.description}</p>
                    
                    <div className="flex gap-2 mb-4 relative z-10">
                        <Chip size="sm" className="bg-white/5 text-[10px] text-zinc-400 border border-white/5 uppercase font-bold">
                            {prompt.difficulty}
                        </Chip>
                    </div>


                    <div className="flex items-center justify-between text-zinc-400 relative z-10">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                            <Cpu size={14} className="text-purple-400" /> {prompt.aiTool}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                            <Copy size={14} className="text-blue-400" /> {prompt.copyCount}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}