const cardRouter = require('express').Router();
const {
  createCardValidation,
  cardIdValidation,
} = require('../middlewares/validations');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCardValidation, createCard);
cardRouter.delete('/cards/:cardId', cardIdValidation, deleteCard);
cardRouter.put('/cards/:cardId/likes', cardIdValidation, likeCard);
cardRouter.delete('/cards/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = cardRouter;
