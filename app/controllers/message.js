const MessageModel = require('../models/message');
const HttpException = require('../exceptions/ApiException');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class MessageController {
  getAll = async (req, res, next) => {
    let messages = await MessageModel.find(req.currentUser.id);

    res.send(messages);
  };

  getChat = async (req, res, next) => {
    let messages = await MessageModel.findChat(req.currentUser.id, req.params.id, req.params.page ?? 0);

    res.send(messages);
  };

  send = async (req, res, next) => {
    this.checkValidation(req);

    const result = await MessageModel.send(req.currentUser.id, req.body);

    if (!result) {
      throw new HttpException(500, 'Something went wrong');
    }

    res.status(201).send('Message was created!');
  };

  checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new HttpException(400, 'Validation faild', errors);
    }
  }
}

module.exports = new MessageController;