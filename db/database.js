/**
 * Connect to the database and export it
 */
 "use strict";

const mongo = require("mongodb").MongoClient;
//const collectionName = config.collection;
//let config = require("./config.json");
let config;
let username;
let password;
//let collectionName;
let cluster;
let databaseName;

const database = {
    getDb: async function getDb (collectionName) {
        try {
            config = require("./config.json");
        } catch (e) {
            console.log(e)
        }

        username = process.env.MONGODBUSERNAME || config.username;
        password = process.env.PASSWORD || config.password;
        //collectionName = process.env.COLLECTION || config.collection;
        cluster = process.env.CLUSTER || config.cluster;
        databaseName = process.env.DATABASE || config.database;

        //let dsn = `mongodb+srv://${config.username}:${config.password}@${config.cluster}.c7v9q.mongodb.net/${config.database}?retryWrites=true&w=majority`;
        let dsn = `mongodb+srv://${username}:${password}@${cluster}.c7v9q.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
        //console.log(dsn)
        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);
        //const collection = await db.collection(config.collection);
        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;