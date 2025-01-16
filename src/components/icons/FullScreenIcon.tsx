"use client";

import { motion, useAnimation } from "framer-motion";

const defaultTransition = {
  type: "spring",
  stiffness: 250,
  damping: 25,
};

const FullScreenIcon = () => {
  const controls = useAnimation();

  return (
    <div
      className="flex cursor-pointer select-none items-center justify-center rounded-md p-2 transition-colors duration-200"
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"
          transition={defaultTransition}
          initial="normal"
          variants={{
            normal: { x: 0, y: 0 },
            animate: { x: 2, y: 2 },
          }}
          animate={controls}
        />
        <motion.path
          d="M3 16.2V21m0 0h4.8M3 21l6-6"
          transition={defaultTransition}
          initial="normal"
          variants={{
            normal: { x: 0, y: 0 },
            animate: { x: -2, y: 2 },
          }}
          animate={controls}
        />
        <motion.path
          d="M21 7.8V3m0 0h-4.8M21 3l-6 6"
          transition={defaultTransition}
          initial="normal"
          variants={{
            normal: { x: 0, y: 0 },
            animate: { x: 2, y: -2 },
          }}
          animate={controls}
        />
        <motion.path
          d="M3 7.8V3m0 0h4.8M3 3l6 6"
          transition={defaultTransition}
          initial="normal"
          variants={{
            normal: { x: 0, y: 0 },
            animate: { x: -2, y: -2 },
          }}
          animate={controls}
        />
      </svg>
    </div>
  );
};

export default FullScreenIcon;
