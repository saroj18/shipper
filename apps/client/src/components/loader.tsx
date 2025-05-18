
import { motion } from "framer-motion";

interface AnimatedLoaderProps {
  size?: number;
  speed?: number;
  showText?: boolean;
}

const Loader=({
  size = 300,
  speed = 3,
  showText = true,
}: AnimatedLoaderProps) =>{
  const duration = 2 / speed;

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <motion.svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: duration * 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <motion.path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="url(#mern-gradient)"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ opacity: 0.8, y: 0 }}
            animate={{
              opacity: [0.8, 1, 0.8],
              y: [0, -1, 0],
            }}
            transition={{
              duration: duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.path
            d="M2 12L12 17L22 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            initial={{ y: 0 }}
            animate={{
              y: [0, 1, 0],
              strokeWidth: [1.5, 2, 1.5],
            }}
            transition={{
              duration: duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: duration / 3,
            }}
          />

          <motion.path
            d="M2 17L12 22L22 17"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            initial={{ y: 0 }}
            animate={{
              y: [0, 1, 0],
              strokeWidth: [1.5, 2, 1.5],
            }}
            transition={{
              duration: duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: duration / 1.5,
            }}
          />

          <defs>
            <linearGradient
              id="mern-gradient"
              x1="2"
              y1="7"
              x2="22"
              y2="7"
              gradientUnits="userSpaceOnUse"
            >
              <motion.stop
                offset="0"
                stopColor="#00ED64"
                animate={{
                  stopOpacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: duration * 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.stop
                offset="0.5"
                stopColor="#61DAFB"
                animate={{
                  stopOpacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: duration * 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: duration / 4,
                }}
              />
              <motion.stop
                offset="1"
                stopColor="#339933"
                animate={{
                  stopOpacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: duration * 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: duration / 2,
                }}
              />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>

      {showText && (
        <motion.div
          className="mt-3 text-center text-2xl"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: duration * 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          Loading...
        </motion.div>
      )}
    </div>
  );
}

export default Loader;