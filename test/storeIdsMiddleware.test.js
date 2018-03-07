const createStoreIdsMiddleware = require('../src/storeIdsMiddleware');
const assert = require('assert');

describe('storeIdsMiddleware', () => {
    it('exists', () => {
        assert(typeof createStoreIdsMiddleware !== 'undefined');
    });
});
