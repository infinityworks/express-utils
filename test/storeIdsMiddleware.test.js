const { getNamespace } = require('cls-hooked');
const createStoreIdsMiddleware = require('../src/storeIdsMiddleware');
const assert = require('assert');
const sinon = require('sinon');

let headers = {};
const stubHeaderMethod = (name) => {
    const standardName = name.toLowerCase();
    if (typeof headers[standardName] !== 'undefined') {
        return headers[standardName];
    }
    return null;
};

describe('storeIdsMiddleware', () => {
    const namespace = 'test-ns';
    let storeIdsMiddleware;
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            header: stubHeaderMethod
        };
        res = {};
        next = () => {};
        storeIdsMiddleware = createStoreIdsMiddleware(namespace);
    });

    it('calls next', () => {
        const nextSpy = sinon.spy();
        storeIdsMiddleware(req, res, nextSpy);
        assert(nextSpy.called);
    });

    it('adds a uuid to the request', () => {
        storeIdsMiddleware(req, res, next);
        assert(typeof req.uuid === 'string');
    });

    it('stores reqId in the cls', () => {
        const nextAssert = () => {
            const reqId = getNamespace(namespace).get('reqId');
            assert.equal(req.uuid, reqId);
        };
        storeIdsMiddleware(req, res, nextAssert);
    });

    it('stores sessionID where available', () => {
        req.sessionID = 'abcdefghijkjmnopqrstuvwxyz';
        const nextAssert = () => {
            const sessionId = getNamespace(namespace).get('sessionId');
            assert.equal(req.sessionID, sessionId);
        };
        storeIdsMiddleware(req, res, nextAssert);
    });

    it('stores correlationId where available', () => {
        const correlationId = 'foo';
        headers = {
            'x-correlation-id': correlationId
        };
        const nextAssert = () => {
            const actualCorrelationId = getNamespace(namespace).get('correlationId');
            assert.equal(actualCorrelationId, correlationId);
        };
        storeIdsMiddleware(req, res, nextAssert);
    });
});
