const express = require('express')
const router = express.Router()
const mobileAppGameDevelopmentTutorController = require('../controllers/mobileAppGameDevelopmentTutorController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(mobileAppGameDevelopmentTutorController.getAllMobileAppGameDevelopmentTutors)
    .post(mobileAppGameDevelopmentTutorController.createNewMobileAppGameDevelopmentTutor)
    .patch(mobileAppGameDevelopmentTutorController.updateMobileAppGameDevelopmentTutor)
    .delete(mobileAppGameDevelopmentTutorController.deleteMobileAppGameDevelopmentTutor)

module.exports = router