const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Blog {
      _id: ID!
      title: String!
      description: String!
      image: String
      createdAt: String!
      updatedAt: String!
      category: String!
      author: User!
    }
    type User {
      _id: ID!
      name: String!
      email: String!
      password: String
      createdBlogs: [Blog!]
    }
    input BlogInput {      
      title: String!
      description: String!
      image: String      
      category: String!
    }
    input UserInput {
      name: String!
      email: String!
      password: String!
    }
    type RootQuery {
      blogs: [Blog!]!
      users: [User!]!
    }
    type RootMutation {
      createBlog(blogInput: BlogInput): Blog
      createUser(userInput: UserInput): User
    }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `)