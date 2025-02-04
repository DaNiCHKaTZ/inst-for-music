const { DbLog } = require('./models/logModel');

const logDbOperation = async (operation, table, recordId) => {
    const cleanRecordId = parseInt(recordId, 10); 
    
    if (isNaN(cleanRecordId)) {
        console.error('Invalid record ID:', recordId); 
        return;
    }

    await DbLog.create({
        operation,
        table,
        recordId: cleanRecordId,
        timestamp: new Date()
    });
};

module.exports = logDbOperation;
