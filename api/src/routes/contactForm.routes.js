import express from 'express';
import { addContactForm, getContactForm, updateContactForm } from '../controllers/contactForm.controller.js';

const router = express.Router();

router.post('/add-contact-form', addContactForm);

router.get('/get-contact-form', getContactForm);

router.put('/update-contact-form', updateContactForm);

export default router;
