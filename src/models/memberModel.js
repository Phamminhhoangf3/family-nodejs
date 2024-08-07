const Joi = require('joi')
const { ObjectId } = require('mongodb')
const { GET_DB } = require('../config/mongodb')
const { TAG_USER, TYPE_MEMBER } = require('../utils/constants')
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('../utils/validators')

const USER_COLLECTION_NAME = 'members'
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

const createNew = async data => {
  try {
    const validData = await validationBeforeCreate(data)
    const validDataToAdd = { ...validData, family: new ObjectId(validData.family) }
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validDataToAdd)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async id => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const memberModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById
}
module.exports = { memberModel }
