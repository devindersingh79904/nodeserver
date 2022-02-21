const nodemailer = require("nodemailer");



// SMTP_HOST=smtp.mailtrap.io
// SMTP_PORT=2525
// SMTP_EMAIL=97fadc41ad1c16
// SMTP_PASSWORD=b22060be031156
// FROM_EMAIL=noreply@devcamper.com
// FROM_NAME=Devcamper


sendEmail = async(options)=> {
  
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
  });


  
  let message = {
    from:`${process.env.FROM_NAME} ${process.env.FROM_EMAIL}`,
    to: options.email, 
    subject: options.subject,
    text: options.message
  };

  const info = await transporter.sendMail(message)

  console.log("Message sent: %s", info.messageId);

}

module.exports = sendEmail