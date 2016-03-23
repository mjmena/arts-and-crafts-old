var getbabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../database/schema.json');

module.exports = getbabelRelayPlugin(schema.data);