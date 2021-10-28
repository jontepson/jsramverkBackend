/**
 * Routes for CRUD editor
 */
 "use strict";
var express = require("express");
var router = express.Router();
const editor = require("../src/editorFunctions")
const login = require("../src/loginFunctions")
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// checkToken middleware
let config;
try {
    config  = require("../db/config.json");
} catch (error) {
    console.error(error);
}
const sgMailApiKey = process.env.SENDGRID_API_KEY || config.SENDGRID_API_KEY
const jwtSecret = process.env.JWT_SECRET || config.secret;

sgMail.setApiKey(sgMailApiKey);
function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];

    jwt.verify(token, jwtSecret, function(err, decoded) {
        if (err) {
            // send error response
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/editor",
                    title: "Token is invalid",
                    detail: "Token is not valid."
                }
            });
        }

        // Valid token send on the request
        next();
    });
}
router.post("/invite", async (req, res) => {
    var content = await editor.invite(req.body, sgMail, res)
    res.json(content)
    
    
});

router.get("/editor/:id", async (req, res) => {
    console.log("Got a GET request, sending back 200 default, get one");
    var content = await editor.getOne(req.params.id);

    res.json(content);
});

router.get("/editor", async (req, res, next) => checkToken(req, res, next) , async (req, res) => {
    console.log("Got a GET request, sending back 200 default.");
    var content = await editor.getAll();

    res.json(content);
});

router.post("/userDocs", async (req, res, next) => checkToken(req, res, next) , async (req, res) => {
    console.log("Got a GET request, sending back 200 default.");
    //console.log(req.body.user)
    await editor.getAllValid(req.body, res);
    
});

router.post("/editor", async (req, res, next) => checkToken(req, res, next) , (req, res) => {
    console.log("Got a POST request, send back 201 Created");
    //console.log(req.body)
    if(req.body.name && req.body.content) {
        editor.createNew(req.body);
        res.json({
            data: {
                msg: "Got a POST request, send back 201 Created",
            }
        });
    }
    res.json({
        data: {
            msg: "Fail, need name and content",
        }
    });
});

router.put("/editor", async (req, res, next) => checkToken(req, res, next) , async (req, res) => {
    // PUT requests should return 204 No Content UPDATE
    //console.log(req.body);
    if(req.body.name && req.body.content && req.body.id) {
        await editor.updateDoc(req.body);
        res.status(204).send();
    }
    res.json({
        data: {
            msg: "Fail, need _id, name and content",
        }
    });
    //res.status(204).send();
});

router.delete("/editor", async (req, res) => {
    // DELETE requests should return 204 No Content
    console.log("DELETE request");
    await editor.deleteDoc(req.body);
    res.status(204).send();
});


router.post("/signup", (req, res) => {
    console.log("Got a POST request, send back 201 Created");
    if(req.body.email && req.body.password) {
        login.signUp(req.body, res);
    }
});
router.post("/login", async (req, res) => {
    console.log("Got a post request, send back 200 Success");
    await login.login(req.body, res);

});

router.get("/users", async (req, res) => {
    console.log("Got a GET request, sending back 200 default.");
    var content = await login.getAll();

    res.json(content);
});

router.delete("/users", async (req, res) => {
    // DELETE requests should return 204 No Content
    console.log("DELETE request");
    await login.deleteUser(req.body);
    res.status(204).send();
});


module.exports = router;