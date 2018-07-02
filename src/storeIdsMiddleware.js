const uuid = require('uuid');
const { getNamespace } = require('cls-hooked');

module.exports = (namespace) => {
    const requestNamespace = getNamespace(namespace);

    return (req, res, next) => {
        requestNamespace.run(() => {
            req.uuid = uuid.v1();
            requestNamespace.set('reqId', req.uuid);
            requestNamespace.set('sessionId', req.sessionID);
            requestNamespace.set('userAgent', req.headers['user-agent']);
            next();
        });
    };
};
