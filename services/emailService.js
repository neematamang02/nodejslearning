import getTransporter from "../config/mailer.js";

const sendEmail = async (to, subject, text) => {
    const transporter = getTransporter();
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    }
    await transporter.sendMail(mailOptions);
    return true;
};
export default sendEmail;
