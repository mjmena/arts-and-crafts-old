import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './database/schema.js';
import mongoose from 'mongoose';
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var graphql_server = express();
graphql_server.use("/", graphqlHTTP({
    schema: schema,
    graphiql: true,
    prettify: true
}));

graphql_server.listen(8080, function() {
    console.log('GraphQL server running on port https://localhost:8080');
    mongoose.connect('mongodb://localhost/test');
});

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  proxy: {'/graphql': 'http://localhost:8080'},
  hot: true,
  historyApiFallback: true
}).listen(8081, process.env.IP, function (err, result) {
  if (err) {
    console.log(err);
  }
  
  
  console.log('Listening at localhost:8081');
});
