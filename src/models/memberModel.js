const { ObjectId } = require('mongodb')
const { GET_DB } = require('../config/mongodb')

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
}

Member.create = async (newMember, result) => {
  try {
    const validDataToAdd = { ...newMember, family: new ObjectId(newMember.family) }
    const memberInserted = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validDataToAdd)
    const memberCreated = await findOneById(memberInserted.insertedId)
    result(null, memberCreated)
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
