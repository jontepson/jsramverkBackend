const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 1337;
const httpServer = require("http").createServer(app);
const socketIo = require("socket.io");
//app.use(express.json());

// This is middleware called for all routes.
// Middleware takes three parameters.
//app.use(express.json());
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}
// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// Add a route
const editor = require('./routes/editor');
const editorFunctions = require("./src/editorFunctions");

app.use('/', editor);


// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
const server = httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`));
const io = socketIo(httpServer, {
    cors: {
      //origin: "http://localhost:3000",
      origin: "https://www.student.bth.se",
      methods: ["GET", "POST"]
    }
  });
let previousId;
io.sockets.on('connection', function(socket) {
    socket.on('create', function(room) {
        socket.leave(previousId);
        socket.join(room);
        previousId = room;
    });
    socket.on("doc", function (data) {
        socket.to(data["id"]).emit("doc", data);
        // Spara till databas och göra annat med data
        //editorFunctions.updateDoc(data);
    });
});
module.exports = server;