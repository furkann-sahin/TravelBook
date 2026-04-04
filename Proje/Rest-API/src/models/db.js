var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

// When successfully connected
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to " + process.env.MONGODB_URI);
});

// If the connection throws an error
mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close().then(() => {
    process.exit(0);
  });
});

require("./user");
require("./company");
require("./guide");
require("./tour");
require("./review");
require("./purchase");
