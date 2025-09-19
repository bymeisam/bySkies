"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode;
}

interface WeatherTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function WeatherTabs({ tabs, defaultTab, className = "" }: WeatherTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
              ${activeTab === tab.id
                ? "text-white bg-white/10 shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/5"
              }
            `}
          >
            {/* Active tab background */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-blue-600/20 rounded-xl border border-sky-400/30"
                transition={{
                  type: "spring",
                  bounce: 0.15,
                  duration: 0.5
                }}
              />
            )}

            {/* Tab content */}
            <span className="relative text-lg">{tab.icon}</span>
            <span className="relative hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="min-h-[400px]"
      >
        {activeTabContent}
      </motion.div>
    </div>
  );
}