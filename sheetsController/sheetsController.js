const express = require('express')
const router = express.Router()
const Sheets = require('../models/sheets')

// GET /sheets
router.get('/', async (req, res) => {
  try {
    const sheets = await Sheets.find()
    res.json({ sheets })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error getting datas' })
  }
})

const updateProperty = async (updateJob) => {
  const { recordId, propertyName, propertyValue } = updateJob

  try {
    const updatedJob = await Sheets.updateOne(
      { _id: recordId },
      { $set: { [propertyName]: propertyValue } },
    )
    if (updatedJob.nModified === 0) {
      console.log('Error updating data')
    }
    console.log('Data updated ')
    return await Sheets.find()
  } catch (error) {
    console.log('Error getting data')
  }
}
const deleteJob = async (recordId) => {
  try {
    const removedJob = await Sheets.findByIdAndDelete(recordId)
    if (!removedJob) {
      console.log('Error deleting data')
    }
    console.log('job deleted ')
    return await Sheets.find()
  } catch (error) {
    console.log('Error getting data')
  }
}
const addJob = async (job) => {
  try {
    const addedJob = await Sheets.create(job)
    console.log('job added ')
    return await Sheets.find()
  } catch (error) {
    console.log('Error getting data')
  }
}

module.exports = { router, updateProperty, deleteJob, addJob }
