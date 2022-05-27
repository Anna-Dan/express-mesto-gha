const card = require('../models/card');
const handleError = require('../constants/handleErrorCard');

const {
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../constants/constants');

// GET /cards — запрос на все карточки
module.exports.getCards = (req, res) => {
  card
    .find({})
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(() => {
      res
        .status(ERROR_CODE_DEFAULT)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

// POST /cards — создать карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  card
    .create({ name, link, owner })
    .then((newCard) => {
      res.status(200).send({ newCard });
    })
    .catch((err) => handleError(err, res));
};

// DELETE /cards/:cardId — удалить карточку
module.exports.deleteCard = (req, res) => {
  card
    .findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: ' Карточка с указанным _id не найдена.' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => handleError(err, res));
};

// PUT /cards/:cardId/likes — лайк
module.exports.likeCard = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((cards) => {
      if (!cards) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(200).send({ data: cards });
    })
    .catch((err) => handleError(err, res));
};

// DELETE /cards/:cardId/likes — убрать лайк
module.exports.dislikeCard = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((cards) => {
      if (!cards) {
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(200).send({ data: cards });
    })
    .catch((err) => handleError(err, res));
};
