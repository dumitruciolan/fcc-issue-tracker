"use strict";

const mongoose = require("mongoose");

// set user schema & model
const IssueSchema = new mongoose.Schema({
  project: String,
  issue_title: String,
  issue_text: String,
  created_on: Date,
  updated_on: Date,
  created_by: String,
  assigned_to: String,
  open: Boolean,
  status_text: String
}),
  Issue = mongoose.model("Issue", IssueSchema);

// connect to the database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// export model so we can access it from api.js
module.exports = mongoose.model("Issue", IssueSchema);
