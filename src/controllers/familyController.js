const { StatusCodes } = require('http-status-codes')
const { familyService } = require('../services/familyService')

const createNew = async (req, res, next) => {
  try {
    const createFamily = await familyService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createFamily)
  } catch (error) {
    next(error)
  }
}

const familyController = {
  createNew
}

module.exports = { familyController }
