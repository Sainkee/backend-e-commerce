import mongoose from "mongoose";

function dbConnect() {
  try {
    mongoose.connect(process.env.SECRET_STRING).then((res) => {
      console.log("db connection successfull");
    });
  } catch (error) {
    console.log(error);
  }
}

export default dbConnect;
