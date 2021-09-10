## Description

This is a simple API to CRUD to a mongodb.

## Getting started

Clone the repo

git clone https://github.com/jontepson/jsramverkBackend.git

### `npm install`

Installs the node_modules needed.

## Create a config file

You need to create a config.json file in the directory db/

The content of that file should be
{
    "username": "YourUsername",
    "password": "YourPassword",
    "collection": "YourCollection",
    "database": "YourDatabase",
    "cluster": "YourCluster"
}

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:1337](http://localhost:1337) to view it in the browser.



### `npm run watch`

Runs the app in the development mode.\
Open [http://localhost:1337](http://localhost:1337) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Work with the api

GET all from database
http://localhost:1337/editor

GET one from database based on id
http://localhost:1337/editor/id

POST to database
http://localhost:1337/editor
body {
    content: "the content"
    name: "the name"
}

PUT to database
http://localhost:1337/editor
body {
    id: "id of the document"
    content: "the new content"
    name: "the new name"
}

DELETE from database
http://localhost:1337/editor
body {
    id: "id of the document"
}