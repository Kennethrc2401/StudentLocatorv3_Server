const MachineLearningTutor = require('../models/MachineLearningTutor')
const User = require('../models/User')

// @desc Get all machineLearningTutor 
// @route GET /machineLearningTutor
// @access Private
const getAllMachineLearningTutors = async (req, res) => {
    // Get all Machine Learning Tutors from MongoDB
    const machineLearningTutors = await MachineLearningTutor.find().lean()

    // If no Machine Learning Tutors found, return an error 
    if (!machineLearningTutors?.length) {
        return res.status(400).json({ message: 'No Machine Learning Tutors found' })
    }

    const machineLearningTutorsWithUser = await Promise.all(machineLearningTutors.map(async (machineLearningTutor) => {
        const user = await User.findById(machineLearningTutor.user).lean().exec()
        return { ...machineLearningTutor, username: user.username }
    }))

    res.json(machineLearningTutorsWithUser)
}

// @desc Create new /machineLearningTutor
// @route POST /machineLearningTutor
// @access Private
const createNewMachineLearningTutor = async (req, res) => {
    const { user, name, tutorID, availability, phone, email, expertise } = req.body

    // Confirm data
    if (!user || !name || !tutorID || !availability || !phone || !email || !expertise) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate name
    const duplicate = await MachineLearningTutor.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Machine Learning Tutor name' })
    }

    // Create and store the new Machine Learning Tutor 
    const machineLearningTutor = await MachineLearningTutor.create({ user, name, tutorID, availability, phone, email, expertise })

    if (machineLearningTutor) { // Created 
        return res.status(201).json({ message: 'New Machine Learning Tutor created' })
    } else {
        return res.status(400).json({ message: 'Invalid Machine Learning Tutor data received' })
    }

}

// @desc Update a machineLearningTutor
// @route PATCH /machineLearningTutors
// @access Private
const updateMachineLearningTutor = async (req, res) => {
    const { id, user, name, tutorID, availability, phone, email, expertise } = req.body

    // Confirm data
    if (!id || !user || !name || !tutorID || !availability || !phone || !email || !expertise) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm machineLearningTutor exists to update
    const machineLearningTutor = await MachineLearningTutor.findById(id).exec()

    if (!machineLearningTutor) {
        return res.status(400).json({ message: 'Machine Learning Tutor not found' })
    }

    // Check for duplicate name
    const duplicate = await MachineLearningTutor.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow renaming of the original machineLearningTutor 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate Machine Learning Tutor name' })
    }

    machineLearningTutor.user = user
    machineLearningTutor.name = name
    machineLearningTutor.tutorID = tutorID
    machineLearningTutor.availability = availability
    machineLearningTutor.phone = phone
    machineLearningTutor.email = email
    machineLearningTutor.expertise = expertise
    
    const updatedMachineLearningTutor = await machineLearningTutor.save()

    res.json(`'${updatedMachineLearningTutor.name}' updated`)
}

// @desc Delete a machineLearningTutor
// @route DELETE /machineLearningTutor
// @access Private
const deleteMachineLearningTutor = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Machine Learning Tutor ID required' })
    }

    // Confirm machineLearningTutor exists to delete 
    const machineLearningTutor = await MachineLearningTutor.findById(id).exec()

    if (!machineLearningTutor) {
        return res.status(400).json({ message: 'Machine Learning Tutor not found' })
    }

    const result = await machineLearningTutor.deleteOne()

    const reply = `Machine Learning Tutor '${result.name}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllMachineLearningTutors,
    createNewMachineLearningTutor,
    updateMachineLearningTutor,
    deleteMachineLearningTutor
}