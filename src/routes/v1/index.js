const express = require('express')
const { StatusCodes } = require('http-status-codes')
const { familyRoute } = require('./familyRoute')

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

Router.use('/family', familyRoute)

const APIs_V1 = Router
module.exports = { APIs_V1 }
