'use strict';

let AWS = require('aws-sdk')
let awsConfig = {
  "apiVersion": "2012-08-10",
  "accessKeyId": "abcde",
  "secretAccessKey": "abcde",
  "region":process.env.AWS_REGION,
  "endpoint": "http://db:8000"
}

if(process.env.NODE_ENV){
  awsConfig = {
    "region": process.env.AWS_REGION
  }
}

let dyClient = new AWS.DynamoDB.DocumentClient(awsConfig)
let tableName = process.env.TABLE_NAME
module.exports.get = (event, context, callback) => {

  dyClient.put({
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

module.exports.list = (event, context, callback) => {
  dyClient.scan({
    TableName: tableName
  }, function(err, data){
    if(err){
      console.log(err)
      callback(null, {
        statusCode: 400,
        body: JSON.stringify(err)
      })
    }

    console.log(data)
    const response = {
      statusCode: 200,
      body: JSON.stringify(data),
    };

    callback(null, response);

  })
}
