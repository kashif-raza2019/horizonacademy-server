// APIs to manage enquiries
const express = require('express');
const router = express.Router();
const db = require('../../../services/database.service');
const { sendEmail } = require('../../../integrations/email/service');
const template = require('../../../integrations/email/templates/thank-you-enquiry');
const nodecron = require("../../../integrations/schedulers/email.schedulers");

// Get all enquiries
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM enquiries ORDER BY id DESC');
        res.json({ success: true, total_records: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get a specific enquiry by ID
router.get('/:id', async (req, res) => {
    const enquiryId = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM enquiries WHERE id = ?', [enquiryId]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Enquiry not found' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create a new enquiry
router.post('/', async (req, res) => {
    const { parent_name, student_name, phone, email } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO enquiries (parent_name, student_name, phone, email) VALUES (?, ?, ?, ?)',
            [parent_name, student_name, phone, email]
        );
        // Send thank you email to the parent
        const emailHtml = template(parent_name);
        await sendEmail({
            to: email,
            subject: 'Thank You for Your Enquiry - Horizon Academy',
            html: emailHtml,
            email_user: 'enquiries'
        });

        res.status(201).json({ success: true, data: { id: result.insertId, email } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update an enquiry by ID
router.put('/:id', async (req, res) => {
    const enquiryId = req.params.id;
    const { parent_name, student_name, email, phone } = req.body;
    let current_date = new Date();
    try {
        const [result] = await db.query(
            'UPDATE enquiries SET parent_name = ?, student_name = ?, email = ?, phone = ?, date_last_enquiry_made = ? WHERE id = ?',
            [parent_name, student_name, email, phone, current_date, enquiryId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Enquiry not found' });
        }
        res.json({ success: true, message: 'Enquiry updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete an enquiry by ID
router.delete('/:id', async (req, res) => {
    const enquiryId = req.params.id;
    try {
        const [result] = await db.query('DELETE FROM enquiries WHERE id = ?', [enquiryId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Enquiry not found' });
        }
        res.json({ success: true, message: 'Enquiry deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

nodecron; // Initialize the email scheduler

module.exports = router;