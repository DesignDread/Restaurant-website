import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: "eca2edc8ef8973",
    pass: "4b42506353f4cb"
  }
});


export const sendEmail = async (to, subject, htmlContent) => {

  
  // console.log("EMAIL USER", process.env.EMAIL_USER);
  // console.log("EMAIL PASS", process.env.EMAIL_PASS);
  // console.log("EMAIL TO", to);
  // console.log("EMAIL SUBJECT", subject);
  // console.log("EMAIL HTML CONTENT", htmlContent);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent
  };

  console.log("MAIL OPTIONS", mailOptions);

  try {
    console.log("Sending email...");
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.log("Error sending email");
    console.error('Email sending error:', error);
    return false;
  }
};