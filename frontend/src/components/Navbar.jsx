import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-blue-600 text-white shadow-md"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <h1 className="text-2xl font-bold">
          Bulk Mail App 🚀
        </h1>

        <div className="flex gap-6 text-lg">
          <Link
            to="/"
            className="hover:text-yellow-300 transition"
          >
            Home
          </Link>

          <Link
            to="/history"
            className="hover:text-yellow-300 transition"
          >
            History
          </Link>
        </div>

      </div>
    </motion.nav>
  );
}

export default Navbar;