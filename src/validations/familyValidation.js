const Joi = require('joi')
const { StatusCodes } = require('http-status-codes')
const ApiError = require('../utils/ApiError')
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('../utils/validators')
const { TYPE_MEMBER } = require('../utils/constants')

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    type: Joi.string().required().valid(TYPE_MEMBER.FAMILY),
    husband: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
    wife: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
    exWife: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
    children: Joi.array()
      .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null))
      .default([])
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const familyValidation = {
  createNew
}
module.exports = { familyValidation }
