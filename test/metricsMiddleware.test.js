const createMetricsMiddleware = require('../src/metricsMiddleware');
const assert = require('assert');
const sinon = require('sinon');

describe('metricsMiddleware', () => {
    let metricsMiddleware;
    let logger;
    let metrics;
    let timers;
    let req;
    let res;
    let next;

    beforeEach(() => {
        let cb = () => {};
        next = () => cb();
        req = { route: { path: '/' }, url: '/url' };
        res = {
            on: (evt, finishCb) => {
                cb = finishCb;
            },
            statusCode: 200,
        };
        logger = { info: () => {}, warn: () => {}, error: () => {} };
        metrics = { counter: () => {}, histogram: () => {}, linearBuckets: () => {} };
        timers = { start: () => {}, stop: () => {} };
        metricsMiddleware = createMetricsMiddleware(logger, metrics, timers);
    });

    it('calls next', () => {
        const nextSpy = sinon.spy();
        metricsMiddleware(req, res, nextSpy);
        assert(nextSpy.called);
    });

    it('outputs response counts', () => {
        sinon.spy(metrics, 'counter');

        metricsMiddleware(req, res, next);
        assert.equal(metrics.counter.getCall(0).args[0].name, 'response_count');
    });

    it('uses req.route to record routing data', () => {
        sinon.spy(metrics, 'histogram');        
        metricsMiddleware(req, res, next);
        assert.equal(metrics.histogram.getCall(0).args[0].labels.uri, '/');
    });


    it('uses req.url where route is unavailable', () => {
        delete req.route;
        sinon.spy(metrics, 'histogram');        
        metricsMiddleware(req, res, next);
        assert.equal(metrics.histogram.getCall(0).args[0].labels.uri, '/url');
    });

    it('does not record histogram when the status is 404', () => {
        sinon.spy(metrics, 'histogram');
        res.statusCode = 404;
        metricsMiddleware(req, res, next);
        assert(metrics.histogram.notCalled);
    });

    it('does not record histogram when uri not in whitelist', () => {
        sinon.spy(metrics, 'histogram');
        metricsMiddleware = createMetricsMiddleware(logger, metrics, timers, [], ['/test-url']);
        metricsMiddleware(req, res, next);
        assert(metrics.histogram.notCalled);
    });

    it('records histogram when uri is in whitelist', () => {
        sinon.spy(metrics, 'histogram');
        metricsMiddleware = createMetricsMiddleware(logger, metrics, timers, [], ['/test-url', '/']);
        metricsMiddleware(req, res, next);
        assert(metrics.histogram.called);
    });

});
