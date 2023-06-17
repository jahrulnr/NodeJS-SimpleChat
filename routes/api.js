const express = require('express');
const router = express.Router();
const { validateLogin } = require('../app/validators/user');
const { validateSendMessage } = require('../app/validators/message');
const auth = require('../app/middleware/auth');
const awaitHandlerFactory = require('../app/middleware/awaitHandlerFactory');
const userController = require('../app/controllers/user');
const messageController = require('../app/controllers/message');
const friendController = require('../app/controllers/friend');
const role = require('../config/role');

// router.
router.post('/login', validateLogin, awaitHandlerFactory(userController.userLogin));

router.get('/users/active', auth(role.SuperUser), awaitHandlerFactory(userController.setActive))

router.get('/friends', auth(), awaitHandlerFactory(friendController.getAll))
router.get('/friends/request', auth(), awaitHandlerFactory(friendController.requestList))
router.post('/friends/request', auth(), awaitHandlerFactory(friendController.sendRequest))
router.post('/friends/accept', auth(), awaitHandlerFactory(friendController.acceptRequest))
router.post('/friends/decline', auth(), awaitHandlerFactory(friendController.declineRequest))
router.post('/friends/ban', auth(), awaitHandlerFactory(friendController.banFriend))
router.get('/friends/:id', auth(), awaitHandlerFactory(friendController.getFriend))

router.get('/messages', auth(), awaitHandlerFactory(messageController.getAll))
router.post('/messages', auth(), validateSendMessage, awaitHandlerFactory(messageController.send))
router.get('/messages/:id', auth(), awaitHandlerFactory(messageController.getChat))
router.get('/messages/:id/:page', auth(), awaitHandlerFactory(messageController.getChat))

module.exports = router;