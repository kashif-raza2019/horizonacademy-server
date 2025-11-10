const {
    fetchRecordsFromTable,
    createRecordInTable,
    updateRecordInTable,
    getRecordById
} = require('../../../integrations/airtable');

const router = require('express').Router();

const TABLE_NAME = "Payments";

const { createRazorpayPaymentLink } = require('../../../integrations/payments');

// APIs to interact with the Payments Airtable table

// Fetch all payment records
router.get('/', async (req, res) => {
    try {
        const records = await fetchRecordsFromTable(TABLE_NAME);
        let results = [];
        records.forEach(record => {
            results.push({
                id: record.id,
                fields: record.fields
            });
        });
        res.json({ count: results.length, records: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new payment record
router.post('/', async (req, res) => {
    try {

        let recordFields = {
            EnrollmentNumber: [req.body.enrollmentNumber],
            Status: 'Pending',
            Amount: req.body.amount
        }
        const fields = req.body;
        const newRecord = await createRecordInTable(TABLE_NAME, fields);
        res.status(201).json({ id: newRecord.id, fields: newRecord.fields });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update or Upsert payment record API can be added here in future
router.put('/:id', async (req, res) => {
    try {
        const recordId = req.params.id;
        const fields = req.body;
        const updatedRecord = await updateRecordInTable(TABLE_NAME, recordId, fields);

        res.json({ id: updatedRecord.id, fields: updatedRecord.fields });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get payment record API can be added here in future
router.get('/:id', async (req, res) => {
    try {
        const recordId = req.params.id;
        const record = await getRecordById(TABLE_NAME, recordId);
        res.json(record.fields);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;




