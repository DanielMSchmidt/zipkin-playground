// Load environment from dotfile
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const uninstrumentedFetch = require("node-fetch");
const {
  Tracer,
  BatchRecorder,
  jsonEncoder: { JSON_V2 }
} = require("zipkin");
const { HttpLogger } = require("zipkin-transport-http");
const CLSContext = require("zipkin-context-cls");
const zipkinMiddleware = require("zipkin-instrumentation-express")
  .expressMiddleware;
const wrapFetch = require("zipkin-instrumentation-fetch");

const zipkinHostPort = process.env.ZIPKIN_HOST_PORT || "http://localhost:9411";
const serviceName = process.env.SERVICE || "pleaseEnterServiceName";

const app = express();
app.use(bodyParser.json());

const defaultDelay = process.env.DELAY ? parseInt(process.env.DELAY, 10) : 0;
const defaultTimeout = process.env.TIMEOUT
  ? parseInt(process.env.TIMEOUT, 10)
  : 0;

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
// TODO: Check if the spans are set correctly
app.post("/", (req, res) => {
  const timeout = parseInt(req.query.timeout, 10) || defaultTimeout;
  const promises = req.body.map(
    endpointConfig =>
      new Promise((resolve, reject) => {
        const delay = parseInt(endpointConfig.delay, 10) || defaultDelay;
        setTimeout(() => {
          const fetch = wrapFetch(uninstrumentedFetch, {
            tracer,
            remoteServiceName: endpointConfig.serviceName
          });
          fetch(endpointConfig.endpoint, {
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
            },
            method: "POST",
            body: endpointConfig.body
          })
            .then(res => res.json())
            .then(function(res) {
              resolve(res);
            })
            .then(function(json) {
              reject(json);
            });
        }, delay);
      })
  );

  Promise.all(promises).then(
    results => {
      setTimeout(() => {
        res
          .json(results)
          .status(200)
          .end();
      }, timeout);
    },
    rejects => {
      res
        .json(rejects)
        .status(500)
        .end();
    }
  );
});

app.listen(4000);
