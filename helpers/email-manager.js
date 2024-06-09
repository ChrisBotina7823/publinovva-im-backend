import nodemailer from 'nodemailer'
import { config } from 'dotenv';
import { header, template } from './html_templates/welcome-header.js';
config()

const from_email = process.env.FROM_EMAIL

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: from_email,
      pass: process.env.EMAIL_PASSWORD,
    },
});

const sendEmail = async (dest_email, subject, html, showBtn = false ) => {
    const options = {
        from: from_email,
        to: dest_email,
        subject: `${subject} - ${(new Date()).toLocaleString()}`,
        html : `
        <html lang="es>
            <head>
                ${header()}
            </head>
            <body class="body" style="width:100%;height:100%;padding:0;Margin:0">
                <div style="font-family: Arial, sans-serif; font-size: 16px;">
                    ${ template(html, showBtn) }
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
