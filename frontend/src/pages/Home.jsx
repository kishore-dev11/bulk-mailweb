import { motion } from "framer-motion";
import MailForm from "../components/MailForm";

function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full flex justify-center"
      >
        <MailForm />
      </motion.div>
    </div>
  );
}

export default Home;