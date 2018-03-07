const { createNamespace } = require('cls-hooked');
const createRequestLogger = require('../src/requestLogger');
const assert = require('assert');
const sinon = require('sinon');

describe('requestLogger', () => {
    let sandbox;
    let requestLogger;
    const logger = { info: () => {}, error: () => {}, warn: () => {} };
    const namespace = 'test-ns';

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        requestLogger = createRequestLogger(namespace, logger);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('relies on the underlying logger for output', () => {
        sandbox.spy(logger, 'info');
        requestLogger.info('test.log');
        assert(logger.info.called);
    });

    it('warns when there is a problem retrieving session ID', () => {
        sandbox.spy(logger, 'warn');
        requestLogger.info('test.log');
        assert(logger.warn.called);
    });

    it('retains existing behaviour when there is no session or request ID', () => {
        sandbox.spy(logger, 'info');
        requestLogger.info('test.log', { foo: 'bar' });
        assert.equal(logger.info.getCall(0).args[0], 'test.log');
        assert.equal(logger.info.getCall(0).args[1].foo, 'bar');
    });

    it('fixes the stupid mistakes dumb people make when they put non-objects as the data for the logger', () => {
        sandbox.spy(logger, 'info');
        requestLogger.info('test.log', 'say boom boom boom, oh let me hear you say way-o!');
        assert.equal(typeof logger.info.getCall(0).args[1], 'object');
    });

    it('sets the request ID and session ID when available', (done) => {
        const ns = createNamespace(namespace);
        sandbox.spy(logger, 'info');
        ns.run(() => {
            ns.set('reqId', 10101);
            ns.set('sessionId', 10203);
            requestLogger.info('test.log', 'say boom boom boom, oh let me hear you say way-o!');
            assert.equal(logger.info.getCall(0).args[1].requestId, 10101);
            assert.equal(logger.info.getCall(0).args[1].sessionId, 10203);
            done();
        });
    });
});
