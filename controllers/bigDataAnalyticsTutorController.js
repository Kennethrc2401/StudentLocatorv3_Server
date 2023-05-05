const BigDataAnalyticsTutor = require('../models/BigDataAnalyticsTutor')
const User = require('../models/User')

// @desc Get all bigDataAnalyticsTutor
// @route GET /bigDataAnalyticsTutor
// @access Private
const getAllBigDataAnalyticsTutors = async (req, res) => {
    // Get all Big Data Analytics Tutor from MongoDB
    const bigDataAnalyticsTutors = await BigDataAnalyticsTutor.find().lean()

    // If no bigDataAnalyticsTutors found, return an error 
    if (!bigDataAnalyticsTutors?.length) {
        return res.status(400).json({ message: 'No Big Data Analytics Tutors found' })
    }

    const bigDataAnalyticsTutorsWithUser = await Promise.all(bigDataAnalyticsTutors.map(async (bigDataAnalyticsTutor) => {
        const user = await User.findById(bigDataAnalyticsTutor.user).lean().exec()
        return { ...bigDataAnalyticsTutor, username: user.username }
    }))

    res.json(bigDataAnalyticsTutorsWithUser)
}

// @desc Create new /bigDataAnalyticsTutor
// @route POST /bigDataAnalyticsTutor
// @access Private
const createNewBigDataAnalyticsTutor = async (req, res) => {
    const { user, name, tutorID, availability, phone, email, expertise } = req.body

    // Confirm data
    if (!user || !name || !tutorID || !availability || !phone || !email || !expertise) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate name
    const duplicate = await BigDataAnalyticsTutor.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Big Data Analytics Tutor name' })
    }

    // Create and store the new Big Data Analytics Tutor
    const bigDataAnalyticsTutor = await BigDataAnalyticsTutor.create({ user, name, tutorID, availability, phone, email, expertise })

    if (bigDataAnalyticsTutor) { // Created 
        return res.status(201).json({ message: 'New Big Data Analytics Tutor created' })
    } else {
        return res.status(400).json({ message: 'Invalid Big Data Analytics Tutor data received' })
    }

}

// @desc Update a bigDataAnalyticsTutor
// @route PATCH /bigDataAnalyticsTutors
// @access Private
const updateBigDataAnalyticsTutor = async (req, res) => {
    const { id, user, name, tutorID, availability, phone, email, expertise } = req.body

    // Confirm data
    if (!id || !user || !name || !tutorID || !availability || !phone || !email || !expertise) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm bigDataAnalyticsTutor exists to update
    const bigDataAnalyticsTutor = await BigDataAnalyticsTutor.findById(id).exec()

    if (!bigDataAnalyticsTutor) {
        return res.status(400).json({ message: 'Big Data Analytics Tutor not found' })
    }

    // Check for duplicate name
    const duplicate = await BigDataAnalyticsTutor.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow renaming of the original bigDataAnalyticsTutor 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate Big Data Analytics Tutor name' })
    }

    bigDataAnalyticsTutor.user = user
    bigDataAnalyticsTutor.name = name
    bigDataAnalyticsTutor.tutorID = tutorID
    bigDataAnalyticsTutor.availability = availability
    bigDataAnalyticsTutor.phone = phone
    bigDataAnalyticsTutor.email = email
    bigDataAnalyticsTutor.expertise = expertise
    
    const updatedBigDataAnalyticsTutor = await bigDataAnalyticsTutor.save()

    res.json(`'${updatedBigDataAnalyticsTutor.name}' updated`)
}

// @desc Delete a bigDataAnalyticsTutor
// @route DELETE /bigDataAnalyticsTutor
// @access Private
const deleteBigDataAnalyticsTutor = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Big Data Analytics Tutor ID required' })
    }

    // Confirm bigDataAnalyticsTutor exists to delete 
    const bigDataAnalyticsTutor = await BigDataAnalyticsTutor.findById(id).exec()

    if (!bigDataAnalyticsTutor) {
        return res.status(400).json({ message: 'Big Data Analytics Tutor not found' })
    }

    const result = await bigDataAnalyticsTutor.deleteOne()

    const reply = `Big Data Analytics Tutor '${result.name}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllBigDataAnalyticsTutors,
    createNewBigDataAnalyticsTutor,
    updateBigDataAnalyticsTutor,
    deleteBigDataAnalyticsTutor
}