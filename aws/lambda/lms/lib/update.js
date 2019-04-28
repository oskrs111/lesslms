/**
 * @file lesslms, serverless LMS application.
 * @author Oscar Sanz Llopis <osanzl@uoc.edu>
 * @module lmsLambda/lib/update
 * @license MIT
 */

let AWS = require("aws-sdk");
let dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: 'eu-west-1'});

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
    _gene = _execute(args.params, (error, result) => {
         if(error) callback(error);
         else callback(null, result);
    });
    _gene.next();
}


function* _execute(params, callback){
    let _r = {};
    _gen = _update_proc(params, (error, result) => {
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
 let _body = JSON.parse(params);     
 console.log('update:_user_proc', _body, typeof _body);
 
 let _d = new Date().getTime() + '';
 let _params = {
  ExpressionAttributeNames: {
   "#TYP": "type",
   "#MD": "mDate",
   "#CON": "content"
  }, 
  ExpressionAttributeValues: {
   ":t": {
     S:  _body.type
    },
   ":md": {
     S:  _d
    },
    ":c": {
     S: JSON.stringify(_body.content)
    },
  }, 
  Key: {
   "sourceId": {
     S: _body.id
    }, 
   "relatedId": {
     S: _body.rid
    }
  }, 
  ReturnValues: "ALL_NEW", 
  TableName: "courses", 
  UpdateExpression: "SET #TYP = :t, #MD = :md, #CON = :c"
 };
 
 if(_body.cd != undefined){
  _params.ExpressionAttributeValues[":cd"] = {
     S:  _body.cd
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
      _gen.return(true);
      callback(null, data);
    } 
 });    
 yield;
}

module.exports = update;