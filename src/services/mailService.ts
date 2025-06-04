const nodemailer = require('nodemailer');
import dotenv from 'dotenv';

const DB_TYPE=process.env.VERIFICATION_MAIL_SECRET!;

const transporter = nodemailer.createTransport({
    host: 'mail.persist.site',
    port: 587,
    secure: false, // true for port 465, false for 587
    auth: {
        user: 'verification@persist.site',
        pass: '!@#MadamApproves#@!',
    }
});

export const sendVerificationEmail = async (to: string, code: string) => {
    await transporter.sendMail({
        from: '"Verify" <verification@persist.site>',
        to: to,
        subject: 'Your verification code',
        text: `Your code is: ${code}`,
        html: `<p>Your code is: <b>${code}</b></p>`,
    });
}
