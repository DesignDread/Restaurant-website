import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like SendGrid, AWS SES, etc.
    auth: {
        user: process.env.EMAIL_USER, // Set this in your .env file
        pass: process.env.EMAIL_PASSWORD, // Set this in your .env file
    },
});

/**
 * Send an email notification
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content
 * @param {string} html - HTML content (optional)
 * @returns {Promise} - Returns promise that resolves with info about the sent email
 */
export const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html: html || text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email notification');
    }
};

/**
 * Send welcome email to a new user
 * @param {string} email - User's email address
 * @param {string} name - User's name
 */
export const sendWelcomeEmail = async (email, name) => {
    const subject = 'Welcome to Our Application!';
    const text = `Hello ${name}, welcome to our application! Thank you for signing up.`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Our Application!</h2>
            <p>Hello ${name},</p>
            <p>Thank you for signing up. We're excited to have you on board!</p>
            <p>If you have any questions, feel free to reply to this email.</p>
            <p>Best regards,<br>Your App Team</p>
        </div>
    `;
    
    return sendEmail(email, subject, text, html);
};

/**
 * Send notification email
 * @param {string} email - User's email address
 * @param {string} name - User's name
 * @param {string} notificationType - Type of notification
 * @param {object} data - Additional data for the notification
 */
export const sendNotificationEmail = async (email, name, notificationType, data = {}) => {
    let subject, text, html;
    
    switch (notificationType) {
        case 'password_reset':
            subject = 'Password Reset Request';
            text = `Hello ${name}, you requested a password reset. Use this link to reset your password: ${data.resetLink}`;
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>Hello ${name},</p>
                    <p>You requested a password reset. Click the button below to reset your password:</p>
                    <p>
                        <a href="${data.resetLink}" style="display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                            Reset Password
                        </a>
                    </p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>Best regards,<br>Your App Team</p>
                </div>
            `;
            break;
            
        case 'order_confirmation':
            subject = 'Order Confirmation';
            text = `Hello ${name}, your order #${data.orderId} has been confirmed. Thank you for your purchase!`;
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Order Confirmation</h2>
                    <p>Hello ${name},</p>
                    <p>Your order <strong>#${data.orderId}</strong> has been confirmed.</p>
                    <p>Thank you for your purchase!</p>
                    <p>Best regards,<br>Your App Team</p>
                </div>
            `;
            break;
            
        default:
            subject = 'Notification';
            text = `Hello ${name}, you have a new notification.`;
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>New Notification</h2>
                    <p>Hello ${name},</p>
                    <p>You have a new notification from our application.</p>
                    <p>Best regards,<br>Your App Team</p>
                </div>
            `;
    }
    
    return sendEmail(email, subject, text, html);
};
