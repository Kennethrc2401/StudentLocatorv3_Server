const express = require('express')
const router = express.Router()
const studentRecordController = require('../controllers/studentRecordsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(studentRecordController.getAllStudentRecords)
    .post(studentRecordController.createNewStudentRecord)
    .patch(studentRecordController.updateStudentRecord)
    .delete(studentRecordController.deleteStudentRecord)

module.exports = router