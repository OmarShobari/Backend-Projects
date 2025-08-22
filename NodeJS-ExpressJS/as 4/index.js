import express from "express";
import mysql from "mysql2";
const app = express();
const port = 3000;
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "assignment_3",
});

const existUser = function (req, res, next) {
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
const existProduct = function (req, res, next) {
  var pid;
  if (req.query.pid != undefined) {
    pid = Number(req.query.pid);
  } else {
    pid = req.body.pid;
  }
  connection.query(
    `SELECT * FROM products WHERE pid = ${pid}`,
    function (err, results, fields) {
      if (err) {
        console.error("Checking Error for existing product:", err);
        return;
      }
      // Add product details to request for later use
      req.userProd = results[0];

      if (results.length > 0) {
        req.find = true;
      } else {
        req.find = false;
      }
      return next();
    }
  );
};
const owner = function (req, res, next) {
  //middleware product owner only can do this
  const { pid } = req.query;
  const { createdby } = req.query;
  connection.query(
    `SELECT * FROM products WHERE createdby = ${createdby} AND pid = ${pid}`,
    function (err, results, fields) {
      if (err) {
        console.error("Error checking for existing product:", err);
        return;
      }

      if (results.length > 0) {
        req.owner = true;
      } else {
        req.owner = false;
      }
      next();
    }
  );
};

// -user APIs-
// 1- add user (user must not found before)
app.post("/users", existUser, (req, res, next) => {
  req.if(req.find == true);
  return res.json({ success: false, result: "User already exists" });
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
});
// 2- update user
app.put("/users", existUser, (req, res, next) => {
  if (req.find == false)
    return res.json({ success: false, result: "User not exists" });
  const { name, email, password, age } = req.body;
  connection.query(
    `UPDATE users SET name = '${name}', email = '${email}', password = '${password}', age = ${age} WHERE email = '${email}'`,
    function (err, results, fields) {
      if (err) {
        console.error("Error editing user:", err);
        return;
      }

      if (results.affectedRows > 0) {
        return res.json({
          success: true,
          result: "User is updated successfully",
        });
      } else {
        return res.json({
          success: false,
          result: "Failed: User has not been updated!!",
        });
      }
    }
  );
});
// 3- delete user(user must be found)
app.delete("/users", existUser, (req, res, next) => {
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
});
// 4- search for user where his name start with "a" and age less than 30 => using like for characters
app.get("/users/like", (req, res, next) => {
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
});
// 5- search for users by list of ids => using IN
app.get("/users/id", (req, res, next) => {
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
});
// 6- get all user
app.get("/users/all", (req, res, next) => {
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
});
// 7- get all users with products (join)
app.get("/users/join", (req, res, next) => {
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
});

// -product APIs-
// 1- add product(product must not found before)
app.post("/products", existProduct, (req, res, next) => {
  if (req.find == true)
    return res.json({ success: false, result: "Product already exists" });
  const { pid, pName, pDescription, price, createdby } = req.body;
  connection.query(
    `INSERT INTO products (pid, pName, pDescription, price,createdby) VALUES (${pid},'${pName}','${pDescription}',${price},${createdby})`,
    function (err, results, fields) {
      if (err) {
        console.error("Error adding new product:", err);
        return;
      }

      if (results.affectedRows > 0) {
        return res.json({
          success: true,
          result: "product is added successfully",
        });
      } else {
        return res.json({
          success: false,
          result: "Failed: product has not been added!!",
        });
      }
    }
  );
});
// 2- delete product (product owner only can do this and product must be found )
app.delete("/products", existProduct, owner, (req, res, next) => {
  if (req.find == false)
    return res.json({ success: false, result: "Product not exists" });
  if (req.owner == false)
    return res.json({ success: false, result: "Owner only can access" });

  const { pid } = req.query;
  connection.query(
    `DELETE from products WHERE pid = ${pid}`,
    function (err, results, fields) {
      if (err) {
        console.error("Error checking for existing product:", err);
        return;
      }
      if (results.affectedRows > 0) {
        return res.json({
          success: true,
          result: "product is deleted successufly",
        });
      } else {
        return res.json({
          success: false,
          result: "product has not been deleted",
        });
      }
    }
  );
});
// 3- update product (product owner only) and product must be found
app.put("/products", existProduct, owner, (req, res, next) => {
  if (req.find == false)
    return res.json({ success: false, result: "Product not exists" });
  if (req.owner == false)
    return res.json({ success: false, result: "Owner only can access" });
  console.log(req.owner);
  const { pid } = req.query;
  const { newID, pName, pDescription, price, createdby } = req.body;
  connection.query(
    `UPDATE products
      SET pid = ${newID} ,pName ='${pName}',pDescription = '${pDescription}', price = ${price}, createdby = ${createdby} 
      WHERE pid = ${pid}`,
    function (err, results, fields) {
      if (err) {
        console.error("Error checking for existing product:", err);
        return;
      }
      if (results.affectedRows > 0) {
        return res.json({
          success: true,
          result: "product is updated successufly",
        });
      } else {
        return res.json({
          success: false,
          result: "product has not been updated",
        });
      }
    }
  );
});
// 4- get all products
app.get("/products/all", (req, res, next) => {
  connection.query(`SELECT * FROM products`, function (err, results, fields) {
    if (err) {
      console.error("Error searching product:", err);
      return;
    }
    if (results.length > 0) {
      return res.json({
        success: true,
        result: { products: results },
      });
    } else {
      return res.json({
        success: false,
        result: "no products exist!",
      });
    }
  });
});
// 5- search for products where price greater than 3000
app.get("/products", (req, res, next) => {
  connection.query(
    `SELECT * FROM products
  WHERE price > 3000`,
    function (err, results, fields) {
      if (err) {
        console.error("Error searching product:", err);
        return;
      }
      if (results.length > 0) {
        return res.json({
          success: true,
          result: { products: results },
        });
      } else {
        return res.json({
          success: false,
          result: "no products exist!",
        });
      }
    }
  );
});

app.listen(port, () => {
  console.log("app is running on port", port);
});
