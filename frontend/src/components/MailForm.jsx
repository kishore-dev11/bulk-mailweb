import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import validator from "validator";
import { motion } from "framer-motion";
import Loader from "./Loader";

function MailForm() {
  const API = "https://bulk-mail-backend-p2mx.onrender.com";

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const sendMail = async () => {
    if (!subject.trim() || !body.trim() || (!emails.trim() && !file)) {
      toast.error("Enter emails or upload an Excel file");
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
      const response = await axios.post(`${API}/send-mail`, {
        subject,
        body,
        recipients,
      });

      toast.success(response.data.message);

      const history =
        JSON.parse(localStorage.getItem("mailHistory")) || [];

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
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to Send Email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // unga existing JSX full-a same-a vechukonga
  );
}

export default MailForm;