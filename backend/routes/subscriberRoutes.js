import express from 'express';
import Subscriber from '../models/subscriber.js';

const router = express.Router();

// Add new subscriber
router.post('/', async (req, res) => {
    try {
        const { email, name } = req.body;

        // Check if subscriber already exists
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        // Create new subscriber
        const newSubscriber = new Subscriber({ email, name });
        const savedSubscriber = await newSubscriber.save();

        res.status(201).json(savedSubscriber);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all subscribers
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ subscribed: true });
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update subscriber subscription status
router.patch('/:id', async (req, res) => {
    try {
        const subscriber = await Subscriber.findByIdAndUpdate(
            req.params.id,
            { subscribed: req.body.subscribed },
            { new: true }
        );

        if (!subscriber) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }

        res.json(subscriber);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete subscriber
router.delete('/:id', async (req, res) => {
    try {
        const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

        if (!subscriber) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }

        res.json({ message: 'Subscriber deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
