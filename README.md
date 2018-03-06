# Free To Play Express Utils

## Dependencies
This package assumes a node express application using [node-app-base](https://github.com/infinityworks/node-app-base).

## Contents
- middleware for adding request metrics
- augment application logs with request and session IDs

## Adding request ID and Session ID to application logs

In the entry point to the application (before passing the logger to any modules), request the logger
and initialise using the `node-app-base` logger. Pass the wrapped logger to any modules that require
a logger.

```
const createRequestLogger = require('express-utils').requestLogger;

const {
    config, timers, metrics, logger,
} = require('node-app-base')('my-app');

const requestLogger = createRequestLogger(logger);

const app = require('./app')(
    requestLogger,
);

```

Once the express app is created, create storeIdsMiddleware and load into the application. If you are using
session middleware, make sure the session comes before storing the Ids:

```
const app = express();

const sessionMiddleware = session();
const storeIdsMiddleware = require('express-utils').storeIdsMiddleware();

app.use(sessionMiddleware)
app.use(storeIdsMiddleware);

```


## Including metrics middleware

Pass logger, metrics and timers, along with instructions for linearBuckets to the metricsMiddleware and attach
using `app.use`.

```

const app = express();

const metricsMiddleware = require('express-utils').metricsMiddleware(logger, metrics, timers, [5, 5, 5]);

app.use(metricsMiddleware);

```
