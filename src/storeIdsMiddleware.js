const uuid = require('uuid');
const createNamespace = require('cls-hooked').createNamespace;

module.exports = (namespace) => {
    const requestNamespace = createNamespace(namespace);

    return (req, res, next) => {
       requestNamespace.run(() => {
            req.uuid = uuid.v1();
            requestNamespace.set('reqId', req.uuid);
            requestNamespace.set('sessionId', req.sessionID);
            next();
        }); 
    };
};
