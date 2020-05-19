/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const mongoose = require("mongoose");

// prev
let issues = [];
const shortid = require("shortid");

//   const MongoClient = require("mongodb"),
//   ObjectId = require("mongodb").ObjectID,
// // const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

// pre
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const IssueSchema = new mongoose.Schema({
  issueTitle: String,
  issueText: String,
  createdBy: String,
  assignedTo: String,
  statusText: String
});

const Issue = mongoose.model("Issue", IssueSchema);

module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(function(req, res) {
    
      // prev
      var project = req.params.project;
    })

    .post(function(req, res) {
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;

      const newIssue = {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
        _id: shortid.generate()
      };

      issues.push(newIssue);

      res.json(newIssue);
      // prev
      const { project } = req.params;
      // or change it in the HTML file?
      const {
        issue_title: issueTitle,
        issue_text: issueText,
        created_by: createdBy,
        assigned_to: assignedTo,
        status_text: statusText
      } = req.body;

      const issue = new Issue({
        issueTitle,
        issueText,
        createdBy,
        assignedTo,
        statusText
      });

      issue
        .save()
        .then(d => console.log(`The issue ${d.issueTitle} was added.`))
        .catch(err => console.log("there was an error: ", err));
    })

    .put(function(req, res) {
      var project = req.params.project;

      let updated = false;

      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.body;

      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ) {
        return res.json({ error: "no updated field sent" });
      }

      // map over the issues and change where _id from the issue is === _id provided
      issues = issues.map(issue => {
        if (issue._id === _id) {
          const { created_on } = issue;

          updated = true;

          return {
            _id,
            created_on,
            updated_on: new Date(),
            created_by: created_by !== "" ? created_by : issue.created_by,
            issue_title: issue_title !== "" ? issue_title : issue.issue_title,
            issue_text: issue_text !== "" ? issue_text : issue.issue_text,
            assigned_to: assigned_to !== "" ? assigned_to : issue.assigned_to,
            status_text: status_text !== "" ? status_text : issue.status_text,
            open: open === undefined ? false : true
          };
        }
        return issue;
      });

      if (!updated) {
        return res.json({ error: `Could not update ${_id}` });
      }

      res.json({ success: "successfully updated" });
    })

    .delete(function(req, res) {
      var project = req.params.project;

      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: "no id provided" });
      }

      const lenBefore = issues.length;

      issues.filter(issue => issue._id !== _id);

      const lenAfter = issues.length;

      // successfully deleted
      if (lenBefore !== lenAfter) {
        res.json({ success: `deleted id: ${_id}` });
      } else {
        return res.json({ error: `could not delete ${_id}` });
      }
    });
};
