import { Note } from "../../../DB/models/note.model.js";
import { User } from "../../../DB/models/user.model.js";

export const addNote = async (req, res, next) => {
  const { title, content, userId } = req.body;
  const results1 = await User.findAll({
    where: {
      id: userId,
    },
  });
  if (results1.length < 1) {
    return res.json({ result: false, message: "user should exist" });
  }
  await Note.create({ title, content, userId });
  return res.json({ result: true, message: "note has added!" });
};
export const deleteNote = async (req, res, next) => {
  try {
    const { id, userId } = req.query;
    const results1 = await Note.findAll({
      where: {
        id,
      },
    });
    if (results1.length < 1) {
      return res.json({ result: false, message: "note not exist" });
    }
    const results2 = await Note.findAll({
      where: {
        id,
        userId,
      },
    });
    if (results2.length < 1) {
      return res.json({ result: false, message: "owner only can delete" });
    }
    await Note.destroy({
      where: {
        id,
        userId,
      },
    });

    return res.json({ result: true, message: "note has been deleted" });
  } catch (error) {
    return res.json({ result: false, message: error });
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id, userId } = req.query;
    const results1 = await Note.findAll({
      where: {
        id,
      },
    });
    if (results1.length < 1) {
      return res.json({ result: false, message: "note not exist" });
    }
    const results2 = await Note.findAll({
      where: {
        id,
        userId,
      },
    });
    if (results2.length < 1) {
      return res.json({ result: false, message: "owner only can update" });
    }

    const { newID, title, content, newUser } = req.body;
    //console.log(newID, title, content, newUser);
    const results3 = await User.findAll({
      where: {
        id: newUser,
      },
    });
    if (results3.length < 1) {
      return res.json({ result: false, message: "user not exist" });
    }
    await Note.update(
      { id: newID, title, content, userId: newUser },
      {
        where: {
          id,
        },
      }
    );

    return res.json({ result: true, message: "note has been updated" });
  } catch (error) {
    return res.json({ result: false, error });
  }
};
export const getAll = async (req, res, next) => {
  const results1 = await Note.findAll({});
  if (results1.length < 1) {
    return res.json({ result: false, message: "no notes exists" });
  }
  return res.json({ result: true, message: results1 });
};
export const getJoin = async (req, res, next) => {
  const results = await Note.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "name", "email"],
      },
    ],
  });
  if (results.length < 1) {
    return res.json({ result: false, message: "no notes exists" });
  }

  return res.json({ result: true, message: results });
};
