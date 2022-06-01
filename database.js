const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(
    "mongodb+srv://admin:admin@cluster0.dhqr3.mongodb.net/test",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );

  console.log(`mongo connected: ${conn.connection.host}`);
};

module.exports = connectDB;
