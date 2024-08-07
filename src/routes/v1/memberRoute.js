const express = require('express')
const { StatusCodes } = require('http-status-codes')
const { memberController } = require('../../controllers/memberController')
const { memberValidation } = require('../../validations/memberValidation')

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list member' })
  })
  .post(memberValidation.createNew, memberController.createNew)

const memberRoute = Router
module.exports = { memberRoute }
