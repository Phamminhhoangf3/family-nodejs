const express = require('express')
const { StatusCodes } = require('http-status-codes')
const { memberRoute } = require('../../routes/v1/memberRoute')
const { familyRoute } = require('./familyRoute')

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

Router.use('/member', memberRoute)
Router.use('/family', familyRoute)

const APIs_V1 = Router
module.exports = { APIs_V1 }
