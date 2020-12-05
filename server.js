const restify = require("restify");
const mongoose = require("mongoose");
const config = require("./config/config");

// Create server
const server = restify.createServer();

// Create middleware
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

let options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

// Start server
server.listen(config.PORT, () => {
  mongoose.connect(config.MONGODB_URI, options);
});

const db = mongoose.connection;

// DB error handler
db.on("error", (err) => console.log(err));

// Open connection
db.once("open", () => {
  require("./routes/users")(server);
  require("./routes/notes")(server);
  console.log(`Server started on port ${config.PORT}`);
});
