const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

// GET /users — запрос всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

// GET /users/:userId - запрос пользователя по _id
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((getUser) => {
      if (!getUser) {
        return next(
          new NotFoundError('Пользователь по указанному _id не найден'),
        );
      }
      return res.send({ data: getUser });
    })
    .catch(next);
};

// GET /users/me - возвращает информацию о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send({ data: user });
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
    }).then(() => res.send({
      data: {
        name,
        about,
        avatar,
        email,
      },
    })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError('Переданы некорректные данные пользователя'),
        );
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
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updateUser) => {
      if (!updateUser) {
        return next(
          new NotFoundError('Пользователь с указанным _id не найден'),
        );
      }
      return res.send({ data: updateUser });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(
          new BadRequestError('Переданы некорректные данные пользователя'),
        );
      }
      return next(err);
    });
};

// PATCH /users/me/avatar — обновить аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updateUser) => {
      if (!updateUser) {
        return next(
          new NotFoundError('Пользователь с указанным _id не найден'),
        );
      }
      return res.send({ data: updateUser });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(
          new BadRequestError('Переданы некорректные данные пользователя'),
        );
      }
      return next(err);
    });
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
      return res.send({ token });
    })
    .catch(() => next(new UnauthorizedError('Неправильная почта или пароль')));
};
