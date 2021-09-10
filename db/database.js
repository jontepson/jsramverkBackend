/**
 * Connect to the database and export it
 */
 "use strict";

const mongo = require("mongodb").MongoClient;
const config = require("./config.json");
const collectionName = config.collection;

const database = {
    getDb: async function getDb () {
        let dsn = `mongodb+srv://${config.username}:${config.password}@${config.cluster}.c7v9q.mongodb.net/${config.database}?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            dsn = `mongodb+srv://${config.username}:${config.password}@${config.cluster}.c7v9q.mongodb.net/${config.database}?retryWrites=true&w=majority`;
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);
        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;