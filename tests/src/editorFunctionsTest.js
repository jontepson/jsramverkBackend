process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server.js');
//const server = "http://localhost:1337";
const database = require("../../db/database.js");
const { GraphQLString } = require('graphql');


async function Find(){
    const db = await database.getDb("editorCollection");
    const resultSet = await db.collection.find({}).toArray();

    await db.client.close();
    var id = JSON.stringify(resultSet[0]._id)
    id = id.replace(/"/g,"");
    return id;
}

chai.should();

chai.use(chaiHttp);

describe('editor routes no token', () => {
    describe('GET all from database', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/editor")
                .end((err, res) => {
                    res.should.have.status(401);
                    
                    done();
                });
        });
    });
    describe('Put database without content', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .put("/editor")
                .end((err, res) => {
                    res.should.have.status(401);
                    
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
                    res.should.have.status(401);
                    
                    done();
                });
        });
    });
    describe('POST database with content', () => {
        it('200 HAPPY PATH', (done) => {
            data = {
                name: "test name",
                content: "testcontent",
            }
            chai.request(server)
                .post("/editor")
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(401);
                    
                    done();
                });
        });
    });
    describe('Put database with content', () => {
        it('200 HAPPY PATH', async () => {
            let id = "838382182823";
            //let id = await Find();
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
                    res.should.have.status(401);
                    
                });
        });
    });

    describe('Get all graphql', () => {
        it('200 HAPPY PATH', async () => {
            chai.request(server)
                .get("/graphql")
                .set('content-type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.status(401);
                    
                });
        });
    });

    
});

let defaultUser = {
    email: "mail@mail.se",
    password: "jonatan"
  };
  let token;

describe('editor routes with token', () => {
    // SHOULD BE 201, maybe need to reset everything in loginCollection
    describe(' TOKEN Sign Up new user', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/signup")
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(defaultUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
    });

    describe(' TOKEN Login', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/login")
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(defaultUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    token = res.body.data.token;
                    done();
                });
        });
    });

    describe(' TOKEN Sign Up email in use', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/signup")
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(defaultUser)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    describe(' TOKEN GET all from database', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/editor")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    done();
                });
        });
    });

    describe(' TOKEN Get all graphql', () => {
        let GraphQLQuery = { query: '{ docs { name, content } }' }
        it('200 HAPPY PATH', async () => {
            chai.request(server)
                .get("/graphql")
                .set('x-access-token', token, 'content-type', 'application/json')
                .send(GraphQLQuery)
                .end((err, res) => {
                    res.should.have.status(200);
                    
                });
        });
    });

    describe(' TOKEN Get all users graphql', () => {
        let GraphQLQuery = { query: '{ users { email } }' }
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/graphql")
                .set('x-access-token', token, 'content-type', 'application/json')
                .send(GraphQLQuery)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe(' TOKEN Get docs for 1 user and 1 mode graphql', () => {
        let GraphQLQuery = { query: '{ Usersdoc(user: "test@test.se", mode: "test mode") { name, content, valid_users, _id } }' }
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/graphql")
                .set('x-access-token', token, 'content-type', 'application/json')
                .send(GraphQLQuery)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe(' TOKEN Get all userss', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/users")
                .set('content-type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    done();
                });
        });
    });
    
    describe(' TOKEN Post database without content', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/editor")
                .set('x-access-token', token)
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    done();
                });
        });
    });
    describe(' TOKEN POST database with content', () => {
        it('200 HAPPY PATH', (done) => {
            data = {
                name: "test name",
                content: "testcontent",
                valid_users: "test@test.se",
                mode: "test mode"
            }
            chai.request(server)
                .post("/editor")
                .set('x-access-token', token, 'content-type', 'application/x-www-form-urlencoded')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    done();
                });
        });
    });
    //SEND SOMETHING WRONG
    describe(' TOKEN Put database with content', () => {
        it('200 HAPPY PATH', (done) => {
            data = {
                name: "test name",
                content: "testcontent",
                id: "142114244142",
            }
            chai.request(server)
                .put("/editor")
                .set( 'x-access-token', token, 'content-type', 'application/x-www-form-urlencoded')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });
});
describe('editor routes with token', () => {
    describe('Send invite without content', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/invite")
                .set('content-type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

});
