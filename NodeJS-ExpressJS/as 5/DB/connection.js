import Sequelize from "sequelize";

export const sequelize = new Sequelize("as5", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export const syncTable = async () => {
  return await sequelize.sync();
};
