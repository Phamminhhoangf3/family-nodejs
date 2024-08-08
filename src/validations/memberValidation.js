/* eslint-disable no-console */
const Joi = require('joi')
const { StatusCodes } = require('http-status-codes')
const ApiError = require('../utils/ApiError')
const { TAG_USER, TYPE_MEMBER } = require('../utils/constants')
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('../utils/validators')

const correctCondition = Joi.object({
  tag: Joi.string()
    .required()
    .valid(TAG_USER.DAUGHTER, TAG_USER.EMPTY, TAG_USER.HUSBAND, TAG_USER.SON, TAG_USER.WIFE)
    .trim()
    .strict(),
  title: Joi.string()
    .valid(TAG_USER.DAUGHTER, TAG_USER.EMPTY, TAG_USER.HUSBAND, TAG_USER.SON, TAG_USER.WIFE)
    .trim()
    .strict()
    .default(''),
  type: Joi.string().required().valid(TYPE_MEMBER.CHILDREN, TYPE_MEMBER.FAMILY).trim().strict(),
  name: Joi.string().required().min(2).max(25).trim().strict(),
  fromDob: Joi.date(),
  toDob: Joi.date(),
  family: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
  dad: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null)
})

const createNew = async (req, res, next) => {
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const memberValidation = {
  createNew
}
module.exports = { memberValidation }
