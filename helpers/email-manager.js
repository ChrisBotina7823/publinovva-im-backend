import nodemailer from 'nodemailer'
import { config } from 'dotenv';
config()

const from_email = process.env.FROM_EMAIL

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: from_email,
      pass: process.env.EMAIL_PASSWORD,
    },
});

const sendEmail = async (dest_email, subject, text) => {
    const options = {
        from: from_email,
        to: dest_email,
        subject,
        text
    }

    try {
        return await transporter.sendMail(options)
    } catch(err) {
        console.error(err)
        return null
    }
}

export {
    sendEmail
}
