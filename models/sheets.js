const mongoose = require('mongoose')
const { Schema } = mongoose

const sheetsSchema = new Schema({
  date: Date,
  appliedBy: String,
  source: String,
  company: String,
  title: String,
  rate: String,
  jd: String,
  jobLink: String,
  profile: String,
  status: String,
  interviewee: String,
  remarks: String,
})

const Sheets = mongoose.model('sheets', sheetsSchema)

module.exports = Sheets
