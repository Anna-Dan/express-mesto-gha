const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const handleError = require('../constants/handleErrorUser');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const {
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../constants/constants');

// GET /users — запрос всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(() => {
      res
        .status(ERROR_CODE_DEFAULT)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

// GET /users/:userId - запрос пользователя по _id
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((getUser) => {
      if (!getUser) {
        res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(200).send({ data: getUser });
      }
    })
    .catch((err) => handleError(err, res));
};

// GET /users/me - возвращает информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => next(err));
};

// POST /signup — создать пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return next(new NotFoundError('Не переданы email или пароль'));
  }
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }).then(() => res.status(200).send({
      data: {
        name,
        about,
        avatar,
        email,
      },
    })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные пользователя'));
      }
      if (err.code === 11000) {
        return next(
          new ConflictError('Пользователь с таким email уже зарегистрирован'),
        );
      }
      return next(err);
    });
};

// PATCH /users/me — обновить профиль
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updateUser) => {
      if (!updateUser) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(200).send({ data: updateUser });
    })
    .catch((err) => handleError(err, res));
};

// PATCH /users/me/avatar — обновить аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updateUser) => {
      if (!updateUser) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(200).send({ data: updateUser });
    })
    .catch((err) => handleError(err, res));
};

// /POST/signin - проверка логина и пароля
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Введите почту и пароль'));
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      return res.status(200).send({ token });
    })
    .catch(() => next(new UnauthorizedError('Неправильная почта или пароль')));
};
