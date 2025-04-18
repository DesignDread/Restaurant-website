import Contact from '../models/contactmodel.js';

// POST /api/contact
export const createContact = async (req, res) => {
  try {
    const { email, message, subscribe } = req.body;
    const contact = await Contact.create({ email, message, subscribe });
    res.status(201).json({ success: true, contact });
    console.log("data created");
    console.log("email " +  email);
    console.log("message " +  message);
    console.log("subcribe " + subscribe);
    console.log("contact " + contact);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
    console.log('Error creating contact:', err);
  }
};

// GET /api/admin/contacts
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
