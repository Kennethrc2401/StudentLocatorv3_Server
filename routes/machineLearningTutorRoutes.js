const express = require('express')
const router = express.Router()
const machineLearningTutorController = require('../controllers/machineLearningTutorController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(machineLearningTutorController.getAllMachineLearningTutors)
    .post(machineLearningTutorController.createNewMachineLearningTutor)
    .patch(machineLearningTutorController.updateMachineLearningTutor)
    .delete(machineLearningTutorController.deleteMachineLearningTutor)

module.exports = router