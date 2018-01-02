var mongoose = require("mongoose");
var Clients = require(__dirname + "/../models/client");

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require(__dirname + '/../index');
var should = chai.should();

chai.use(chaiHttp);

describe('/GET Clients', function() {
    it('it should GET all the Clients', function(done)  {
    chai.request(server)
        .get('/api/clients')
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
        });
    });
});

describe('/Get Client', function () {
    var clientid = '4jh5j4hkdfe4e';
    it('it should NOT GET Client info without valid Client ID', function (done) {
        chai.request(server)
            .get('/api/clients/' + clientid)
            .end(function (err,res) {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('code').eql('InternalError');
                done();
            });
    });
});

describe('/Get Client', function () {
    var clientid = '5a247a655fdf161519c41f46';
    it('it should GET Client info with valid Client ID', function (done) {
        chai.request(server)
            .get('/api/clients/' + clientid)
            .end(function (err,res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

describe('/Get Client Transactions', function () {
    var clientid = '098';
    it('it should NOT GET Client Transactions list without valid Client ID', function (done) {
        chai.request(server)
            .get('/api/clients/' + clientid + '/transactions')
            .end(function (err,res) {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('code').eql('InternalError');
                done();
            });
    });
});

describe('/Get Client Transactions', function () {
    var clientid = '5a247a655fdf161519c41f46';
    it('it should GET Client Transactions list with valid Client ID', function (done) {
        chai.request(server)
            .get('/api/clients/' + clientid + '/transactions')
            .end(function (err,res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

describe('/GET Tellers', function() {
    it('it should GET all the Tellers', function(done)  {
        chai.request(server)
            .get('/api/tellers')
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

describe('/Get Teller', function () {
    var tellerid = '123';
   it('it should NOT GET Teller info without valid Teller ID', function (done) {
       chai.request(server)
           .get('/api/tellers/' + tellerid)
           .end(function (err,res) {
               res.should.have.status(500);
               res.body.should.be.a('object');
               res.body.should.have.property('code').eql('InternalError');
               done();
           });
   });
});

describe('/Get Teller', function () {
    var tellerid = '5a4baff23d46763bbc3bda0d';
    it('it should GET Teller info with valid Teller ID', function (done) {
        chai.request(server)
            .get('/api/tellers/' + tellerid)
            .end(function (err,res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});

describe('/Get Teller Clients', function () {
    var tellerid = 'abc';
    it('it should NOT GET Teller Clients list without valid Teller ID', function (done) {
        chai.request(server)
            .get('/api/tellers/' + tellerid + '/clients')
            .end(function (err,res) {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('code').eql('InternalError');
                done();
            });
    });
});

describe('/Get Teller Clients ', function () {
    var tellerid = '5a4baff23d46763bbc3bda0d';
    it('it should GET Teller Clients list with valid Teller ID', function (done) {
        chai.request(server)
            .get('/api/tellers/' + tellerid + '/clients')
            .end(function (err,res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

describe('/Get Teller Requests', function () {
    var tellerid = '123';
    it('it should NOT GET Teller Client request list without valid Teller ID', function (done) {
        chai.request(server)
            .get('/api/tellers/' + tellerid + '/requests')
            .end(function (err,res) {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('code').eql('InternalError');
                done();
            });
    });
});

describe('/Get Teller Requests', function () {
    var tellerid = '5a4baff23d46763bbc3bda0d';
    it('it should GET Teller Client list with valid Teller ID', function (done) {
        chai.request(server)
            .get('/api/tellers/' + tellerid + '/requests')
            .end(function (err,res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});


describe('/Get Teller Client', function () {
    var tellerid = '5a247fd0bcde75154cf0b07d';
    var clientid = 'abc';
    it('it should NOT GET Teller Client Info without valid Client ID', function (done) {
        chai.request(server)
            .get('/api/tellers/' + tellerid + '/clients/' + clientid)
            .end(function (err,res) {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('code').eql('InternalError');
                done();
            });
    });
});

describe('/Get Teller Client', function () {
    var tellerid = '5a247fd0bcde75154cf0b07d';
    var clientid = '5a247fd0bcde75154cf0b07e';
    it('it should GET Teller Client info with a valid Client ID', function (done) {
        chai.request(server)
            .get('/api/tellers/' + tellerid + '/clients/' + clientid)
            .end(function (err,res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id').eql(clientid);
                done();
            });
    });
});

describe('/POST Teller', function() {
    var teller = {
        firstname: "Bobby"
    };
    it('it should NOT POST Teller without one of the parameters', function(done)  {
        chai.request(server)
            .post('/api/tellers')
            .send(teller)
            .end(function (err, res) {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('code').eql('InternalError');
                //res.body.errors.should.have.property('message');
//                res.body.errors.pages.should.have.property('kind').eql('required');
                done();
            });
    });
});

describe('/POST Teller', function () {
    var teller = {
        firstname: "Bobby",
        lastname: "Billy"
    };
    it('it should POST Teller when all fields are supplied', function (done) {
       chai.request(server)
           .post('/api/tellers')
           .send(teller)
           .end(function (err, res) {
               res.should.have.status(201);
               res.body.should.be.a('object');
               res.body.should.have.property('firstName').eql(teller.firstname);
               res.body.should.have.property('lastName').eql(teller.lastname);
               done();
           })
    });
});



describe('/POST Client', function() {
    var tellerid = '2384uhhu678w6d8fb4';
    var clinet = new Clients({firstName:"Andre", lastName: "Tan"});
    it('it should NOT POST Client without valid Teller ID', function(done)  {
        chai.request(server)
            .post('/api/tellers/' + tellerid + '/clients')
            .send(clinet)
            .end(function (err, res) {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('code').eql('InternalError');
                //res.body.errors.should.have.property('message');
//                res.body.errors.pages.should.have.property('kind').eql('required');
                done();
            });
    });
});

describe('/POST Client', function() {
    var tellerid = '5a4baff23d46763bbc3bda0d';
    it('it should NOT POST Client without one of the required parameters', function(done)  {
        chai.request(server)
            .post('/api/tellers/' + tellerid + '/clients')
            .send({firstname: 'Andre'})
            .end(function (err, res) {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('code').eql('InternalError');
                //res.body.errors.should.have.property('message');
//                res.body.errors.pages.should.have.property('kind').eql('required');
                done();
            });
    });
});

describe('/POST Client', function() {
    var tellerid = '5a4baff23d46763bbc3bda0d';
    it('it should POST Client with all required fields and valid Teller ID', function(done)  {
        chai.request(server)
            .post('/api/tellers/' + tellerid + '/clients')
            .send({firstname: 'Andre', lastname: 'Tan'})
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.a('object');
                //res.body.errors.should.have.property('message');
//                res.body.errors.pages.should.have.property('kind').eql('required');
                done();
            });
    });
});

describe('/POST Teller', function () {
    var teller = {
        firstname: "Bobby",
        lastname: "Billy"
    };
    it('it should POST Teller when all fields are supplied', function (done) {
       chai.request(server)
           .post('/api/tellers')
           .send(teller)
           .end(function (err, res) {
               res.should.have.status(201);
               res.body.should.be.a('object');
               res.body.should.have.property('firstName').eql(teller.firstname);
               res.body.should.have.property('lastName').eql(teller.lastname);
               done();
           })
    });
});

describe('/PUT Client Status', function () {
    var clientid = '039jk4o3ifno48nji34';
    it('it should NOT Update Client status without valid Client ID', function (done) {
        chai.request(server)
            .put('/api/clients/' + clientid)
            .end(function (err,res) {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('code').eql('InternalError');
                done();
            });
    });
});

describe('/PUT Client', function () {
    var clientid = '5a4bd4d4f79fbb3d98da0d2b';
    it('it should Update Client status with valid Client ID', function (done) {
        chai.request(server)
            .put('/api/clients/' + clientid)
            .end(function (err,res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('accountStatus').eql('ToBeTerminated');
                done();
            });
    });
});

describe('/Delete Client', function () {
    var clientid = '039jk4o3ifno48nji34';
    var tellerid = '09234rk34j5';
    it('it should NOT Delete Client without valid Client ID or Teller ID', function (done) {
        chai.request(server)
            .del('/api/tellers/' + tellerid + '/clients/' + clientid)
            .end(function (err,res) {
                res.should.have.status(204);
                done();
            });
    });
});

describe('/Delete Client', function () {
    var tellerid = '5a4baff23d46763bbc3bda0d';
    var clientid = '5a4bd4d4f79fbb3d98da0d2b';
    it('it should Delete Client if all info is correct', function (done) {
        chai.request(server)
            .del('/api/tellers/' + tellerid + '/clients/' + clientid)
            .end(function (err,res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id').eql(clientid);
                done();
            });
    });
});
