import mongoose from "mongoose";
const DBconnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "projex",
    })
    .then(() => {
      console.log("DB connected Successfully");
    })
    .catch((err) => {
      console.log("Failed to connect DB", err);
    });
};

export default DBconnection;
