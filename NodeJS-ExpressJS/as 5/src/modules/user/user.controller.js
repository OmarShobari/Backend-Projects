import { Op } from "sequelize";
import { User } from "../../../DB/models/user.model.js";

export const signUp = async (req, res, next) => {
  try {
    // data
    const { name, email, password, age } = req.body;

    // insert user to database
    await User.create({ name, email, password, age });

    // return res
    return res.json({ result: true, message: "user signed up!" });
  } catch (error) {
    return res.json({ result: false, message: error.errors[0].message });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const results1 = await User.findAll({
    where: {
      email,
    },
  });
  if (results1.length < 1) {
    return res.json({ result: false, message: "user not exist" });
  }
  const results2 = await User.findAll({
    where: {
      email,
      password,
    },
  });
  if (results2.length < 1) {
    return res.json({ result: false, message: "incorrect password" });
  }
  return res.json({ result: true, message: "login successfully" });
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, age } = req.body;
    const results1 = await User.findAll({
      where: {
        email,
      },
    });
    if (results1.length < 1) {
      return res.json({ result: false, message: "user not exist" });
    }
    await User.update(
      { name, email, password, age },
      {
        where: {
          email,
        },
      }
    );

    return res.json({ result: true, message: "user has been updated" });
  } catch (error) {
    return res.json({ result: false, message: error });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const results1 = await User.findAll({
      where: {
        email,
      },
    });
    if (results1.length < 1) {
      return res.json({ result: false, message: "user not exist" });
    }
    await User.destroy({
      where: {
        email,
      },
    });
    return res.json({ result: true, message: "user has been deleted" });
  } catch (error) {
    return res.json({ result: false, message: error });
  }
};

export const like = async (req, res, next) => {
  const { char, age } = req.query;
  const results = await User.findAll({
    where: {
      name: {
        [Op.like]: `${char}%`,
      },
      age: {
        [Op.lt]: age,
      },
    },
  });
  if (results.length < 1) {
    return res.json({ result: false, message: "no users exists" });
  }
  return res.json({ result: true, message: results });
};

export const between = async (req, res, next) => {
  const { mn, mx } = req.query;
  const results = await User.findAll({
    where: {
      age: {
        [Op.between]: [mn, mx],
      },
    },
  });
  if (results.length < 1) {
    return res.json({ result: false, message: "no users exists" });
  }
  return res.json({ result: true, message: results });
};

export const oldest = async (req, res, next) => {
  const { n } = req.query;
  const results = await User.findAll({
    order: [["age", "DESC"]], // Order by age in descending order
    limit: parseInt(n),
  });
  if (results.length < 1) {
    return res.json({ result: false, message: "no users exists" });
  }
  return res.json({ result: true, message: results });
};

export const idsIN = async (req, res, next) => {
  const ids = req.query.ids.split(",").map(Number);
  console.log(ids, typeof ids);
  const results = await User.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
  if (results.length < 1) {
    return res.json({ result: false, message: "no users exists" });
  }
  return res.json({ result: true, message: results });
};

export const all = async (req, res, next) => {
  const results1 = await User.findAll({});
  if (results1.length < 1) {
    return res.json({ result: false, message: "no users exists" });
  }
  return res.json({ result: true, message: results1 });
};
