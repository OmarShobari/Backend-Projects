import { connection } from "../../../DB/connection.js";

export const existProduct = function (req, res, next) {
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
export const owner = function (req, res, next) {
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
export const addProduct = (req, res, next) => {
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
};
export const deleteProduct = (req, res, next) => {
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
};
export const updateProduct = (req, res, next) => {
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
};
export const getAll = (req, res, next) => {
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
};
export const search = (req, res, next) => {
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
};
