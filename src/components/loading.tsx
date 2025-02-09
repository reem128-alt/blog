import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center h-64"
    >
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
    </motion.div>
  );
}
