import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import {books} from './resources/data.cjs'


const typeDefs = `#graphql
    type Author{
        name : String
        country : String
    }
    type Book{
        id : Int
        title : String
        author : Author
        pages : Int
        year : Int
        genre : String
    }
# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
    type Query {
        books: [Book]
        numberSix: Int! # Should always return the number 6 when queried
        numberSeven: Int! # Should always return 7
        findById(id:Int!):Book
    }    
`

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: () => books,
        numberSix() {
            return 6;
        },
        numberSeven() {
            return 7;
        },
        findById : (parent, args, contextValue, info)=> books.find( book => book.id === args.id)
    }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
// 1. creates an Express app
// 2. installs your ApolloServer instance as middleware
// 3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
});

console.log(`Server ready at: ${url}`)