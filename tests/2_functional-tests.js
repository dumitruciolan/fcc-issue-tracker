// -----[Keep the tests in the same order!]-----
// if additional are added, keep them at the very end!

const server = require("../server"),
  chaiHttp = require("chai-http"),
  chai = require("chai"),
  { assert } = chai;
chai.use(chaiHttp);

suite("Functional Tests", () => {
  let id1, id2;

  // functional test 1
  suite("POST /api/issues/{project} => object with issue data", () => {
    test("1. Every field filled in", done => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);

          assert.property(res.body, "_id");
          assert.property(res.body, "issue_title");
          assert.property(res.body, "issue_text");
          assert.property(res.body, "created_by");
          assert.property(res.body, "assigned_to");
          assert.property(res.body, "status_text");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          assert.property(res.body, "open");

          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          assert.equal(res.body.open, true);
        
          id1 = res.body._id;

          done();

          // chai
          //   .request(server)
          //   .post("/api/issues/test")
          //   .send({
          //     issue_title: "Title",
          //     issue_text: "text",
          //     created_by: "Functional Test - Every field filled in",
          //     assigned_to: "Chai and Mocha",
          //     status_text: "In QA"
          //   })
          //   .end((err, res) => {

          //     done();
          //   });
        });
    });

    // functional test 2
    test("2. Required fields filled in", done => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title: The 2nd Coming",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);

          assert.property(res.body, "_id");
          assert.property(res.body, "issue_title");
          assert.property(res.body, "issue_text");
          assert.property(res.body, "created_by");
          assert.property(res.body, "assigned_to");
          assert.property(res.body, "status_text");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          assert.property(res.body, "open");

          assert.equal(res.body.issue_title, "Title: The 2nd Coming");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.open, true);

          id2 = res.body._id;

          done();
        });
    });

    // functional test 3
    test("3. Missing required fields", done => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "missing inputs");
          done();
        });
    });
  });

  // functional test 4
  suite("PUT /api/issues/{project} => text", () => {
    test("4. No body", done => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id1
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "no updated field sent");
          done();
        });
    });

    // functional test 5
    test("5. One field to update", done => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id1,
          issue_text: "updated text"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "successfully updated");
          done();
        });

      // chai
      //   .request(server)
      //   .put("/api/issues/")
      //   .send({
      //     issue_title: "Title updated"
      //   })
      //   .end((err, res) => {
      //     assert.equal(res.status, 200);
      //     assert.isArray(res.body);
      //     assert.equal(res.body.issue_title, "Title updated");
      //     done();
      //   });
    });

    // functional test 6
    test("6. Multiple fields to update", done => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id2,
          status_text: "issue resolved",
          open: false
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "successfully updated");
          done();
        });

      // chai
      //   .request(server)
      //   .put("/api/issues/")
      //   .send({
      //     issue_title: "Title updated",
      //     issue_text: "text updated"
      //   })
      //   .end((err, res) => {
      //     assert.equal(res.status, 200);
      //     assert.isArray(res.body);
      //     assert.equal(res.body.issue_title, "Title updated");
      //     assert.equal(res.body.issue_text, "text updated");
      //     done();
      //   });
    });
  });

  // functional test 7
  suite("GET /api/issues/{project} => Array of objects with issue data", () => {
    test("7. No filter", done => {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "_id");
          done();
        });
    });

    // functional test 8
    test("8. One filter", done => {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ _id: id1 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "_id");
          done();
        });
    });

    // functional test 9
    test("9. Multiple filters (test for multiple fields you know will be in the db for a return)", done => {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ _id: id2, status_text: "issue resolved", open: false })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "_id");
          done();
        });
    });
  });

  // functional test 10
  suite("DELETE /api/issues/{project} => text", () => {
    test("10. No _id", done => {
      chai
        .request(server)
        .delete("/api/issues/test")
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.text, "_id error");
          done();
        });
    });

    // functional test 11
    test("11. Valid _id", done => {
      // Delete the other (ID 2) before we begin.
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({ _id: id2 });

      // The test based on the first ID.
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({ _id: id1 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, `deleted ${id1}`);
          done();
        });
    });
  });
});
