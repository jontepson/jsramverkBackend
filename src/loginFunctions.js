/**
 * A module exporting functions to access the editors database.
 */
 "use strict";

 module.exports = {
     login: login,
     signUp: signUp,
     getAll: getAll,
     deleteUser: deleteUser
 };

const { ObjectId } = require("bson");
var express = require("express");
var router = express.Router();
var database = require("../db/database");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
let config;
try {
    config  = require("../db/config.json");
} catch (error) {
    console.error(error);
}
const jwtSecret = process.env.JWT_SECRET || config.secret;

async function getAll() {
    let db = await database.getDb("loginCollection");
    const resultSet = await db.collection.find({}).toArray();

    await db.client.close;

    return resultSet
}

async function login(body, res) {
    let db = await database.getDb("loginCollection");
    // checks if email and password is sent
    if (!body.email || !body.password) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/login",
                title: "Email or password missing",
                detail: "Email or password missing in request"
            }
        });
    }
    // try to get a user with the email
    const filter = {
        email: body.email,
    };
    const user = await db.collection.findOne(filter);
    await db.client.close;
    if (user == null) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/login",
                title: "User not found",
                detail: "User with provided email not found."
            }
        });
    } else {
        return comparePasswords(res, body.password, user)
    }
    // hämta en med rätt id
    //await db.collection.insertOne(doc);
}

async function comparePasswords(res, password, user) {
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    title: "bcrypt error",
                    detail: "bcrypt error"
                }
            });
        }
        if (result) {
            let payload = { email: user.email} 
            let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '4h'});

            return res.json({
                data: {
                    type: "success",
                    message: "User logged in",
                    user: payload,
                    token: jwtToken
                }
            });
        }
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/login",
                title: "Wrong password",
                detail: "Password is incorrect."
            }
        });
    })
}

async function signUp(body, res) {
    // signup a user,
    var db = await database.getDb("loginCollection");
    const filter = {
        email: body.email
    };
    // check if user with that mail already exists.
    const result = await db.collection.findOne(filter);
    if (result == null) {
        // hash password
        bcrypt.hash(body.password, saltRounds, async function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }
            var user = {
            email: body.email,
            password: hash
            }
            // create
            await db.collection.insertOne(user);
            await db.client.close;
        });
    } else {
        // returns that emails already in use
        await db.client.close;
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/login",
                title: "Email already in use",
                detail: "Email already in use"
            }
        });
    }
    // returns if success
    return res.status(201).json({
        data: {
            message: "User successfully registered."
        }
    });
}

async function deleteUser(body) {
    var db = await database.getDb("loginCollection");
    // function to delete user, only for testing, should not be in use later!
    // turn off function
    await db.collection.deleteOne({_id: ObjectId(body.id)});
    await db.client.close;
}

