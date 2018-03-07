const { createNamespace } = require('cls-hooked');

const namespace = 'sbftp-app-namespace';
const requestNamespace = createNamespace(namespace);

require('cls-mysql')(requestNamespace);
require('cls-redis')(requestNamespace);

exports.createStoreIdsMiddleware = require('./src/storeIdsMiddleware').bind(null, namespace);
exports.createRequestLogger = require('./src/requestLogger').bind(null, namespace);
exports.createMetricsMiddleware = require('./src/metricsMiddleware');
