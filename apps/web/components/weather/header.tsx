import { motion } from "framer-motion";
import { styles, motionVariants } from "./header.styles";

const Header = () => {
  return (
    <motion.div variants={motionVariants.item} className={styles.container}>
      <h1 className={styles.title()}>
        <span className={styles.titleGradient}>
          BySkies
        </span>
      </h1>
      <p className={styles.subtitle}>
        Your plans, guided by skies
      </p>
    </motion.div>
  );
};

export default Header;
