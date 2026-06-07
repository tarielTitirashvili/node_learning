const nodemailer = require("nodemailer")


// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const mailSender = (targetMailMails, {subject, text, html}) => {
  return transporter.sendMail({
    from: {
      name: 'tariel\'s App',
      address: process.env.GMAIL_USER
    }, // sender address
    to: targetMailMails, // list of recipients
    subject: subject, // subject line
    text: text || "Hello world?", // plain text body
    html: html || "<b>Hello world?</b>", // HTML body
  })

  console.log("Message sent: %s", info.messageId)
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
}

module.exports = { mailSender }