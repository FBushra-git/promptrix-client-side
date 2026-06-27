// components/dashboard/StatCard.jsx
import { Card } from '@heroui/react';

export const StatCard = ({ title, value, icon: Icon, className = "" }) => {
  return (
    <Card className={`relative group overflow-hidden bg-[#18181b]/60 backdrop-blur-md border border-white/5 p-1 rounded-3xl ${className}`}>
      {/* Subtle hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Card.Content className="relative z-10 flex flex-col gap-6 p-6">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-purple-400 shadow-inner">
            {Icon && <Icon size={24} />}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Live</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-white/50">{title}</span>
          <span className="text-4xl font-black text-white tracking-tighter mt-1">{value}</span>
        </div>
      </Card.Content>
    </Card>
  );
};