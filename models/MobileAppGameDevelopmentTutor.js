const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const mobileAppGameDevelopmentTutorSchema = new mongoose.Schema(
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

mobileAppGameDevelopmentTutorSchema.plugin(AutoIncrement, 
    { inc_field: 'mobileAppGameDevelopmentTutorID',
    id: 'mobileAppGameDevelopmentTutorIDNums',
    start_seq: 101
});

module.exports = mongoose.model('MobileAppGameDevelopmentTutor', mobileAppGameDevelopmentTutorSchema);