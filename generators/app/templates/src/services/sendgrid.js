import sendgridMail from '@sendgrid/mail'

sendgridMail.setApiKey(process.env.SENDGRID_KEY)

export const sendMail = (toEmail, subject, content) => {
    const msg = {
        to: toEmail,
        from: process.env.DEFAULT_EMAIL,
        subject,
        html: content
    }
    return sendgridMail.send(msg)
}