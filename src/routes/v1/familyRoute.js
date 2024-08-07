const express = require('express')
const { familyController } = require('../../controllers/familyController')
const { familyValidation } = require('../../validations/familyValidation')

const Router = express.Router()

Router.route('/').post(familyValidation.createNew, familyController.createNew)

const familyRoute = Router
module.exports = { familyRoute }
