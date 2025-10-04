"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { styles, motionVariants } from "./weather-tabs.styles";

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
    <div className={`${styles.container} ${className}`}>
      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={styles.tabButton({ isActive: activeTab === tab.id })}
          >
            {/* Active tab background */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className={styles.activeTabBackground}
                transition={motionVariants.activeTabBackground.transition}
              />
            )}

            {/* Tab content */}
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={motionVariants.tabContent.initial}
        animate={motionVariants.tabContent.animate}
        transition={motionVariants.tabContent.transition}
        className={styles.tabContent}
      >
        {activeTabContent}
      </motion.div>
    </div>
  );
}