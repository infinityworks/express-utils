const getNamespace = require('cls-hooked').getNamespace;

module.exports = (logger, namespace) => {
    logger.info('logger.upgrade', { message: 'upgrading logger to add session and request ids by default'} );

    function updateLogger(level){
        return (key, data = {}) => {
            const requestNamespace = getNamespace(namespace);
            if(typeof data !== 'object'){
                data = {};
            }
            try{
                data.sessionId = data.sessionId || requestNamespace.get('sessionId');
                data.requestId = data.requestId || requestNamespace.get('reqId');
            } catch(e){
                logger.warn('logger.upgrade', { message: 'error augmenting log with sessionId and request Id', err: e.message });
            }

            logger[level](key, data);
        };
    }

    return { 
        info: updateLogger('info'),
        error: updateLogger('error'),
        warn: updateLogger('warn'),
    };
};
