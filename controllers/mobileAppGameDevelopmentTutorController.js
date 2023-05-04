const MobileAppGameDevelopmentTutor = require('../models/MobileAppGameDevelopmentTutor')
const User = require('../models/User')

// @desc Get all mobileAppGameDevelopmentTutor 
// @route GET /mobileAppGameDevelopmentTutor
// @access Private
const getAllMobileAppGameDevelopmentTutors = async (req, res) => {
    // Get all Mobile App Game Development Tutor from MongoDB
    const mobileAppGameDevelopmentTutors = await MobileAppGameDevelopmentTutor.find().lean()

    // If no mobileAppGameDevelopmentTutors found, return an error 
    if (!mobileAppGameDevelopmentTutors?.length) {
        return res.status(400).json({ message: 'No Mobile App Game Development Tutors found' })
    }

    const mobileAppGameDevelopmentTutorsWithUser = await Promise.all(mobileAppGameDevelopmentTutors.map(async (mobileAppGameDevelopmentTutor) => {
        const user = await User.findById(mobileAppGameDevelopmentTutor.user).lean().exec()
        return { ...mobileAppGameDevelopmentTutor, username: user.username }
    }))

    res.json(mobileAppGameDevelopmentTutorsWithUser)
}

// @desc Create new /mobileAppGameDevelopmentTutor
// @route POST /mobileAppGameDevelopmentTutor
// @access Private
const createNewMobileAppGameDevelopmentTutor = async (req, res) => {
    const { user, name, tutorID, availability, phone, email, expertise } = req.body

    // Confirm data
    if (!user || !name || !tutorID || !availability || !phone || !email || !expertise) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate name
    const duplicate = await MobileAppGameDevelopmentTutor.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Mobile App Game Development Tutor name' })
    }

    // Create and store the new Mobile App Game Development Tutor
    const mobileAppGameDevelopmentTutor = await MobileAppGameDevelopmentTutor.create({ user, name, tutorID, availability, phone, email, expertise })

    if (mobileAppGameDevelopmentTutor) { // Created 
        return res.status(201).json({ message: 'New Mobile App Game Development Tutor created' })
    } else {
        return res.status(400).json({ message: 'Invalid Mobile App Game Development Tutor data received' })
    }

}

// @desc Update a mobileAppGameDevelopmentTutor
// @route PATCH /mobileAppGameDevelopmentTutors
// @access Private
const updateMobileAppGameDevelopmentTutor = async (req, res) => {
    const { id, user, name, tutorID, availability, phone, email, expertise } = req.body

    // Confirm data
    if (!id || !user || !name || !tutorID || !availability || !phone || !email || !expertise) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm mobileAppGameDevelopmentTutor exists to update
    const mobileAppGameDevelopmentTutor = await MobileAppGameDevelopmentTutor.findById(id).exec()

    if (!mobileAppGameDevelopmentTutor) {
        return res.status(400).json({ message: 'Mobile App Game Development Tutor not found' })
    }

    // Check for duplicate name
    const duplicate = await MobileAppGameDevelopmentTutor.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow renaming of the original mobileAppGameDevelopmentTutor 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate Mobile App Game Development Tutor name' })
    }

    mobileAppGameDevelopmentTutor.user = user
    mobileAppGameDevelopmentTutor.name = name
    mobileAppGameDevelopmentTutor.tutorID = tutorID
    mobileAppGameDevelopmentTutor.availability = availability
    mobileAppGameDevelopmentTutor.phone = phone
    mobileAppGameDevelopmentTutor.email = email
    mobileAppGameDevelopmentTutor.expertise = expertise
    
    const updatedMobileAppGameDevelopmentTutor = await mobileAppGameDevelopmentTutor.save()

    res.json(`'${updatedMobileAppGameDevelopmentTutor.name}' updated`)
}

// @desc Delete a mobileAppGameDevelopmentTutor
// @route DELETE /mobileAppGameDevelopmentTutor
// @access Private
const deleteMobileAppGameDevelopmentTutor = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Mobile App Game Development Tutor ID required' })
    }

    // Confirm mobileAppGameDevelopmentTutor exists to delete 
    const mobileAppGameDevelopmentTutor = await MobileAppGameDevelopmentTutor.findById(id).exec()

    if (!mobileAppGameDevelopmentTutor) {
        return res.status(400).json({ message: 'Mobile App Game Development Tutor not found' })
    }

    const result = await mobileAppGameDevelopmentTutor.deleteOne()

    const reply = `Mobile App Game Development Tutor '${result.name}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllMobileAppGameDevelopmentTutors,
    createNewMobileAppGameDevelopmentTutor,
    updateMobileAppGameDevelopmentTutor,
    deleteMobileAppGameDevelopmentTutor
}