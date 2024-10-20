const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Ensure JSON parsing for POST requests
app.use(cors());

// Authors array with id and name
const authors = [
  { id: 1, name: "J.K. Rowling" },
  { id: 2, name: "George R.R. Martin" },
  { id: 3, name: "J.R.R. Tolkien" },
  { id: 4, name: "Isaac Asimov" },
];

// Books array with id, name, and authorId (foreign key to authors)
const books = [
  { id: 1, name: "Harry Potter and the Philosopher's Stone", authorId: 1 },
  { id: 2, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 3, name: "A Game of Thrones", authorId: 2 },
  { id: 4, name: "A Clash of Kings", authorId: 2 },
  { id: 5, name: "The Hobbit", authorId: 3 },
  { id: 6, name: "The Lord of the Rings", authorId: 3 },
  { id: 7, name: "Foundation", authorId: 4 },
  { id: 8, name: "I, Robot", authorId: 4 },
];

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This is a book written by an Author",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents an author of a Book",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "A Single Book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: "A Single Author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a new Book",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add an author",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
        };
        books.push(author);
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
