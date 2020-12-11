let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");

// Assertion style
chai.should();
chai.use(chaiHttp);

describe("Users Resources", () => {
  // Test the GET route
  describe("GET /api/users", () => {
    it("should GET all the users", (done) => {
      chai
        .request(server)
        .get("/api/task")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          response.body.length.should.be.eq(3);
          done();
        });
    });
  });
});
