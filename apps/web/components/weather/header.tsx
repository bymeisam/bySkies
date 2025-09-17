import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};
const Header = () => {
  return (
    <motion.div variants={itemVariants} className="text-center mb-12">
      <h1 className="text-5xl md:text-7xl font-bold mb-4">
        <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
          BySkies
        </span>
      </h1>
      <p className="text-xl text-white/80 font-medium">
        Your plans, guided by skies
      </p>
    </motion.div>
  );
};

export default Header;
