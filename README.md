# Zipkin Opentracing Playground [![Build Status](https://travis-ci.org/DanielMSchmidt/zipkin-playground.svg?branch=master)](https://travis-ci.org/DanielMSchmidt/zipkin-playground)

This is a repo full of examples with zipkin opentracing compatible APIs that I want
to use for a talk of mine about client side tracing.


## Start

If you just want a bunch of services you can interact and play with, try running `docker-compose up`, this will spawn you these services:

- **Zipkin**: 9411
- **ID-Service**:
    - *alfred-id*: 3001
    - *batman-id*: 3002
    - *catwoman-id*: 3003
- **Spread-Service**
    - *spread-daenerys*: 4001
    - *spread-eddard-stark*: 4002

## ID-Service

The idea is to have a service that just returns what is posted to it after a timespan,
so that I can easily setup different scenarios from the call side without the need to
deploy a different service. To make the graphs more interesting a param also controls
how long the service should take.

```json
{
    "body": "42",
    "delay": 200
}
```

## Spread-Service

To have nicer graphs this service gets a set of endpoints to call with an array like this:


```json
[{
    "endpoint": "http://foo.bar.com/nice",
    "body": "{\"result\": \"id-42\"}",
    "delay": 800
}]
```

