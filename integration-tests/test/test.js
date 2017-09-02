'use strict'
let request = require('supertest')
let should = require('should')


request = request('http://api:3000');
describe('Integration Testing', function() {
    
    before(function() {
    // runs before all tests in this block
    });

    after(function() {
    // runs after all tests in this block
    });

    it('should return status ok', function(done){
        request
        .get('/')
        .expect(200)
        .end((err, res) => {
            if(err){
                return done(err)
            }
            let body = res.body;
            body.status.should.match("ok")
            done()
        })
    })

    beforeEach(function() {
    // runs before each test in this block
    });

    afterEach(function() {
    // runs after each test in this block
    });

    // test cases
});