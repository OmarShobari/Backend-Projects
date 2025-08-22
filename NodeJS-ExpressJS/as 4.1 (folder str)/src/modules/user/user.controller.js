import { connection } from "../../../DB/connection.js";
export const existUser = function (req, res, next) {
  //middleware (user must be found)
  const { email } = req.body;
  connection.query(
    `SELECT * FROM users WHERE email = '${email}'`,
    function (err, results, fields) {
      if (err) {
        console.error("Checking Error for existing user:", err);
        return;
      }
      // Add user details to request for later use
      req.userData = results[0];

      if (results.length > 0) {
        req.find = true;
      } else {
        req.find = false;
      }
      return next();
    }
  );
};
export const addUser = (req, res, next) => {
  if (req.find == true) {
    return res.json({ success: false, result: "User already exists" });
  }
  const { name, email, password, age } = req.body;
  connection.query(
    `INSERT INTO users (name, email, password, age) VALUES ('${name}','${email}','${password}',${age})`,
    function (err, results, fields) {
      if (err) {
        console.error("Error adding new user:", err);
        return;
      }

      if (results.affectedRows > 0) {
        return res.json({
          success: true,
          result: "User is added successfully",
        });
      } else {
        return res.json({
          success: false,
          result: "Failed: User has not been added!!",
        });
      }
    }
  );
};
export const updateUser = (req, res, next) => {
  if (req.find == false)
    return res.json({ success: false, result: "User not exists" });
  const { name, email, password, age } = req.body;
  connection.query(
    `INSERT INTO users (name, email, password, age) VALUES ('${name}','${email}','${password}',${age})`,
    function (err, results, fields) {
      if (err) {
        console.error("Error adding new user:", err);
        return;
      }

      if (results.affectedRows > 0) {
        return res.json({
          success: true,
          result: "User is added successfully",
        });
      } else {
        return res.json({
          success: false,
          result: "Failed: User has not been added!!",
        });
      }
    }
  );
};
export const deleteUser = (req, res, next) => {
  if (req.find == false)
    return res.json({ success: false, result: "User not exists" });
  const { email } = req.body;
  connection.query(
    `DELETE FROM users WHERE email = '${email}'`,
    function (err, results, fields) {
      if (err) {
        console.error("Error deleting user:", err);
        return;
      }
      if (results.affectedRows > 0) {
        return res.json({
          success: true,
          result: "User is deleted successfully",
        });
      } else {
        return res.json({
          success: false,
          result: "Failed: User has not been deleted!!",
        });
      }
    }
  );
};
export const searchLike = (req, res, next) => {
  connection.query(
    `SELECT * FROM users WHERE name LIKE 'a%' AND age < 30`,
    function (err, results, fields) {
      if (err) {
        console.error("Error searching user:", err);
        return;
      }
      if (results.length > 0) {
        return res.json({
          success: true,
          result: { users: results },
        });
      } else {
        return res.json({
          success: false,
          result: "no users exist!",
        });
      }
    }
  );
};
export const searchIn = (req, res, next) => {
  const ids = req.query.ids;
  connection.query(
    `SELECT * FROM users WHERE id IN (${ids})`,
    function (err, results, fields) {
      if (err) {
        console.error("Error searching user:", err);
        return;
      }
      if (results.length > 0) {
        return res.json({
          success: true,
          result: { users: results },
        });
      } else {
        return res.json({
          success: false,
          result: "no users exist!",
        });
      }
    }
  );
};
export const getAll = (req, res, next) => {
  connection.query(`SELECT * FROM users`, function (err, results, fields) {
    if (err) {
      console.error("Error searching user:", err);
      return;
    }
    if (results.length > 0) {
      return res.json({
        success: true,
        result: { users: results },
      });
    } else {
      return res.json({
        success: false,
        result: "no users exist!",
      });
    }
  });
};
export const getJoin = (req, res, next) => {
  connection.query(
    `SELECT users.id AS userId, users.name AS userName, users.email, users.password, users.age,
    products.pid, products.pName, products.pDescription, products.price
    FROM users
    LEFT JOIN products ON users.id = products.createdby`,
    function (err, results, fields) {
      if (err) {
        console.error("Error searching user:", err);
        return;
      }
      if (results.length > 0) {
        return res.json({
          success: true,
          result: { users: results },
        });
      } else {
        return res.json({
          success: false,
          result: "no users exist!",
        });
      }
    }
  );
};
