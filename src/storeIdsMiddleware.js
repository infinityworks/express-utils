const uuid = require('uuid');
const createNamespace = require('cls-hooked').createNamespace;
const requestNamespace = createNamespace('group-bet-request');

module.exports = () => {
    return (req, res, next) => {
       requestNamespace.run(() => {
            req.uuid = uuid.v1();
            requestNamespace.set('reqId', req.uuid);
            requestNamespace.set('sessionId', req.sessionID);
            next();
        }); 
    };
};
