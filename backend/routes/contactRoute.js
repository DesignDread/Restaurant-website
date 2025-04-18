// backend/routes/contactRoute.js
import express from 'express'
import { createContact, getContacts } from '../controllers/contactController.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'

const contactrouter = express.Router()

// POST   /api/contact
// Public: create a new contact inquiry
console.log("in")
contactrouter.post('/contact', createContact)

// GET    /api/contact/admin/contacts
// Private: only admins can list all submissions
contactrouter.get('/admin/contacts',getContacts)

export default contactrouter
