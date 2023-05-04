const CyberSecurityTutor = require('../models/CyberSecurityTutor')
const User = require('../models/User')

// @desc Get all cyberSecurityTutor 
// @route GET /cyberSecurityTutor
// @access Private
const getAllCyberSecurityTutors = async (req, res) => {
    // Get all Cyber Security Tutors from MongoDB
    const cyberSecurityTutors = await CyberSecurityTutor.find().lean()

    // If no cyberSecurityTutors found, return an error 
    if (!cyberSecurityTutors?.length) {
        return res.status(400).json({ message: 'No Cyber Security tutors found' })
    }

    const cyberSecurityTutorsWithUser = await Promise.all(cyberSecurityTutors.map(async (cyberSecurityTutor) => {
        const user = await User.findById(cyberSecurityTutor.user).lean().exec()
        return { ...cyberSecurityTutor, username: user.username }
    }))

    res.json(cyberSecurityTutorsWithUser)
}

// @desc Create new /cyberSecurityTutor
// @route POST /cyberSecurityTutor
// @access Private
const createNewCyberSecurityTutor = async (req, res) => {
    const { user, name, tutorID, availability, phone, email, expertise } = req.body

    // Confirm data
    if (!user || !name || !tutorID || !availability || !phone || !email || !expertise) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate name
    const duplicate = await CyberSecurityTutor.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Cyber Security Tutor name' })
    }

    // Create and store the new Cyber Security Tutor 
    const cyberSecurityTutor = await CyberSecurityTutor.create({ user, name, tutorID, availability, phone, email, expertise })

    if (cyberSecurityTutor) { // Created 
        return res.status(201).json({ message: 'New Cyber Security Tutor created' })
    } else {
        return res.status(400).json({ message: 'Invalid Cyber Security Tutor data received' })
    }

}

// @desc Update a cyberSecurityTutor
// @route PATCH /cyberSecurityTutors
// @access Private
const updateCyberSecurityTutor = async (req, res) => {
    const { id, user, name, tutorID, availability, phone, email, expertise } = req.body

    // Confirm data
    if (!id || !user || !name || !tutorID || !availability || !phone || !email || !expertise) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm cyberSecurityTutor exists to update
    const cyberSecurityTutor = await CyberSecurityTutor.findById(id).exec()

    if (!cyberSecurityTutor) {
        return res.status(400).json({ message: 'Cyber Security Tutor not found' })
    }

    // Check for duplicate name
    const duplicate = await CyberSecurityTutor.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow renaming of the original cyberSecurityTutor 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate Cyber Security Tutor name' })
    }

    cyberSecurityTutor.user = user
    cyberSecurityTutor.name = name
    cyberSecurityTutor.tutorID = tutorID
    cyberSecurityTutor.availability = availability
    cyberSecurityTutor.phone = phone
    cyberSecurityTutor.email = email
    cyberSecurityTutor.expertise = expertise
    
    const updatedCyberSecurityTutor = await cyberSecurityTutor.save()

    res.json(`'${updatedCyberSecurityTutor.name}' updated`)
}

// @desc Delete a cyberSecurityTutor
// @route DELETE /cyberSecurityTutor
// @access Private
const deleteCyberSecurityTutor= async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Cyber Security Tutor ID required' })
    }

    // Confirm cyberSecurityTutor exists to delete 
    const cyberSecurityTutor = await CyberSecurityTutor.findById(id).exec()

    if (!cyberSecurityTutor) {
        return res.status(400).json({ message: 'Cyber Security Tutor not found' })
    }

    const result = await cyberSecurityTutor.deleteOne()

    const reply = `Cyber Security Tutor '${result.name}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllCyberSecurityTutors,
    createNewCyberSecurityTutor,
    updateCyberSecurityTutor,
    deleteCyberSecurityTutor
}