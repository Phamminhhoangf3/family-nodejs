const { ObjectId } = require('mongodb')
const { GET_DB } = require('../config/mongodb')
const moment = require('moment')

const USER_COLLECTION_NAME = 'members'
const findOneById = async id =>
  await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) })

const Member = function (member) {
  this.tag = member.tag
  this.title = member.title
  this.type = member.type
  this.name = member.name
  this.fromDob = member.fromDob
  this.toDob = member.toDob
  this.family = member.family
  this.dad = member.dad
  this.image = member.image
}

Member.create = async (newMember, result) => {
  try {
    const validDataToAdd = { ...newMember }
    if (newMember.family) validDataToAdd.family = new ObjectId(newMember.family)
    const memberInserted = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validDataToAdd)
    const memberCreated = await findOneById(memberInserted.insertedId)
    result(null, memberCreated)
  } catch (error) {
    result(error, null)
  }
}

Member.findAll = async (filters, result) => {
  try {
    const query = { _destroy: false }
    if (filters?.keywords) query.userName = { $regex: filters.keywords, $options: 'i' }
    if (filters?.status !== undefined) query.active = filters.status
    if (filters?.fromDate && filters.toDate) {
      query.createdAt = {}
      if (filters?.fromDate)
        query.createdAt.$gte = moment(filters.fromDate).startOf('day').valueOf()
      if (filters?.toDate) query.createdAt.$lte = moment(filters.toDate).endOf('day').valueOf()
    }
    const res = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find(query, {
        projection: { _destroy: 0 }
      })
      .toArray()
    result(null, res)
  } catch (error) {
    result(error, null)
  }
}

Member.findOneById = async (id, result) => {
  try {
    const result = findOneById(id)
    result(null, result)
  } catch (error) {
    result(error, null)
  }
}

module.exports = Member
