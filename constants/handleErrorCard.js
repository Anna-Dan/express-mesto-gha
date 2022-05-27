const { ERROR_CODE_BAD_REQUEST, ERROR_CODE_DEFAULT } = require('./constants');

module.exports.handleError = (err, res) => {
  if (err.name === 'ValidationError') {
    return res
      .status(ERROR_CODE_BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные карточки' });
  }
  if (err.name === 'CastError') {
    return res
      .status(ERROR_CODE_BAD_REQUEST)
      .send({ message: 'Переданы невалидные данные карточки' });
  }
  return res
    .status(ERROR_CODE_DEFAULT)
    .send({ message: 'На сервере произошла ошибка' });
};
