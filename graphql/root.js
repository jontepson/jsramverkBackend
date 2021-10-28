const editor = require("../src/editorFunctions")
const login = require("../src/loginFunctions")
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    graphql
} = require('graphql');

const userType = new GraphQLObjectType({
    name: 'Users',
    description: 'All users',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
    })
})

const docsType = new GraphQLObjectType({
    name: 'Docs',
    description: 'All Docs',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
        valid_users: { type: GraphQLNonNull(GraphQLList(GraphQLString))},
        mode: { type: GraphQLNonNull(GraphQLString)}
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        user: {
            type: userType,
            description: 'All users',
            resolve: async function() {
                return await login.getAll()

            }
        },
        users: {
            type: GraphQLList(userType),
            description: 'List of all users',
            resolve: async function() {
                return await login.getAll();
            }
        },
        Usersdoc: {
            type: GraphQLList(docsType),
            description: 'All docs for 1 email',
            args: {
                user: { type: GraphQLString},
                mode: { type: GraphQLString}
            },
            resolve: async function(parent, args) {
                // need res to work, how to get it for graphql FIXED WITH MIDDLEWARE
                return await editor.getAllValidGraphQL(args);
            }
        },
        docs: {
            type: GraphQLList(docsType),
            description: 'List of all docs',
            resolve: async function() {
                return await editor.getAll();
            }
        },
        OneDoc: {
            type: docsType,
            description: 'One doc by id',
            args: {
                id: { type: GraphQLString}
            },
            resolve: async function(parent, args) {
                return await editor.getOne(args.id);
            }
        }
    })
});

module.exports = RootQueryType;