import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import multer from "multer";
import XLSX from "xlsx";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Gmail Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const upload = multer({
    dest: "uploads/",
});

app.get("/", (req, res) => {
    res.send("Bulk Mail API Running 🚀");
});

// Normal Mail Route
app.post("/send-mail", async (req, res) => {
    try {
        const { subject, body, recipients } = req.body;

        if (!subject || !body || !recipients?.length) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: recipients.join(","),
            subject,
            html: `
                <div>
                    <h2>${subject}</h2>
                    <p>${body}</p>
                </div>
            `,
        });

        res.status(200).json({
            success: true,
            message: "Emails Sent Successfully ✅",
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to Send Email ❌",
        });
    }
});

// Excel Mail Route
app.post(
    "/send-excel-mails",
    upload.single("file"),
    async (req, res) => {
        try {
            const workbook = XLSX.readFile(req.file.path);

            const sheetName = workbook.SheetNames[0];

            const rows = XLSX.utils.sheet_to_json(
                workbook.Sheets[sheetName],
                { header: 1 }
            );

            const recipients = rows
                .flat()
                .filter(email => email);

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: recipients.join(","),
                subject: req.body.subject,
                html: `
                    <div>
                        <h2>${req.body.subject}</h2>
                        <p>${req.body.body}</p>
                    </div>
                `,
            });

            res.status(200).json({
                success: true,
                message: "Excel Emails Sent Successfully ✅",
            });

        } catch (error) {

            console.log("Excel Mail Error:", error);

            res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running Successfully 🚀 on port ${PORT}`);
});