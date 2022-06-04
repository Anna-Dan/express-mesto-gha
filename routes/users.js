const userRouter = require('express').Router();
const {
  userIdValidation,
  updateUserValidation,
  updateAvatarValidation,
} = require('../middlewares/validations');
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/users/me', getCurrentUser);
userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', userIdValidation, getUser);
userRouter.patch('/users/me', updateUserValidation, updateUserInfo);
userRouter.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = userRouter;
