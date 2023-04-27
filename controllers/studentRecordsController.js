const StudentRecord = require('../models/StudentRecord')
const User = require('../models/User')

// @desc Get all studentRecords 
// @route GET /studentRecords
// @access Private
const getAllStudentRecords = async (req, res) => {
    // Get all Student Records from MongoDB
    const studentRecords = await StudentRecord.find().lean()

    // If no studentRecords found, return an error 
    if (!studentRecords?.length) {
        return res.status(400).json({ message: 'No student records found' })
    }

    // Add username to each student record before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const studentRecordsWithUser = await Promise.all(studentRecords.map(async (studentRecord) => {
        const user = await User.findById(studentRecord.user).lean().exec()
        return { ...studentRecord, username: user.username }
    }))

    res.json(studentRecordsWithUser)
}

// @desc Create new /studentRecord
// @route POST /studentRecords
// @access Private
const createNewStudentRecord = async (req, res) => {
    const { user, name, email, phone, address, expertise } = req.body

    // Confirm data
    if (!user || !name || !email || !phone || !address || !expertise) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate name
    const duplicate = await StudentRecord.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate student name' })
    }

    // Create and store the new user 
    const studentRecord = await StudentRecord.create({ user, name, email, phone, address, expertise })

    if (studentRecord) { // Created 
        return res.status(201).json({ message: 'New student record created' })
    } else {
        return res.status(400).json({ message: 'Invalid student record data received' })
    }

}

// @desc Update a student record
// @route PATCH /studentRecords
// @access Private
const updateStudentRecord = async (req, res) => {
    const { id, user, name, email, phone, address, expertise } = req.body

    // Confirm data
    if (!id || !user || !name || !email || !phone || !address || !expertise) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm studentRecord exists to update
    const studentRecord = await StudentRecord.findById(id).exec()

    if (!studentRecord) {
        return res.status(400).json({ message: 'Student record not found' })
    }

    // Check for duplicate name
    const duplicate = await StudentRecord.findOne({ name }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow renaming of the original student record 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate student name' })
    }

    studentRecord.user = user
    studentRecord.name = name
    studentRecord.email = email
    studentRecord.phone = phone
    studentRecord.address = address
    studentRecord.expertise = expertise
    
    const updatedStudentRecord = await studentRecord.save()

    res.json(`'${updatedStudentRecord.name}' updated`)
}

// @desc Delete a student record
// @route DELETE /studentRecords
// @access Private
const deleteStudentRecord = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Student ID required' })
    }

    // Confirm studentRecord exists to delete 
    const studentRecord = await StudentRecord.findById(id).exec()

    if (!studentRecord) {
        return res.status(400).json({ message: 'Student record not found' })
    }

    const result = await studentRecord.deleteOne()

    const reply = `Student Record '${result.name}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllStudentRecords,
    createNewStudentRecord,
    updateStudentRecord,
    deleteStudentRecord
}