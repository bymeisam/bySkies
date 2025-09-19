import { motion } from "framer-motion";
import { styles, motionVariants } from "./animated-background.styles";

const AnimatedBackground = () => {
  return (
    <div className={styles.container}>
      <motion.div
        animate={motionVariants.primaryOrb.animate}
        transition={motionVariants.primaryOrb.transition}
        className={styles.orb({ size: 'large', position: 'top-left', variant: 'blue' })}
      />
      <motion.div
        animate={motionVariants.secondaryOrb.animate}
        transition={motionVariants.secondaryOrb.transition}
        className={styles.orb({ size: 'medium', position: 'bottom-right', variant: 'purple' })}
      />

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          animate={motionVariants.particle(i).animate}
          transition={motionVariants.particle(i).transition}
          className={styles.particle}
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
