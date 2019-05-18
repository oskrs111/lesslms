/**
 * @file lesslms, serverless LMS application.
 * @author Oscar Sanz Llopis <osanzl@uoc.edu>
 * @module lmsLambda/lib/update
 * @license MIT
 */

let AWS = require("aws-sdk");
let dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10' });

let _gen = {};
let _gene = {};
/**
 * Funtion to delete a item on courses table.
 * @function
 * @param {Object} args Input arguments for the function.
 * @param {string} args.params call parameters from client application.
 * @callback callback Return callback function.
 * @description This function first appends new course both to 'users' table and 'courses' table.
 */
function del(args, callback){
     console.log('delete',args, typeof args);
     AWS.config.update({region: args.params.region});
    _gene = _execute(args.params, (error, result) => {
         if(error) callback(error);
         else callback(null, result);
    });
    _gene.next();
}


function* _execute(params, callback){
    let _body = JSON.parse(params);  
    let _r = {};
    _gen = _delete_proc(_body, (error, result) => {
         if(error){
            callback(error);  
            _gene.return(false);
         } 
         else {
             _r.update = result;
             callback(null, _r);
             _gene.next();
         }
    });
    _gen.next();
    yield;
    
}

function* _delete_proc(params, callback){
    
 console.log('delete:_del_proc', params, typeof params);
 
 let _d = new Date().getTime() + '';
 let _params = {};
    
    if(params.type == 'tCOURSE'){
      _params = {
      Key: {
       "userId": {
         S: params.rid
        }, 
       "sourceId": {
         S: params.id
        }
      }, 
      TableName: "users", 
     };
    }
    else{
      _params = {
      Key: {
       "relatedId": {
         S: params.id
        }, 
       "sourceId": {
         S: params.rid
        }
      }, 
      TableName: "courses", 
     };
    }
 
 console.log('delete#2:', _params);
 dynamodb.deleteItem(_params, function(err, data) {
    if (err) {
        console.log('dynamodb.deleteItem:', err);
        callback(err);
        _gen.return(false);
    }
    else{
      callback(null, {deleted: params.id, table: _params.TableName});    
      _gen.next();
    } 
 });    
 yield;
 
}

module.exports = del;