/**
 * @file lesslms, serverless LMS application.
 * @author Oscar Sanz Llopis <osanzl@uoc.edu>
 * @module lmsLambda/lib/fetch
 * @license MIT
 */

let AWS = require("aws-sdk");
let dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10', region: 'eu-west-1'});

let _gen = {};
let _gene = {};
/**
 * Funtion to fetch data from DynamoDB.
 * @function
 * @param {Object} args Input arguments for the function.
 * @param {string} args.params call parameters from client application.
 * @callback callback Return callback function.
 * @description This function recovers data from 'courses' table or 'users' table by looking to '@' character in the request 'id' attribute.
 */
function fetch(args, callback){
    _gene = _execute(args.params, (error, result) => {
         console.log('fetch::_execute:', result);    
         if(error) callback(error);
         else callback(null, result);
    });
    _gene.next();
}


function* _execute(params, callback){
    let _r = {};
    _gen = _fetch_proc(params, (error, result) => {
         if(error){
            callback(error);  
            _gene.return(false);
         } 
         else {
             _r = result;
             callback(null, _r);
             _gene.return(true);
         }
    });
    _gen.next();
    yield;    
}

function* _fetch_proc(params, callback){
 let _query = params;     
 console.log('fetch:_fetch_proc', _query, typeof _query);
 
 let _table = '';
 let _key = ''
 if(_query.id.indexOf('@') > 0){
   _table = 'users';
   _key = 'userId'
 } 
 else{
    _table = 'courses';
    _key = 'sourceId'
 } 
 
 let _params = {
    TableName : _table,
    KeyConditionExpression: "#src = :src",
    ExpressionAttributeNames:{
        "#src": _key
    },
    ExpressionAttributeValues: {
        ":src": _query.id
    }
 };
 
 console.log('fetch:', _params);
 
 dynamodb.query(_params, function(err, data) {
    if (err) {
        console.log('dynamodb.query:', err);
        _gen.return(false);
        callback(err);
    }
    else{
    console.log('dynamodb.query:', data);    
      _gen.return(true);
      data.resolved = _table;
      callback(null, data);  
    } 
 });    
 yield;
}

module.exports = fetch;