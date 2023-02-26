const addZero = require("add-zero");

const Request = (db, DataTypes) => {
  const RequestModel = db.define(
    "request",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
      client_id: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      updated_by: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      remainderDate: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      weeklyRemainder: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      threeRemainder: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tenRemainder: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      statusQues: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      statusDoc: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      lastDocumentSubmittedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      lastQuesSubmittedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      requestCompletedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      docFillupCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      quesFillupCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      /*       createdAt: {
        field: "createdAt",
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: "updatedAt",
        type: DataTypes.DATE,
      }, */
    },
    {
      underscored: false,
    }
  );
  RequestModel.addHook("afterCreate", async (client, options) => {
    let client_id = addZero(client.id, 4);
    // if (options) {
    //   if (options.params === "Rejected") {
    //     client_id = addZero(client.id, 4) + "00";
    //   }
    // }
    RequestModel.update(
      { client_id: client_id },
      {
        where: {
          id: client.id,
        },
      }
    );
  });
  return RequestModel;
};

module.exports = Request;
