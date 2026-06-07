import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("mailHistory")) || [];

    setHistory(savedHistory);
  }, []);

  const deleteHistory = () => {
    localStorage.removeItem("mailHistory");

    setHistory([]);

    toast.success("History Deleted Successfully");
  };

  return (
    <div className="min-h-screen p-5">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Email History 📜
        </h1>

        {history.length > 0 && (
          <button
            onClick={deleteHistory}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
          >
            Clear History
          </button>
        )}

      </div>

      {history.length === 0 ? (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-10 rounded-xl shadow text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-500">
            No Email History Found 😔
          </h2>
        </motion.div>

      ) : (

        <div className="grid md:grid-cols-2 gap-6">

          {history.map((mail, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >

              <h2 className="text-2xl font-bold mb-3 text-blue-600">
                {mail.subject}
              </h2>

              <p className="mb-4 text-gray-700">
                {mail.body}
              </p>

              <div className="mb-4">

                <h3 className="font-bold">
                  Recipients:
                </h3>

                <ul className="text-gray-600 list-disc ml-5">

                  {mail.recipients.map((email, i) => (
                    <li key={i}>{email}</li>
                  ))}

                </ul>

              </div>

              <p className="text-sm text-gray-500">
                Sent On: {mail.date}
              </p>

            </motion.div>

          ))}

        </div>

      )}

    </div>
  );
}

export default History;