const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUser);
userRouter.patch('/users/me', updateUserInfo);
userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
