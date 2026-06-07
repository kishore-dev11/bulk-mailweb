import { motion } from "framer-motion";

function SuccessMessage({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-5 bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded-lg"
    >
      {message}
    </motion.div>
  );
}

export default SuccessMessage;