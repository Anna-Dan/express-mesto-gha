const user = require('../models/user');
const handleError = require('../constants/handleErrorUser');

const {
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../constants/constants');

// GET /users — запрос всех пользователей
module.exports.getUsers = (req, res) => {
  user
    .find({})
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
  user
    .findById(req.params.userId)
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

// POST /users — создать пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user
    .create({ name, about, avatar })
    .then((createUser) => {
      res.status(200).send({ data: createUser });
    })
    .catch((err) => handleError(err, res));
};

// PATCH /users/me — обновить профиль
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  user
    .findByIdAndUpdate(
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

  user
    .findByIdAndUpdate(
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
