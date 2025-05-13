import express from 'express';
import nodemailer from 'nodemailer';
import Subscriber from '../models/subscriber.js';
import { sendEmail } from '../services/SubsriberEmail.js';

const router = express.Router();

router.post('/single', async (req, res) => {
    try {
        const { subscriberId, subject, content } = req.body;

        const subscriber = await Subscriber.findById(subscriberId);
        if (!subscriber || !subscriber.subscribed) {
            return res.status(404).json({ message: 'Subscriber not found or not active' });
        }
        console.log('inside single');
        
        // await transporter.sendMail(mailOptions);

        console.log('EMAIL USER:', process.env.EMAIL_USER || '');
        console.log('EMAIL PASS:', process.env.EMAIL_PASS || '');

        console.log('SUBSCRIBER EMAIL:', subscriber.email);
        console.log('SUBSCRIBER SUBJECT:', subject);
        console.log('SUBSCRIBER CONTENT:', content);
        
        await sendEmail(subscriber.email, subject, content);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
});

// Send email to multiple subscribers
router.post('/bulk', async (req, res) => {
    try {
        const { subscriberIds, subject, content } = req.body;

        // If no specific IDs are provided, send to all active subscribers
        const subscribers = subscriberIds?.length
            ? await Subscriber.find({ _id: { $in: subscriberIds }, subscribed: true })
            : await Subscriber.find({ subscribed: true });

        if (!subscribers.length) {
            return res.status(404).json({ message: 'No active subscribers found' });
        }

        const emailAddresses = subscribers.map(({ email }) => email);

        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            bcc: emailAddresses, // Use BCC for privacy
            subject,
            html: content
        };

        await transporter.sendMail(mailOptions);
        res.json({ 
            message: 'Bulk email sent successfully',
            recipientCount: emailAddresses.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send emails', error: error.message });
    }
});

export default router;
