module.exports = (logger, metrics, timers, buckets = []) => {
    const [start = 5, width = 5, number = 5] = buckets;

    function logRequest(uri, method) {
        logger.info('http.request', { uri });
    }

    function logResponse(uri, method, duration, res, requestId, sessionId) {
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
                uri,
                method,
            },
            buckets: metrics.linearBuckets(start, width, number),
        });
        logger.info('http.response', {
            uri, duration, statusCode, sessionId, requestId,
        });
    }

    return (req, res, next) => {
        const startTimeToken = timers.start();
        const { method } = req;

        logRequest(req.url, method);

        res.on('finish', () => {
            const duration = timers.stop(startTimeToken);
            const route = req.route.path;
            logResponse(req.route, method, duration, res, req.uuid, req.sessionID);
        });

        next();
    };
};
