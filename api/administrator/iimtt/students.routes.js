const {
    fetchAirtableRecords,
    createAirtableRecord,
} = require('../../../integrations/airtable');

const router = require('express').Router();

const STUDENTS_TABLE_NAME = "Students";

// APIs to interact with the Students Airtable table

// Fetch all student records
router.get('/students', async (req, res) => {
    try {
        const records = await fetchAirtableRecords(STUDENTS_TABLE_NAME);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new student record
router.post('/students', async (req, res) => {
    try {
        const fields = req.body;
        const newRecord = await createAirtableRecord(STUDENTS_TABLE_NAME, fields);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update or Upsert student record API can be added here in future
router.put('/students/:id', async (req, res) => {
    try {
        const recordId = req.params.id;
        const fields = req.body;
        const updatedRecord = await updateAirtableRecord(STUDENTS_TABLE_NAME, recordId, fields);
        res.json(updatedRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
});

module.exports = router;




