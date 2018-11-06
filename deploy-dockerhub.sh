#!/bin/bash

set -ex

docker build -t danielmschmidt/zipkin-playground-id ./id
docker build -t danielmschmidt/zipkin-playground-id:$(git rev-parse HEAD) ./id

docker build -t danielmschmidt/zipkin-playground-spread ./spread
docker build -t danielmschmidt/zipkin-playground-spread:$(git rev-parse HEAD) ./spread

docker push danielmschmidt/zipkin-playground-id
docker push danielmschmidt/zipkin-playground-id:$(git rev-parse HEAD)

docker push danielmschmidt/zipkin-playground-spread:latest
docker push danielmschmidt/zipkin-playground-spread:$(git rev-parse HEAD)

