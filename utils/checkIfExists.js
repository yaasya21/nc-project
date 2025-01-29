const db = require("../db/connection");
const format = require("pg-format");

exports.checkIfExists = async (id, table, column) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const dbOutput = await db.query(queryStr, [id]);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, msg: `${column} not found` });
  } else {
    return dbOutput.rows;
  }
};
