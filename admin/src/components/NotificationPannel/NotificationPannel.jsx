import React, { useState } from "react";
import emailjs from "emailjs-com";

const SendEmail = () => {
  // States for email inputs
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // Handle the email sending
  const sendEmail = (e) => {
    e.preventDefault();

    // Validate input fields
    if (!emails || !subject || !message) {
      setStatus("Please fill out all fields.");
      return;
    }

    // Prepare email data
    const emailList = emails.split(",").map((email) => email.trim());

    const templateParams = {
      emails: emailList.join(", "), // You can send all emails in one string (comma-separated)
      subject: subject,
      message: message,
    };

    // Call EmailJS to send the email
    emailjs
      .send(
        "service_cxhacqq", // Your EmailJS service ID
        "YOUR_TEMPLATE_ID", // Your EmailJS template ID
        templateParams,
        "YOUR_USER_ID" // Your EmailJS user ID
      )
      .then(
        (response) => {
          setStatus("Emails sent successfully!");
          console.log(response);
        },
        (error) => {
          setStatus("Failed to send emails.");
          console.error(error);
        }
      );
  };

  return (
    <div>
      <h2>Send Bulk Email</h2>
      <form onSubmit={sendEmail}>
        <div>
          <label for="emails">Enter Email Addresses (comma-separated):</label>
          <input
            type="text"
            id="emails"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="user1@example.com, user2@example.com"
          />
        </div>
        <div>
          <label for="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject of the email"
          />
        </div>
        <div>
          <label for="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message goes here"
          />
        </div>
        <button type="submit">Send Email</button>
      </form>
      <p>{status}</p>
    </div>
  );
};

export default SendEmail;
