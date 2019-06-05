const {getNamespace} = require('cls-hooked');

module.exports = (namespace, logger) => {
    logger.info(
        'logger.upgrade',
        {
            message: 'upgrading logger to add session, request id and correlation id by default'
        }
    );

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
                updatedData.correlationId = data.correlationId || requestNamespace.get('correlationId');
            } catch (e) {
                logger.warn(
                    'logger.upgrade',
                    {
                        message: 'error augmenting log with sessionId, request Id and correlation Id',
                        err: e.message
                    }
                );
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
