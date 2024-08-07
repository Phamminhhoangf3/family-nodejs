const Joi = require('joi')
const { ObjectId } = require('mongodb')
const { GET_DB } = require('../config/mongodb')
const { TYPE_MEMBER } = require('../utils/constants')
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('../utils/validators')

const FAMILY_COLLECTION_NAME = 'families'
const FAMILY_COLLECTION_SCHEMA = Joi.object({
  type: Joi.string().required().valid(TYPE_MEMBER.FAMILY),
  husband: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
  wife: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
  exWife: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
  children: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null))
    .default([]),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(null),
  _destroy: Joi.boolean().default(false)
})

// những field không được cập nhật
// const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validationBeforeCreate = async data => {
  return await FAMILY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async data => {
  try {
    const validData = await validationBeforeCreate(data)
    const newFamilyToAdd = {
      ...validData
    }

    if (newFamilyToAdd.husband) newFamilyToAdd.husband = new ObjectId(validData.husband)
    if (newFamilyToAdd.wife) newFamilyToAdd.wife = new ObjectId(validData.wife)
    if (newFamilyToAdd.exWife) newFamilyToAdd.exWife = new ObjectId(validData.exWife)
    if (newFamilyToAdd.children)
      newFamilyToAdd.children = validData.children.map(i => new ObjectId(i))

    const createdFamily = await GET_DB()
      .collection(FAMILY_COLLECTION_NAME)
      .insertOne(newFamilyToAdd)
    return createdFamily
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async familyId => {
  try {
    const result = await GET_DB()
      .collection(FAMILY_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(familyId)
      })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const familyModel = {
  FAMILY_COLLECTION_NAME,
  FAMILY_COLLECTION_SCHEMA,
  createNew,
  findOneById
}
module.exports = { familyModel }
