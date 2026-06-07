import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import validator from "validator";
import { motion } from "framer-motion";
import Loader from "./Loader";

function MailForm() {
  const API = import.meta.env.VITE_API_URL;
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const sendMail = async () => {
    if (
      !subject.trim() ||
      !body.trim() ||
      (!emails.trim() && !file)
    ) {
      toast.error(
        "Enter emails or upload an Excel file"
      );
      return;
    }

    let recipients = [];

    if (emails.trim()) {
      recipients = emails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "");
    }

    const invalidEmail = recipients.find(
      (email) => !validator.isEmail(email)
    );

    if (invalidEmail) {
      toast.error(`Invalid Email: ${invalidEmail}`);
      return;
    }

    try {
      setLoading(true);

      // Excel Upload
      // Excel Upload
      if (file) {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("subject", subject);
        formData.append("body", body);

        const response = await axios.post(
          `${API}/send-excel-mails`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success(response.data.message);

        setSubject("");
        setBody("");
        setEmails("");
        setFile(null);

        return;
      }

      // Manual Email Sending
      const response = await axios.post(
        `${API}/send-mail`,
        {
          subject,
          body,
          recipients,
        }
      );

      toast.success(response.data.message);
      const history =
        JSON.parse(
          localStorage.getItem("mailHistory")
        ) || [];

      history.unshift({
        subject,
        body,
        recipients,
        date: new Date().toLocaleString(),
      });

      localStorage.setItem(
        "mailHistory",
        JSON.stringify(history)
      );

      setSubject("");
      setBody("");
      setEmails("");
      setFile(null);

    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to Send Email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl"
    >
      <h1 className="text-3xl font-bold text-center mb-6">
        Bulk Mail Sender 📧
      </h1>

      <input
        type="text"
        placeholder="Enter Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border p-3 rounded-lg w-full mb-4 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-3 rounded-lg w-full mb-4"
      />

      <textarea
        rows="6"
        placeholder="Enter Email Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="border p-3 rounded-lg w-full mb-2 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <p className="text-sm text-gray-500 mb-4">
        Characters: {body.length}
      </p>

      <textarea
        rows="5"
        placeholder="email1@gmail.com,email2@gmail.com"
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        className="border p-3 rounded-lg w-full mb-2 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <p className="text-sm text-gray-500 mb-5">
        Recipients:{" "}
        {
          emails
            .split(",")
            .filter(
              (email) => email.trim() !== ""
            ).length
        }
      </p>

      <button
        onClick={sendMail}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white p-3 rounded-lg text-lg font-semibold disabled:bg-gray-400"
      >
        {loading ? "Sending..." : "Send Emails"}
      </button>

      <p className="text-gray-500 mt-4 text-center">
        Upload an Excel file containing email addresses
      </p>

      {loading && <Loader />}
    </motion.div>
  );
}

export default MailForm;