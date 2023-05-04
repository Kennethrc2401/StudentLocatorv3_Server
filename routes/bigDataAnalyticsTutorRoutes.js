const express = require('express')
const router = express.Router()
const bigDataAnalyticsTutorController = require('../controllers/bigDataAnalyticsTutorController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(bigDataAnalyticsTutorController.getAllBigDataAnalyticsTutors)
    .post(bigDataAnalyticsTutorController.createNewBigDataAnalyticsTutor)
    .patch(bigDataAnalyticsTutorController.updateBigDataAnalyticsTutor)
    .delete(bigDataAnalyticsTutorController.deleteBigDataAnalyticsTutor)

module.exports = router