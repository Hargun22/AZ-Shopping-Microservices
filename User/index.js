require("dotenv").config();

const { createServer } = require("./utils/server");
require("./utils/authStrategies");
const { pool } = require("./db");
const { userSchema } = require("./models/tableschema");

const connectDb = async () => {
  try {
    await pool.connect();
    console.log("connected to db");
  } catch (err) {
    console.log(err);
  }
};

const createTable = () => {
  const tableName = "users";

  pool
    .query(
      `SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = '${tableName}')`
    )
    .then((res) => {
      if (!res.rows[0].exists) {
        // create the table if it doesn't exist
        pool.query(userSchema);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

connectDb();
createTable();

const app = createServer();

app.listen(process.env.PORT || 5001, () => {
  console.log(`Listening on port ${process.env.PORT || 5001}`);
});
