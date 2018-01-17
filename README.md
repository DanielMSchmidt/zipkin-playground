# Zipkin Opentracing Playground

This is a repo full of examples with zipkin opentracing compatible APIs that I want
to use for a talk of mine about client side tracing.


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

## Spread-service

To have nicer graphs this service gets a set of endpoints to call with an array like this:


```json
[{
    "endpoint": "http://foo.bar.com/nice",
    "body": "{\"result\": \"id-42\"}",
    "delay": 800
}]
```

