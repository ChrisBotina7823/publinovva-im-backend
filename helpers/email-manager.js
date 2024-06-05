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

const sendEmail = async (dest_email, subject, html) => {
    const options = {
        from: from_email,
        to: dest_email,
        subject: `${subject} - ${(new Date()).toLocaleString()}`,
        html : `
        <html>
            <body>
                <div style="font-family: Arial, sans-serif; font-size: 16px;">
                    ${html}
                </div>
            </body>
        </html>
        `
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
