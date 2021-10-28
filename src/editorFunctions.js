/**
 * A module exporting functions to access the editors database.
 */
 "use strict";

 module.exports = {
     getAll: getAll,
     createNew: createNew,
     updateDoc: updateDoc,
     deleteDoc: deleteDoc,
     getOne: getOne,
     getAllValid: getAllValid,
     getAllValidGraphQL: getAllValidGraphQL,
     invite: invite
 };

const { ObjectId } = require("bson");
var express = require("express");
var router = express.Router();
var database = require("../db/database");

async function getAll() {
    let db = await database.getDb("editorCollection");
    const resultSet = await db.collection.find({}).toArray();

    await db.client.close;

    return resultSet
}
async function invite(body, sgMail, res) {
    try {
        //console.log(body)
        await sgMail.send(body);
        res.json(204)
      } catch (error) {
        console.error(error);
    
        if (error.response) {
          console.error(error.response.body)
        }
        res.json(403)
      }
}

//GET ALL VALID NEW FOR GRAPHQL
async function getAllValidGraphQL(body, res=undefined) {
    let db;

        try {
            if (!body.user) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/userDocs",
                        title: "No email provided",
                        detail: "Email is missing"
                    }
                });
            }
            let user = body.user;
            let mode = body.mode;
            db = await database.getDb("editorCollection");

            const userDocs = await db.collection.find({valid_users: { $in: [user] }, mode: mode}).toArray();
            
            if (res === undefined) {
                return userDocs;
            }

            return res.json({
                data: userDocs
            });
        } catch (e) {
            return res.json({
                errors: {
                    status: 500,
                    name: "Database Error",
                    description: e.message,
                    path: "/",
                }
            })
        } finally {
            await db.client.close();
    }
}


// GET ALL VALID OLD FOR API
async function getAllValid(body, res) {
    if (!body.user) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/userDocs",
                title: "No email provided",
                detail: "Email is missing"
            }
        });
    }
    let user = body.user;
    let db = await database.getDb("editorCollection");
    const userDocs = await db.collection.find({valid_users: { $in: [user] }}).toArray();

    await db.client.close;
    // check if user got any docs
    if (userDocs.length === 0) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/userDocs",
                title: "User got no docs",
                detail: "User with provided email dont got any docs yet."
            }
        });
    }
    return res.json({userDocs})
}

async function getOne(id) {
    let db = await database.getDb("editorCollection");
    const res = await db.collection.findOne({_id: ObjectId(id)});
    await db.client.close;

    return res
}

async function createNew(body) {
    let db = await database.getDb("editorCollection");
    var doc = {
        content: body.content,
        name: body.name,
        valid_users: body.valid_users,
        mode: body.mode
    }
    db.collection.insertOne(doc);

    await db.client.close;
}

async function updateDoc(body) {
    var db = await database.getDb("editorCollection");
    // hämta en med rätt id
    // uppdatera content
    // eller namn
    //db.collection.updateOne({item: })
    await db.collection.updateOne({_id: ObjectId(body.id)}, { $set: {content: body.content, name: body.name, valid_users: body.valid_users, mode: body.mode}}, {upsert:true});
    await db.client.close;
}

async function deleteDoc(body) {
    var db = await database.getDb("editorCollection");
    // hämta en med rätt id
    await db.collection.deleteOne({_id: ObjectId(body.id)});
    await db.client.close;
}
