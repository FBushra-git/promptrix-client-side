"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function ProPromptLab() {
  const [activeTab, setActiveTab] = useState("Streetwear");
  const [input, setInput] = useState("A futuristic jacket");
  const [copied, setCopied] = useState(false);

  const inspirations = {
    Streetwear: "A futuristic jacket",
    Cyberpunk: "A neon-lit Tokyo street",
    Minimalist: "A sleek modern chair",
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setInput(inspirations[tab]);
  };

  const getEngineeredPrompt = (text) => {
    return `[MASTER_PROMPT]: High-end concept art of ${text}, hyper-realistic, cinematic volumetric lighting, 8k resolution, intricate details, photorealistic textures, professional color grading, shot on 35mm lens.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getEngineeredPrompt(input));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-24 min-h-[600px] text-white overflow-hidden flex items-center">
      {/* BACKGROUND IMAGE */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/lab_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
        {/* Header with Neon Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Prompt Engine Lab</h2>
            <p className="text-gray-400">Select a style or input your own concept.</p>
          </div>
          
          <div className="flex gap-2 p-1 bg-[#0a0a0c]/50 rounded-full border border-white/10">
            {Object.keys(inspirations).map((tab) => (
              <button 
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeTab === tab 
                    ? "bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] text-white shadow-[0_0_15px_rgba(150,123,182,0.6)] border border-[#967bb6]/50" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Functional Lab UI */}
        <div className="grid md:grid-cols-2 gap-8 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm">
          {/* USER INPUT */}
          <div className="space-y-4">
            <label className="text-xs uppercase text-gray-400">1. Describe your idea</label>
            <textarea 
              className="w-full h-40 p-4  rounded-xl border border-white/10 text-white focus:border-[#967bb6] outline-none transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* AI OUTPUT */}
          <div className="space-y-4">
            <label className="text-xs uppercase text-[#967bb6]">2. Engineered Result</label>
            <div className="relative h-40 p-4 bg-purple-900/10 rounded-xl border border-[#967bb6]/20 text-purple-100 font-mono text-sm overflow-auto">
              {getEngineeredPrompt(input)}
              
              <button 
                onClick={handleCopy}
                className="absolute bottom-4 right-4 p-2 bg-gradient-to-r from-[#1a1a2e] to-[#967bb6] shadow-[0_0_10px_rgba(150,123,182,0.4)] rounded-lg hover:opacity-90 transition-all"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}