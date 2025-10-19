const _IIMTT_BASE_ID_ = process.env.IIMTT_BASE_ID;
const _AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

const Airtable = require('airtable');
const base = new Airtable({ apiKey: _AIRTABLE_API_KEY }).base(_IIMTT_BASE_ID_);


// Function to fetch records from a specific Airtable table
async function fetchRecordsFromTable(tableName) {
    const records = [];
    return new Promise((resolve, reject) => {
        base(tableName).select({
            // You can add any filters or sorting options here
        }).eachPage((pageRecords, fetchNextPage) => {
            records.push(...pageRecords);
            fetchNextPage();
        }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(records);
            }
        });
    });
}

// Retrieve a record from a specific table by its ID
async function getRecordById(tableName, recordId) {
    try {
        const record = await base(tableName).find(recordId);
        return record;
    } catch (error) {
        throw new Error(`Error fetching record with ID ${recordId} from table ${tableName}: ${error.message}`);
    }
}

// Create a new record in a specific Airtable table
async function createRecordInTable(tableName, fields) {
    try {
        const createdRecord = await base(tableName).create(fields);
        return createdRecord;
    } catch (error) {
        throw new Error(`Error creating record in table ${tableName}: ${error.message}`);
    }
}

// Update an existing record in a specific Airtable table
async function updateRecordInTable(tableName, recordId, fields) {
    try {
        const updatedRecord = await base(tableName).update(recordId, fields);
        return updatedRecord;
    } catch (error) {
        throw new Error(`Error updating record with ID ${recordId} in table ${tableName}: ${error.message}`);
    }
}

// Delete a record from a specific Airtable table
async function deleteRecordFromTable(tableName, recordId) {
    try {
        const deletedRecord = await base(tableName).destroy(recordId);
        return deletedRecord;
    } catch (error) {
        throw new Error(`Error deleting record with ID ${recordId} from table ${tableName}: ${error.message}`);
    }
}

module.exports = {
    fetchRecordsFromTable,
    getRecordById,
    createRecordInTable,
    updateRecordInTable,
    deleteRecordFromTable
};

