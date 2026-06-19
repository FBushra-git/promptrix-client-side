"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const categories = [
  { name: "Urban Streetwear", image: "/img13.png", trend: true },
  { name: "Cyberpunk Icons", image: "/image5.png", trend: false },
  { name: "Vibrant Vector", image: "/image12.png", trend: true },
  { name: "Aggressive Beast", image: "/image1.png", trend: false },
];

export default function TrendingCategories() {
  return (
    <section className="py-24  overflow-hidden border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-4xl font-extrabold uppercase tracking-widest italic">
          Trending <span className="text-purple-500">Archives</span>
        </h2>
      </div>

      {/* Marquee Container */}
      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex gap-6"
          initial={{ x: 0 }}
          animate={{ x: "-50%" }} // Moves exactly half the width of the duplicated content
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {/* We render the list twice to create the infinite loop */}
          {[...categories, ...categories].map((cat, index) => (
            <div key={index} className="flex-shrink-0 w-[280px]">
              <motion.div
                whileHover={{ y: -10 }}
                className={`relative aspect-[3/4] rounded-sm overflow-hidden ${
                  cat.trend ? "lightning-border" : "border border-white/10"
                }`}
              >
                <div className="relative h-full w-full bg-white/5 backdrop-blur-md z-10">
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className="object-cover opacity-60 hover:opacity-100 transition-opacity duration-500" 
                  />
                  
                  {/* Scanline Effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />

                  {/* Content */}
                  <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                    {cat.trend && (
                      <span className="text-[10px] font-bold text-black bg-purple-500 px-3 py-1 mb-3 inline-block uppercase tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                        Live Trend
                      </span>
                    )}
                    <h3 className="text-xl font-bold uppercase italic tracking-tighter">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}