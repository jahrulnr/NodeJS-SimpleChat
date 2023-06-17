const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const apiRouter = require('./routes/api');
const webRouter = require('./routes/web');
const ApiHttpException = require('./app/exceptions/ApiException');
const ApiServerException = require('./app/exceptions/ApiServerError');

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.options("*", cors());
const port = Number(process.env.PORT || 3331);
app.use('/api', apiRouter);
app.use('/', webRouter);

app.use(ApiServerException);
app.use((res, req, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
})
app.all('/api/*', (req, res, next) => {
  const err = new ApiHttpException(404, 'Endpoint Not Found');
  console.log(err)
  next(err);
  // res.send({
  //   message: "Page not found"
  // })
});
app.all('*', (req, res, next) => {
  const err = new ApiHttpException(404, 'Endpoint Not Found');
  console.log(err)
  next(err);
  // res.send({
  //   message: "Page not found"
  // })
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));

module.exports = app;