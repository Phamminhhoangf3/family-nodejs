/* eslint-disable no-console */
const { StatusCodes } = require('http-status-codes')
const { memberService } = require('../services/memberService')

const createNew = async (req, res, next) => {
  try {
    const createMember = await memberService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createMember)
  } catch (error) {
    next(error)
  }
}

const memberController = {
  createNew
}
module.exports = { memberController }
