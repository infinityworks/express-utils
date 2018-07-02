const { getNamespace } = require('cls-hooked');

module.exports = (namespace, logger) => {
    logger.info('logger.upgrade', { message: 'upgrading logger to add session and request ids by default' });

    function updateLogger(level) {
        return (key, data = {}) => {
            const requestNamespace = getNamespace(namespace);
            let updatedData = data;

            if (typeof updatedData !== 'object') {
                updatedData = {};
            }
            try {
                updatedData.sessionId = data.sessionId || requestNamespace.get('sessionId');
                updatedData.requestId = data.requestId || requestNamespace.get('reqId');
            } catch (e) {
                logger.warn('logger.upgrade', { message: 'error augmenting log with sessionId and request Id', err: e.message });
            }
            try {
                updatedData.userAgent = data.userAgent || requestNamespace.get('userAgent');
            } catch (e) {
                logger.warn('logger.upgrade', { message: 'error augmenting log with userAgent', err: e.message });
            }

            logger[level](key, updatedData);
        };
    }

    return {
        info: updateLogger('info'),
        error: updateLogger('error'),
        warn: updateLogger('warn'),
    };
};
