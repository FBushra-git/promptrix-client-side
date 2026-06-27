import React from 'react';
import { StatCard } from './StatCard';

export const DashboardStats = ({ statsData = [] }) => {
    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* 
               Grid Upgrade: 
               - Increased gap-6 for a cleaner, modern look. 
               - Added responsive layout: 1 col mobile, 2 col tablet, 4 col desktop.
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat, index) => (
                    <div 
                        key={stat.id || index} 
                        className="transition-transform duration-300 hover:-translate-y-1"
                    >
                        <StatCard
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            // Added glassmorphism class to the card container
                            className="bg-white/[0.02] backdrop-blur-md border-white/5"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};