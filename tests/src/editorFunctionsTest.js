process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server.js');
const functions = require('../../src/editorFunctions.js')
const database = require("../../db/database.js");

async function Find(){
    const db = await database.getDb();
    const resultSet = await db.collection.find({}).toArray();

    await db.client.close();
    var id = JSON.stringify(resultSet[0]._id)
    id = id.replace(/"/g,"");
    return id;
}
chai.should();

chai.use(chaiHttp);

describe('Functions', () => {
    describe('GET all from database', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/editor")
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    done();
                });
        });
    });
    describe('Put database without content', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .put("/editor")
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    done();
                });
        });
    });
    
    describe('Delete database', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .delete("/editor")
                .end((err, res) => {
                    res.should.have.status(204);
                    
                    done();
                });
        });
    });
    describe('Post database without content', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/editor")
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    done();
                });
        });
    });
    describe('POST database with content', () => {
        it('200 HAPPY PATH', (done) => {
            let data = {
                name: "test name",
                content: "testcontent",
            }
            chai.request(server)
                .post("/editor")
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    done();
                });
        });
    });
    describe('Put database with content', () => {
        it('200 HAPPY PATH', async () => {
            let id = await Find();
            let data = {
                name: "test name",
                content: "testcontent",
                id: id
            }
            chai.request(server)
                .put("/editor")
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(204);
                    
                });
        });
    });
    // FUNKAR INTE RIKTIGT SOM DEN SKA 
    describe('Get id database', () => {
        it('200 HAPPY PATH', async () => {
            let id = await Find();
            chai.request(server)
                .get("/editor/" + id )
                .end((err, res) => {
                    res.should.have.status(200);
                    
                });
        });
    });
});