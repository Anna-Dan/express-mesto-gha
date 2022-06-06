const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const {
  signUpValidation,
  signInValidation,
} = require('./middlewares/validations');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

// mongoose // вариант для локальной докер разработки
//   .connect('mongodb://anna:dryanna@mongo:27017/mestodb?authSource=admin', {
//     useNewUrlParser: true,
//   });

mongoose // вариант для прохождения автотестов
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.post('/signin', signInValidation, login);
app.post('/signup', signUpValidation, createUser);

app.use(auth);

app.use(cardRouter);
app.use(userRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

app.use(errors());
app.use(errorHandler);
