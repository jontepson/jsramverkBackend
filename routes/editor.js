/**
 * Routes for CRUD editor
 */
 "use strict";
var express = require("express");
var router = express.Router();
const editor = require("../src/editorFunctions")


router.get("/editor/:id", async (req, res) => {
    console.log("Got a GET request, sending back 200 default, get one");
    console.log(req.params.id);
    var content = await editor.getOne(req.params.id);

    res.json(content);
});

router.get("/editor", async (req, res) => {
    console.log("Got a GET request, sending back 200 default.");
    var content = await editor.getAll();

    res.json(content);
});



router.post("/editor", (req, res) => {
    console.log("Got a POST request, send back 201 Created");
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

router.put("/editor", async (req, res) => {
    // PUT requests should return 204 No Content UPDATE
    console.log(req.body);
    if(req.body.name && req.body.content && req.body.id) {
        await editor.updateDoc(req.body);
        res.status(204).send();
    }
    res.json({
        data: {
            msg: "Fail, need _id, name and content",
        }
    });
    console.log(result);
    res.status(204).send();
});

router.delete("/editor", async (req, res) => {
    // DELETE requests should return 204 No Content
    console.log("DELETE request");
    await editor.deleteDoc(req.body);
    res.status(204).send();
});

module.exports = router;