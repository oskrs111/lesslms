/**
 * @file lesslms, serverless LMS application.
 * @author Oscar Sanz Llopis <osanzl@uoc.edu>
 * @module lmsLambda/lib/fetch
 * @license MIT
 */

let AWS = require("aws-sdk");
let dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10' });

let _gen = {};
let _gene = {};
/**
 * Funtion to get single item from DynamoDB.
 * @function
 * @param {Object} args Input arguments for the function.
 * @param {string} args.params call parameters from client application.
 * @callback callback Return callback function.
 * @description This function recovers data from 'courses' table or 'users' table by looking to '@' character in the request 'id' attribute.
 */
function get(args, callback){
     console.log('get',args, typeof args);
     AWS.config.update({region: args.params.region});
    _gene = _execute(args.params, (error, result) => {
         console.log('fetch::_execute:', result);    
         if(error) callback(error);
         else callback(null, result);
    });
    _gene.next();
}


function* _execute(params, callback){
    let _r = {};
    _gen = _get_proc(params, (error, result) => {
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

function* _get_proc(params, callback){

 console.log('get:_get_proc', params, typeof params);
 
 let _params = {
    TableName : 'courses',
    Key: {
   "sourceId": {
     S: params.id
    }, 
   "relatedId": {
     S: params.id
    }
  }, 
 };
 
 console.log('get:', _params);
 dynamodb.getItem(_params, function(err, data) {
    if (err) {
        console.log('dynamodb.query:', err);
        _gen.return(false);
        callback(err);
    }
    else{
    console.log('dynamodb.query:', data);    
      _gen.return(true);
      callback(null, data);  
    } 
 });    
 yield;
}

module.exports = get;