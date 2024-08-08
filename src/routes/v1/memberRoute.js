const express = require('express')
const { StatusCodes } = require('http-status-codes')
const { memberValidation } = require('../../validations/memberValidation')
const memberController = require('../../controllers/memberController')

const Router = express.Router()

Router.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'GET: API get list member' })
})

Router.route('/create').post(memberValidation.createNew, memberController.createNew)

const memberRoute = Router

module.exports = { memberRoute }
