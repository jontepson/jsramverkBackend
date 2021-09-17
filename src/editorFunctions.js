/**
 * A module exporting functions to access the editors database.
 */
 "use strict";

 module.exports = {
     getAll: getAll,
     createNew: createNew,
     updateDoc: updateDoc,
     deleteDoc: deleteDoc,
     getOne: getOne
 };

const { ObjectId } = require("bson");
var express = require("express");
var router = express.Router();
var database = require("../db/database");

async function getAll() {
    let db = await database.getDb();
    const resultSet = await db.collection.find({}).toArray();

    await db.client.close;

    return resultSet
}

async function getOne(id) {
    let db = await database.getDb();
    const res = await db.collection.findOne({_id: ObjectId(id)});
    await db.client.close;

    return res
}

async function createNew(body) {
    let db = await database.getDb();
    var doc = {
        content: body.content,
        name: body.name
    }
    db.collection.insertOne(doc);

    await db.client.close;
}

async function updateDoc(body) {
    var db = await database.getDb();
    // hämta en med rätt id
    // uppdatera content
    // eller namn
    //db.collection.updateOne({item: })
    await db.collection.updateOne({_id: ObjectId(body.id)}, { $set: {content: body.content, name: body.name}}, {upsert:true});
    await db.client.close;
}

async function deleteDoc(body) {
    var db = await database.getDb();
    // hämta en med rätt id
    await db.collection.deleteOne({_id: ObjectId(body.id)});
    await db.client.close;
}
