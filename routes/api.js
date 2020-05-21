"use strict";

const Issue = require("../models/issueModel"),
  mongoose = require("mongoose"),
  { expect } = require("chai");

// prev
let issues = [];
const shortid = require("shortid");

module.exports = app => {
  app
    .route("/api/issues/:project")

    .get((req, res) => {
      const { project } = req.params;

      const issues = Issue.find(
        { project },
        { project: false, _v: false },
        (err, docs) => {
          if (err)
            res.status(404).json(`No issues could be found for this project.`);
          res.status(200).json(docs);
        }
      );

      //       // prev
      //       let {
      //         _id,
      //         issue_title,
      //         issue_text,
      //         created_by,
      //         assigned_to,
      //         status_text,
      //         open
      //       } = req.query;

      //       const sentIssues = [...issues];

      //       if (_id) {
      //         sentIssues = sentIssues.filter(issue => issue._id === _id);
      //       }

      //       if (issue_title) {
      //         sentIssues = sentIssues.filter(
      //           issue => issue.issue_title === issue_title
      //         );
      //       }

      //       if (issue_text) {
      //         sentIssues = sentIssues.filter(
      //           issue => issue.issue_text === issue_text
      //         );
      //       }

      //       if (created_by) {
      //         sentIssues = sentIssues.filter(
      //           issue => issue.created_by === created_by
      //         );
      //       }

      //       if (assigned_to) {
      //         sentIssues = sentIssues.filter(
      //           issue => issue.assigned_to === assigned_to
      //         );
      //       }

      //       if (status_text) {
      //         sentIssues = sentIssues.filter(
      //           issue => issue.status_text === status_text
      //         );
      //       }

      //       if (open) {
      //         open = open === "false" ? false : true;
      //         sentIssues = sentIssues.filter(issue => issue.open === open);
      //       }

      //       return res.json(sentIssues);
    })

    .post((req, res) => {
      const { project } = req.params;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;

      const issue = new Issue({
        project,
        issue_title,
        issue_text,
        created_on: Date.now(),
        updated_on: Date.now(),
        created_by,
        assigned_to,
        open: true,
        status_text
      });

      issue
        .save()
        // .then(d => console.log(`The issue ${d.issueTitle} was added.`))
        .then(response => {
          const data = {
            _id: response._id,
            issue_title: response.issue_title,
            issue_text: response.issue_text,
            created_on: response.created_on,
            updated_on: response.updated_on,
            created_by: response.created_by,
            assigned_to: response.assigned_to,
            open: response.open,
            status_text: response.status_text
          };

          return res.status(200).json(data);
        })
        .catch(err => console.log("there was an error: ", err));

      // prev
      //       const {
      //         issue_title,
      //         issue_text,
      //         created_by,
      //         assigned_to,
      //         status_text
      //       } = req.body;

      //       const newIssue = {
      //         issue_title,
      //         issue_text,
      //         created_by,
      //         assigned_to,
      //         status_text,
      //         created_on: new Date(),
      //         updated_on: new Date(),
      //         open: true,
      //         _id: shortid.generate()
      //       };

      //       issues.push(newIssue);

      //       res.json(newIssue);
    })

    .put((req, res) => {
      const {
        _id: id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.body;

      if (!id) res.status(400).send("_id error");

            if (
              !issue_title &&
              !issue_text &&
              !created_by &&
              !assigned_to &&
              !status_text &&
              !open
            ) {
              return res.status(400).send("no updated field sent");
            }

      const issue = new Issue(req.body);
      issue.updated_on = Date.now();

      Issue.findByIdAndUpdate(id, issue, { new: true }, (err, doc) => {
        if (err) res.status(404).send(`could not update ${id}`);
        res.status(200).send("successfully updated");
      });

      //       let updated = false;

      //       // map over the issues and change where _id from the issue is === _id provided
      //       issues = issues.map(issue => {
      //         if (issue._id === _id) {
      //           const { created_on } = issue;

      //           updated = true;

      //           return {
      //             _id,
      //             created_on,
      //             updated_on: new Date(),
      //             created_by: created_by !== "" ? created_by : issue.created_by,
      //             issue_title: issue_title !== "" ? issue_title : issue.issue_title,
      //             issue_text: issue_text !== "" ? issue_text : issue.issue_text,
      //             assigned_to: assigned_to !== "" ? assigned_to : issue.assigned_to,
      //             status_text: status_text !== "" ? status_text : issue.status_text,
      //             open: open === undefined ? false : true
      //           };
      //         }
      //         return issue;
      //       });

      //       if (!updated) {
      //         return res.json({ error: `Could not update ${_id}` });
      //       }

      //       res.json({ success: "successfully updated" });
    })

    // delete an issue
    .delete((req, res) => {
      const { project } = req.params;
      const { _id: id } = req.body;

      if (!id) return res.status(400).send("_id error");

      Issue.findByIdAndDelete(id, (err, doc) => {
        if (err) res.status(500).send(`could not delete ${id}`);
        res.status(200).send(`deleted ${id}`);
      });
    });
};

// compare index.html