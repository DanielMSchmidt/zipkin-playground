// Load environment from dotfile
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const {
  Tracer,
  BatchRecorder,
  jsonEncoder: { JSON_V2 }
} = require("zipkin");
const { HttpLogger } = require("zipkin-transport-http");
const CLSContext = require("zipkin-context-cls");
const zipkinMiddleware = require("zipkin-instrumentation-express")
  .expressMiddleware;

const zipkinHostPort = process.env.ZIPKIN_HOST_PORT || "http://localhost:9411";
const serviceName = process.env.SERVICE || "pleaseEnterServiceName";
const defaultTimeout = process.env.TIMEOUT
  ? parseInt(process.env.TIMEOUT, 10)
  : 0;

const app = express();
app.use(bodyParser.json());

const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: zipkinHostPort + "/api/v2/spans",
    jsonEncoder: JSON_V2,
    httpInterval: 1
  })
});
const tracer = new Tracer({
  ctxImpl: new CLSContext("zipkin"),
  recorder,
  localServiceName: serviceName
});

app.get("/health", (req, res) => {
  res.status(200);
  res.end();
});

app.use(zipkinMiddleware({ tracer }));
app.post("/", (req, res) => {
  const timeout = parseInt(req.query.timeout, 10) || defaultTimeout;

  setTimeout(() => {
    res
      .json(req.body)
      .status(200)
      .end();
  }, timeout);
});

app.listen(3000);
