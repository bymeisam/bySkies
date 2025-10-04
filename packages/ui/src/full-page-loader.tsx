import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { styles, motionVariants } from "./full-page-loader.styles";

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
      initial={motionVariants.container.initial}
      animate={motionVariants.container.animate}
      exit={motionVariants.container.exit}
      className={styles.container({ className })}
    >
      <div className={styles.content}>
        <motion.div
          animate={motionVariants.loader.animate}
          transition={motionVariants.loader.transition}
          className={styles.loaderContainer}
        >
          <Loader2 className={styles.loaderIcon} />
        </motion.div>

        <motion.div
          initial={motionVariants.text.initial}
          animate={motionVariants.text.animate}
          transition={motionVariants.text.transition}
          className={styles.textContainer}
        >
          <h2 className={styles.message}>{message}</h2>
          <motion.div
            animate={motionVariants.pulse.animate}
            transition={motionVariants.pulse.transition}
            className={styles.subMessage}
          >
            Please wait...
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};