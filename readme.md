# GraphQL API Documentation

This documentation provides an overview of the **GraphQL API** built with **Express** and **GraphQL** in Node.js. It aims to introduce the **core concepts** of GraphQL, including Queries, Mutations, Resolvers, and Schema design, along with a full setup guide and example queries. After reading this, you should be able to understand the basics of GraphQL and extend the API further.

---

## Table of Contents

- [Introduction to GraphQL](#introduction-to-graphql)
- [How GraphQL Works](#how-graphql-works)
- [GraphQL Core Concepts](#graphql-core-concepts)
- [Features Implemented](#features-implemented)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Code Overview](#code-overview)
  - [Author and Book Types](#author-and-book-types)
  - [Queries](#queries)
  - [Mutations](#mutations)
  - [Resolvers](#resolvers)
- [Testing the API](#testing-the-api)
- [Example Queries and Mutations](#example-queries-and-mutations)
- [Resources](#resources)

---

## Introduction to GraphQL

GraphQL is a **query language** for APIs that provides a more **flexible and efficient** way to interact with data compared to REST. It allows clients to specify exactly what data they need and receive only that data in response.

GraphQL uses a **single endpoint** for all requests and supports **real-time queries** and **mutations** (data updates), reducing over-fetching and under-fetching issues common with RESTful APIs.

---

## How GraphQL Works

1. **Queries:** Allow clients to request data.
2. **Mutations:** Enable clients to modify or add new data.
3. **Schema:** Defines the types and structure of data available through the API.
4. **Resolvers:** Handle how data is fetched or manipulated when a query or mutation is executed.

GraphQL uses a **type system** to ensure that clients can interact with APIs in a consistent way. Each data type is defined within the schema using **GraphQLObjectType**.

---

## GraphQL Core Concepts

### 1. **Schema**

The **schema** is a blueprint that defines all available queries and mutations for your GraphQL API. It declares the **types** (like `Book` and `Author`) and specifies how they relate to each other.

```javascript
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
```

### 2. **Queries**

A **query** is how the client requests data from the API. Think of it as the "GET" method in REST. You can request specific fields and nested data.

```graphql
{
  books {
    id
    name
  }
}
```

### 3. **Mutations**

A **mutation** is used to modify data (like adding or updating records). Mutations are similar to POST, PUT, or DELETE methods in REST.

```graphql
mutation {
  addAuthor(name: "Philip K. Dick") {
    id
    name
  }
}
```

### 4. **Resolvers**

A **resolver** is a function responsible for fetching or manipulating data when a specific query or mutation is executed.

```javascript
resolve: (parent, args) => books.find((book) => book.id === args.id);
```

### 5. **Types**

Types define the shape of data. Each type consists of fields with their own data types (like `String`, `Int`, or nested objects).

---

## Features Implemented

- **Fetching Data:** Query all books and authors, or retrieve a single book/author by ID.
- **Mutations:** Add new books and authors to the in-memory data.
- **Relations:** Each book has an associated author.
- **GraphiQL Playground:** Test queries and mutations through the browser.

---

## Installation & Setup

1. **Clone the repository** or copy the code files.
2. Install dependencies:

```bash
npm init -y
npm install express express-graphql graphql cors
```

3. Create an `index.js` file and add the provided code.
4. Start the server:

```bash
node index.js
```

5. Open [http://localhost:3003/graphql](http://localhost:3003/graphql) to test the API using GraphiQL.

---

## Project Structure

```
/project-root
│
├── index.js          // Main server file with GraphQL schema & routes
└── package.json      // Project metadata and dependencies
```

---

## Code Overview

### Author and Book Types

- **AuthorType:** Represents an author with an `id`, `name`, and a list of books.
- **BookType:** Represents a book with an `id`, `name`, `authorId`, and its associated author.

```javascript
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => authors.find((author) => author.id === book.authorId),
    },
  }),
});
```

---

### Queries

Queries retrieve data from the server. Example:

- **All Books:**

```graphql
{
  books {
    id
    name
    author {
      name
    }
  }
}
```

```javascript
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    book: {
      type: BookType,
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: () => authors,
    },
  }),
});
```

---

### Mutations

Mutations modify or add data. Example:

- **Add a New Book:**

```graphql
mutation {
  addBook(name: "Dune", authorId: 4) {
    id
    name
  }
}
```

```javascript
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
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
  }),
});
```

---

### Resolvers

Resolvers control how queries and mutations fetch or modify data. For example, the `author` field in `BookType` is populated using a resolver:

```javascript
resolve: (book) => authors.find((author) => author.id === book.authorId);
```

---

## Testing the API

1. **Start the Server:**

```bash
node index.js
```

2. Go to [http://localhost:3003/graphql](http://localhost:3003/graphql) and try queries and mutations.

---

## Example Queries and Mutations

### Query: Fetch All Books

```graphql
{
  books {
    id
    name
    author {
      name
    }
  }
}
```

### Query: Fetch an Author by ID

```graphql
{
  author(id: 1) {
    id
    name
    books {
      name
    }
  }
}
```

### Mutation: Add a New Author

```graphql
mutation {
  addAuthor(name: "Ursula K. Le Guin") {
    id
    name
  }
}
```

---

## Resources

- [GraphQL Official Documentation](https://graphql.org/)
- [Express Documentation](https://expressjs.com/)
- [express-graphql GitHub](https://github.com/graphql/express-graphql)

---

## Conclusion

This README provides everything you need to get started with GraphQL, including setup, basic concepts, and how to implement queries and mutations. You can now extend this example by adding features like authentication, pagination, or a database connection. Happy coding! 🎉
