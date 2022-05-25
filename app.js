const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;

const app = express();

mongoose
  .connect("mongodb://anna:dryanna@localhost:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB is connected"))
  .catch((err) => {
    console.log(err);
  });
// mongoose.connect("mongodb://anna:dryanna@localhost:27017/mestodb");

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
