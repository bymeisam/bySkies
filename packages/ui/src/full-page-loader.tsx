import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface FullPageLoaderProps {
  message?: string;
  className?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  message = "Loading...",
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 ${className}`}
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4 flex justify-center"
        >
          <Loader2 className="w-12 h-12 text-sky-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white"
        >
          <h2 className="text-xl font-semibold mb-2">{message}</h2>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/60 text-sm"
          >
            Please wait...
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};