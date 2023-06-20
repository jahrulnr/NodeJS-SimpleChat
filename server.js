const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const apiRouter = require('./routes/api');
const webRouter = require('./routes/web');
const ApiHttpException = require('./app/exceptions/ApiException');
const ApiServerException = require('./app/exceptions/ApiServerError');

const app = express();
dotenv.config();

const corsOpts = {
  origin: '*',
  methods: 'GET,OPTIONS,POST',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
  optionsSuccessStatus: 204
}

app.use(express.json());
app.use(cors(corsOpts));
app.options("*", cors(corsOpts));
const port = Number(process.env.PORT || 3331);
app.use('/api', apiRouter);
app.use('/', webRouter);

app.use(ApiServerException);
app.all('/api/*', (req, res, next) => {
  const err = new ApiHttpException(404, 'Endpoint Not Found');
  next(err);
});
app.all('*', (req, res, next) => {
  const err = new ApiHttpException(404, 'Endpoint Not Found');
  next(err);
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));

module.exports = app;