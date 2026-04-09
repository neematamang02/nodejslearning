import getTransporter from "../config/mailer.js";
import config from "../config/index.js";

const sendEmail = async (to, subject, text) => {
    const transporter = getTransporter();
    const mailOptions = {
        from: config.email.user,
        to,
        subject,
        text
    }
    await transporter.sendMail(mailOptions);
    return true;
};
export default sendEmail;
