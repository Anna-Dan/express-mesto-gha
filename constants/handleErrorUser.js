const { ERROR_CODE_BAD_REQUEST, ERROR_CODE_DEFAULT } = require('./constants');

module.exports.handleError = (err, res) => {
  if (err.name === 'ValidationError') {
    return res
      .status(ERROR_CODE_BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные пользователя' });
  }
  if (err.name === 'CastError') {
    return res
      .status(ERROR_CODE_BAD_REQUEST)
      .send({ message: 'Передан некорректный _id пользователя.' });
  }
  return res
    .status(ERROR_CODE_DEFAULT)
    .send({ message: 'На сервере произошла ошибка' });
};