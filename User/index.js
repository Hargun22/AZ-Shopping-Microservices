require("dotenv").config();
const mongoose = require("mongoose");
const { createServer } = require("./utils/server");
require("./utils/authStrategies");

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("Error connecting to database");
    } else {
      console.log("Connected to database");
    }
  }
);

const app = createServer();

app.listen(process.env.PORT || 5001, () => {
  console.log(`Listening on port ${process.env.PORT || 5001}`);
});
