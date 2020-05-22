"use strict";

const Issue = require("../models/issueModel"),
  mongoose = require("mongoose"),
  { expect } = require("chai");

module.exports = app => {
  app
    .route("/api/issues/:project")

    // user story 6
    .get((req, res, next) => {
      let {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.query;
      const { project } = req.params;
      req.query.project = project;

      Issue.find(req.query, (err, issues) => {
        // failed
        if (err) return next(err);
        // success
        if (issues) return res.status(200).json(issues);
      });
    })

    // user stories 2 & 3
    .post((req, res) => {
      const { project } = req.params,
        {
          issue_title,
          issue_text,
          created_on,
          updated_on,
          created_by,
          assigned_to,
          open,
          status_text
        } = req.body,
        issue = new Issue({
          project,
          issue_title,
          issue_text,
          created_on,
          updated_on,
          created_by,
          assigned_to,
          open,
          status_text
        });

      // add a new issue
      issue
        .save()
        // success
        .then(response => res.status(200).json(response))
        // failed
        .catch(() => res.status(200).send("missing inputs"));
    })

    // user story 4
    .put((req, res, next) => {
      const { _id } = req.body;

      // no id sent
      !_id ? res.status(400).send("_id error") : delete req.body._id;

      // no fields sent
      if (Object.keys(req.body).length < 1)
        return res.status(200).send("no updated field sent");

      // always update updated_on
      req.body.updated_on = new Date();

      Issue.findByIdAndUpdate(_id, req.body, (err, doc) => {
        // failed
        if (err) return next(err);
        // success
        if (doc) return res.status(200).send("successfully updated");
        return res.status(404).send(`could not update ${_id}`);
      });
    })

    // 5. delete an issue
    .delete((req, res) => {
      const { _id } = req.body;

      //  no id sent
      if (!_id) return res.status(400).send("_id error");

      Issue.findByIdAndDelete(_id, (err, doc) => {
        // failed
        if (err) return res.status(500).send(`could not delete ${_id}`);
        // success
        return res.status(200).send(`deleted ${_id}`);
      });
    });
};
