import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.15, 0.05],
          rotate: [360, 270, 180, 90, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"
      />

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
          className={`absolute w-2 h-2 bg-white/20 rounded-full blur-sm`}
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
