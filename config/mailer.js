import nodemailer from 'nodemailer';

let transporter;

export const getTransporter = () => {
    if (!transporter) {
        // Debug: Check if env vars are loaded
        console.log('Creating transporter with EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
        console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);
        
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
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
