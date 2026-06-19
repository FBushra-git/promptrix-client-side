"use client";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
        
        {/* LEFT: Sliding Image with Lightning Border */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          // Using the class defined in globals.css
          className="lightning-border h-[500px] w-full shadow-2xl"
        >
          {/* Inner container to hold image and preserve rounded corners */}
          <div className="relative h-full w-full rounded-[1.2rem] overflow-hidden z-10">
            <img 
              src="/ChooseSection.png" 
              alt="Promptrix Platform Benefits" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/60 to-transparent" />
          </div>
        </motion.div>

        {/* RIGHT: Sliding Text */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <h3 className=" text-4xl md:text-5xl text-white font-semibold uppercase tracking-widest italic text-sm mb-2">
            Why Choose Us
          </h3>
          <h2 className="text-3xl font-bold italic text-purple-500 mb-8 leading-tight">
            Built for Precision, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
              Curated for Quality.
            </span>
          </h2>
          
          <div className="space-y-8">
            <div className="group">
              <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">Production Ready</h4>
              <p className="text-gray-400 leading-relaxed">Every prompt is thoroughly checked, curated, and optimized to run flawlessly on target engines without tweaking.</p>
            </div>
            
            <div className="group">
              <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">Admin Moderation</h4>
              <p className="text-gray-400 leading-relaxed">No spam or garbage templates. Our administrators approve prompts manually to guarantee the highest community quality.</p>
            </div>
            
            <div className="group">
              <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">Premium Marketplace</h4>
              <p className="text-gray-400 leading-relaxed">Support prompt engineers directly. Access private expert prompts with a single-click lifetime subscription upgrade.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}