const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const bigDataAnalyticsTutorSchema = new mongoose.Schema(
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
        tutorID: {
            type: String,
            required: true
        },
        availability: {
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
        expertise: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

bigDataAnalyticsTutorSchema.plugin(AutoIncrement, 
    { inc_field: 'bigDataAnalyticsTutorID',
    id: 'bigDataAnalyticsTutorIDNums',
    start_seq: 101
});

module.exports = mongoose.model('BigDataAnalyticsTutor', bigDataAnalyticsTutorSchema);