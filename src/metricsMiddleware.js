const url = require('url');

module.exports = (logger, metrics, timers) => {

    function logRequest(uri) {
        metrics.counter({
            name: 'request_count',
            help: 'Total incoming HTTP requests',
            labels: {
                uri: url.parse(uri).pathname,
            },
        });
        logger.info('http.request', { uri });
    }

    function logResponse(uri, duration, res, requestId, sessionId){
        const { statusCode } = res;
        metrics.counter({
            name: 'response_count',
            help: 'Total response count by HTTP status',
            labels: {
                statusCode,
            },
        });
        metrics.histogram({
            name: 'response_time_milliseconds',
            help: 'Response time duration distribution',
            value: duration,
            labels: {
                uri: url.parse(uri).pathname,
            },
            buckets: metrics.linearBuckets(5, 5, 5),
        });
        logger.info('http.response', { uri, duration, statusCode, sessionId, requestId });
    }

    return (req, res, next) => {
        const startTimeToken = timers.start();

        logRequest(req.url);

        res.on('finish', () => {
            const duration = timers.stop(startTimeToken);
            logResponse(req.url, duration, res, req.uuid, req.sessionID);
        });

        next();
    }
};
