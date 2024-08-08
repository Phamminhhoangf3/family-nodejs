/* eslint-disable no-console */
const { StatusCodes } = require('http-status-codes')
const { TAG_USER, TYPE_MEMBER } = require('../utils/constants')
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('../utils/validators')
const Member = require('../models/memberModel.js')

const Joi = require('joi')

const USER_COLLECTION_SCHEMA = Joi.object({
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
  dad: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(null),
  _destroy: Joi.boolean().default(false)
})

const validationBeforeCreate = async data => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

exports.createNew = async (req, res, next) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    })
  }
  try {
    const member = new Member({
      tag: req.body.tag,
      title: req.body.title,
      type: req.body.type,
      name: req.body.name,
      fromDob: req.body.fromDob,
      toDob: req.body.toDob,
      family: req.body.family,
      dad: req.body.dad
    })
    const memberValid = await validationBeforeCreate(member)
    if (!memberValid) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Member invalid!'
      })
    }
    Member.create(member, (error, data) => {
      if (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: error.message || 'Some error occurred while creating the Member.'
        })
      }
      res.status(StatusCodes.CREATED).json(data)
    })
  } catch (error) {
    next(error)
  }
}
