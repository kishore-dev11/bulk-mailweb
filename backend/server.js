const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const multer = require('multer');
const XLSX = require('xlsx');

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: [
    'https://bulk-mailweb.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());

// ✅ File upload setup
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Email transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // App password, not real password
  }
});

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ message: "Bulk Mail Backend is Running! 🚀" });
});

// ✅ Send individual emails
app.post('/send-mail', async (req, res) => {
  try {
    const { subject, body, recipients } = req.body;

    if (!subject || !body || !recipients || recipients.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Send emails
    for (const email of recipients) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: body
      });
    }

    res.status(200).json({ 
      message: `Emails sent successfully to ${recipients.length} recipients!` 
    });

  } catch (error) {
    console.error('Send mail error:', error);
    res.status(500).json({ 
      message: "Error sending emails: " + error.message 
    });
  }
});

// ✅ Send emails from Excel
app.post('/send-excel-mails', upload.single('file'), async (req, res) => {
  try {
    const { subject, body } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!subject || !body) {
      return res.status(400).json({ message: "Subject and body are required" });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Extract emails (assumes first column has emails)
    const emails = data.map(row => Object.values(row)[0]).filter(email => email);

    if (emails.length === 0) {
      return res.status(400).json({ message: "No valid emails found in Excel" });
    }

    // Send emails
    let successCount = 0;
    for (const email of emails) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: subject,
          html: body
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to send to ${email}:`, err);
      }
    }

    res.status(200).json({ 
      message: `Successfully sent ${successCount}/${emails.length} emails!` 
    });

  } catch (error) {
    console.error('Send Excel mail error:', error);
    res.status(500).json({ 
      message: "Error processing Excel: " + error.message 
    });
  }
});

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error: " + err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER}`);
});