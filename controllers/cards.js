const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// GET /cards — запрос на все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(next);
};

// POST /cards — создать карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCard) => {
      res.status(200).send({ newCard });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError('Переданы некорректные данные карточки'),
        );
      }
      return next(err);
    });
};

// DELETE /cards/:cardId — удалить карточку
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError('Вы не можете удалить чужую карточку'));
      }
      return res
        .status(200)
        .send({ data: card, message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы невалидные данные карточки'));
      }
      return next(err);
    });
};

// PUT /cards/:cardId/likes — лайк
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      return res.status(200).send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы невалидные данные карточки'));
      }
      return next(err);
    });
};

// DELETE /cards/:cardId/likes — убрать лайк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      return res.status(200).send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы невалидные данные карточки'));
      }
      return next(err);
    });
};
