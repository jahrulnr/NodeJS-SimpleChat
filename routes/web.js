const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  res.send("What are you doing here?")
})

module.exports = router;