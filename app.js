/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { ERROR_CODE_NOT_FOUND } = require('./constants/constants');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose // вариант для локальной докер разработки
  .connect('mongodb://anna:dryanna@mongo:27017/mestodb?authSource=admin', {
    useNewUrlParser: true,
  })
  .then(() => console.log('Mongo is connected'))
  .catch((err) => {
    console.log(err);
  });

// mongoose // вариант для прохождения автотестов
//   .connect('mongodb://localhost:27017/mestodb', {
//     useNewUrlParser: true,
//   })
//   .then(() => console.log('Mongo is connected'))
//   .catch((err) => {
//     console.log(err);
//   });
app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

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
