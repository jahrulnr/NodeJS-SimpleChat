const FriendModel = require('../models/friend');
const HttpException = require('../exceptions/ApiException');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class FriendController {
  getAll = async (req, res, next) => {
    let friends = await FriendModel.find(req.currentUser.id);

    res.send(friends);
  };

  find = async (req, res, next) => {
    let friends = await FriendModel.search(req.currentUser.id, req.body.search);

    res.send(friends);
  };

  getFriend = async (req, res, next) => {
    if (isNaN(req.params.id)) {
      throw new HttpException(400, 'id not valid!');
    }
    let friend = await FriendModel.findFriend(req.currentUser.id, req.params.id);

    if (!friend) {
      throw new HttpException(400, 'Friend does\'nt exists!');
    }

    res.send(friend);
  };

  requestList = async (req, res, next) => {
    const result = await FriendModel.requestList(req.currentUser.id);

    res.send(result);
  };

  sendRequest = async (req, res, next) => {
    this.checkValidation(req);
    const result = await FriendModel.sendRequest(req.currentUser.id, req.body.friend_id);

    if (!result) {
      throw new HttpException(500, 'Something went wrong');
    }

    res.status(201).send('Friend request was created!');
  };

  acceptRequest = async (req, res, next) => {
    this.checkValidation(req);
    const result = await FriendModel.acceptRequest(req.currentUser.id, req.body.friend_id);

    if (!result) {
      throw new HttpException(500, 'Something went wrong');
    }

    res.status(201).send('Friend request accepted!');
  };

  declineRequest = async (req, res, next) => {
    this.checkValidation(req);
    const result = await FriendModel.declineRequest(req.currentUser.id, req.body.friend_id);

    if (!result) {
      throw new HttpException(500, 'Something went wrong');
    }

    res.status(201).send('Friend request declined!');
  };

  banFriend = async (req, res, next) => {
    this.checkValidation(req);
    const result = await FriendModel.banFriend(req.currentUser.id, req.body.friend_id);

    if (!result) {
      throw new HttpException(500, 'Something went wrong');
    }

    res.status(201).send('Friend has been banned!');
  };

  checkValidation = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new HttpException(400, 'Validation faild', errors);
    }
  }
}

module.exports = new FriendController;