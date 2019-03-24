require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//graphQLHttp exports a function to use as middleware on the express servers route
const graphQLHttp = require('express-graphql');
const port = process.env.PORT;

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use('/api', graphQLHttp({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true
}));


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-yewxs.mongodb.net/${process.env.DB_SERVER}?retryWrites=true`)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is up on ${port}`);
    })
  }).catch(err => {
    console.log(err);
  });

