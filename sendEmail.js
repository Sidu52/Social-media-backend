// sendEmail.js
require('dotenv').config()
// const generateEmailHTML = require('./public/main.js');
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
const sendOTP = async (type, toEmail, name, companyName, message) => {
    try {
        if (type === "OTP") {
            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: toEmail,
                subject: 'Email verification',
                text: `Your OTP for email verification is: ${name}`,//name is used for send OTP here
            };
            await transporter.sendMail(mailOptions);
            console.log('OTP email sent successfully');
        } else {
            // const emailContent = generateEmailHTML();

            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: toEmail,
                subject: `${name} sent a message from ${companyName}`,
                text: message
                // html: emailContent,
            };
            await transporter.sendMail(mailOptions);
            console.log('Message email sent successfully');
        }
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};


module.exports = sendOTP;
