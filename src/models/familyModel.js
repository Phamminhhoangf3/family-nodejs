const { ObjectId } = require('mongodb')
const { GET_DB } = require('../config/mongodb')

const FAMILY_COLLECTION_NAME = 'families'
const findOneById = async id =>
  await GET_DB()
    .collection(FAMILY_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) })

const Family = function (family) {
  this.type = family.type
  this.husband = family.husband
  this.wife = family.wife
  this.exWife = family.exWife
  this.children = family.children
}

Family.create = async (familyNew, result) => {
  try {
    const validDataToAdd = { ...familyNew }
    if (familyNew.husband) validDataToAdd.husband = new ObjectId(familyNew.husband)
    if (familyNew.wife) validDataToAdd.wife = new ObjectId(familyNew.wife)
    if (familyNew.exWife) validDataToAdd.exWife = new ObjectId(familyNew.exWife)
    if (familyNew.children.length) validDataToAdd.children.map(child => new ObjectId(child))
    const familyInserted = await GET_DB()
      .collection(FAMILY_COLLECTION_NAME)
      .insertOne(validDataToAdd)
    const familyCreated = await findOneById(familyInserted.insertedId)
    result(null, familyCreated)
  } catch (error) {
    result(error, null)
  }
}

Family.findOneById = async (id, result) => {
  try {
    const result = findOneById(id)
    result(null, result)
  } catch (error) {
    result(error, null)
  }
}

module.exports = Family
