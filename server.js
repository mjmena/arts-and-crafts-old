import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './database/schema.js';
import mongoose from 'mongoose';

var graphql_server = express();
graphql_server.use("/", graphqlHTTP({
    schema: schema,
    graphiql: true,
    prettify: true
}))

graphql_server.listen(8080, function() {
    console.log('GraphQL server running on port https://localhost:8080');
    mongoose.connect('mongodb://localhost/test');
});