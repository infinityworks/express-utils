const { createNamespace } = require('cls-hooked');
const createStoreIdsMiddleware = require('../src/storeIdsMiddleware');
const assert = require('assert');
const sinon = require('sinon');

describe('storeIdsMiddleware', () => {
    const namespace = 'test-ns';
    let storeIdsMiddleware;
    let requestNamespace;
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {};
        res = {};
        next = () => {};
        requestNamespace = createNamespace(namespace);
        storeIdsMiddleware = createStoreIdsMiddleware(namespace);    
    });

    it('calls next', () => {
        const nextSpy = sinon.spy();
        storeIdsMiddleware(req, res, nextSpy);
        assert(nextSpy.called);
    });
});
