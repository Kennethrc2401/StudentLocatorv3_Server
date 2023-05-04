const express = require('express')
const router = express.Router()
const cyberSecurityTutorController = require('../controllers/cyberSecurityTutorController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(cyberSecurityTutorController.getAllCyberSecurityTutors)
    .post(cyberSecurityTutorController.createNewCyberSecurityTutor)
    .patch(cyberSecurityTutorController.updateCyberSecurityTutor)
    .delete(cyberSecurityTutorController.deleteCyberSecurityTutor)

module.exports = router