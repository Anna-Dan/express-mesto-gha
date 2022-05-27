/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { ERROR_CODE_NOT_FOUND } = require('./constants/constants');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '628e6eeb335ebab5307032fc',
  };

  next();
});

// mongoose // вариант для локальной докер разработки
//   .connect('mongodb://anna:dryanna@mongo:27017/mestodb?authSource=admin', {
//     useNewUrlParser: true,
//   })
//   .then(() => console.log('Mongo is connected'))
//   .catch((err) => {
//     console.log(err);
//   });

mongoose // вариант для прохождения автотестов
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => console.log('Mongo is connected'))
  .catch((err) => {
    console.log(err);
  });

app.use(cardRouter);
app.use(userRouter);

app.use('*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({
    message: 'Такой страницы не существует',
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
