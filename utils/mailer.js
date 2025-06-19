const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // your app password
    },
});

async function sendNotificationEmail(to, subject, message) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: message,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendNotificationEmail;
