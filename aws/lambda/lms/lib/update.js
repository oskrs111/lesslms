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
 * Funtion to update new content to courses table.
 * @function
 * @param {Object} args Input arguments for the function.
 * @param {string} args.params call parameters from client application.
 * @callback callback Return callback function.
 * @description This function first appends new course both to 'users' table and 'courses' table.
 */
function update(args, callback){
     console.log('update',args, typeof args);
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
    _gen = _update_proc(_body, (error, result) => {
         if(error){
            callback(error);  
            _gene.return(false);
         } 
         else {
             _r.update = result;
             _gene.next();
         }
    });
    _gen.next();
    yield;
    
    //OSLL: Every object adds two registers
    _body.id = _body.rid;
    _gen = _update_proc(_body, (error, result) => {
         if(error){
            callback(error);  
            _gene.return(false);
         } 
         else {
             _r.update = result;
             callback(null, _r);
             _gene.return(true);
         }
    });
    _gen.next();
    yield;    
    
}

function* _update_proc(params, callback){
    
 console.log('update:_user_proc', params, typeof _body);
 
 let _d = new Date().getTime() + '';
 let _params = {
  ExpressionAttributeNames: {
   "#OID": "originId",
   "#TYP": "type",
   "#MD": "mDate",
   "#CON": "content"
  }, 
  ExpressionAttributeValues: {
   ":t": {
     S:  params.type
    },
   ":md": {
     S:  _d
    },
    ":c": {
     S: JSON.stringify(params.content)
    },
       ":oid": {
     S:  params.oid
    }
  }, 
  Key: {
   "sourceId": {
     S: params.id
    }, 
   "relatedId": {
     S: params.rid
    }
  }, 
  ReturnValues: "ALL_NEW", 
  TableName: "courses", 
  UpdateExpression: "SET #TYP = :t, #MD = :md, #CON = :c, #OID = :oid"
 };
 
 if(params.cd != undefined){
  _params.ExpressionAttributeValues[":cd"] = {
     S:  params.cd
    };
    
  _params.ExpressionAttributeNames["#CD"] = "cDate";  
  _params.UpdateExpression += ', #CD = :cd';
 }
 
 console.log('update:', _params);
 
 dynamodb.updateItem(_params, function(err, data) {
    if (err) {
        console.log('dynamodb.updateItem:', err);
        _gen.return(false);
        callback(err);
    }
    else{
      _gen.next();
      callback(null, data);
    } 
 });    
 yield;
}

module.exports = update;