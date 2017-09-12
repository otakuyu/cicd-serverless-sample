'use strict'
let request = require('supertest')
let should = require('should')
let AWS = require('aws-sdk')
let awsConfig = {
  "apiVersion": "2012-08-10",
  "accessKeyId": "abcde",
  "secretAccessKey": "abcde",
  "region":"us-west-2",
  "endpoint": "http://db:8000"
}
let dyClient = new AWS.DynamoDB.DocumentClient(awsConfig)
let dynamodb = new AWS.DynamoDB(awsConfig)

let requestApi = request('http://api:3000');
let requestDBServer = request('http://db-service:3001')
let tableName = process.env.TABLE_NAME
describe('Integration Testing', function() {
    
    before(function(done) {
        dynamodb.createTable({
            AttributeDefinitions: [
                {
                    AttributeName: "test_id",
                    AttributeType: "S"
                }
            ],
            KeySchema: [
                {
                    AttributeName: "test_id",
                    KeyType: "HASH"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5, 
                WriteCapacityUnits: 5
            }, 
            TableName: tableName
        }, function(err, data){
            if(err){
                return done(err)
            }
            done()
        })
    });

    after(function(done) {
       dynamodb.deleteTable({
           TableName: tableName
       }, function(err, data){
           if(err){
               return done(err)
           }
           done()
       }) 
    });

    it('should return status ok', function(done){
        requestApi
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

    it('should be able to put record', function(done){
        requestDBServer
        .get('/get')
        .expect(200)
        .end((err, res) => {
            if(err){
                console.log(err)
                return done(err)
            }
            let body = res.body;
            body.status.should.match("ok")
            done()
        })
    })

    it('should be able to list records', function(done){
        requestDBServer
        .get('/list')
        .expect(200)
        .end((err, res) => {
            if(err){
                console.log(err)
                return done(err)
            }
            let body = res.body;
            body.Items.length.should.equal(1)
            body.Items.should.containEql({
                test_id: '11111'
            })
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

module.exports.get = (event, context, callback) => {

  dyCLient.put({
    TableName: tableName,
    Item: {
      test_id: "11111"
    }
  }, function(err, data){
    if(err){
      console.log(err)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(err)
      })
    }

    console.log(data);
    
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        status: "ok"
      }),
    };

    callback(null, response);
  })
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
