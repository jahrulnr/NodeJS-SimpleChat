const { body } = require('express-validator');

exports.validateSendMessage = [
  body('to_id')
  .exists()
  .withMessage('to_id is required'),
  body('message')
  .exists()
  .withMessage('message is required')
]