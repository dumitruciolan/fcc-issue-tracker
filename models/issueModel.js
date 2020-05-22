"use strict";

const mongoose = require("mongoose");

// set user schema & model (user stories 2 & 3)
const IssueSchema = new mongoose.Schema({
    project: { type: String, required: true },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: { type: Date, default: new Date() },
    updated_on: { type: Date, default: new Date() },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: "" },
    open: { type: Boolean, default: true },
    status_text: { type: String, default: "" }
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
