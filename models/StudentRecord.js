const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const studentRecordSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        expertise: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

studentRecordSchema.plugin(AutoIncrement, 
    { inc_field: 'studentID',
    id: 'studentIDNums',
    start_seq: 101
});

module.exports = mongoose.model('StudentRecord', studentRecordSchema);