import nodemailer from 'nodemailer';
import config from './index.js';

let transporter;

export const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: config.email.user,
                pass: config.email.pass
            }
        });

        // Verify connection configuration
        transporter.verify((error, success) => {
            if (error) {
                console.error('SMTP verification failed:', error);
            } else {
                console.log('SMTP server ready to send emails');
            }
        });
    }
    return transporter;
};

export default getTransporter;
