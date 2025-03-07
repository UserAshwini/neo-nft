"use client";
import { motion } from "framer-motion";

const AnimatedText = ({
  text = "Default Text",
  color = "#39FF14",
  delay = 0.1,
  duration = 0.3,
}) => {
  return (
    <div className="text-6xl acme-font" style={{ color }}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * delay, duration }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedText;
