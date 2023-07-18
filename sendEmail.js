// sendEmail.js
require('dotenv').config()
const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: process.env.EMAIL_PORT,
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD
    }
});
// Function to send an email with OTP
const sendOTP = async (toEmail, otp) => {
    try {
        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: toEmail,
            subject: 'Email verification',
            text: `Your OTP for emailverfication is: ${otp}`,
        };
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
}

module.exports = sendOTP;
