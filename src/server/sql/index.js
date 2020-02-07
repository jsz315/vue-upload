const mysql = require("mysql");

const config = require('../config');
// const database = config.databaseConfig.database;

const user = require("./user");
const question = require("./question");

let connection;
resetConnect();

function resetConnect() {
    if(!connection){
        connection = mysql.createConnection(config.databaseConfig);
    }
    connection.connect();
    user.init(connection);
    question.init(connection);

    connection.on('error', function(err) {
      if (!err.fatal) {
        return;
      }
   
      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
        console.log(err);
        return "无法连接数据库";
      }
   
      console.log('重新链接数据库');
      resetConnect();
    });
} 

const test = async function(){
    user.test();
    question.test();
}

const add = function(obj){
  
  var sql = "INSERT INTO `asset`.`rank` (`openid`, `avatarUrl`, `nickName`, `gender`, `city`, `province`) VALUES ('?', '?', '?', '?', '?', '?');";
  // var sql = 'INSERT INTO asset`.`question`(`type`, `question`, `answer1`, `answer2`, `answer3`, `answer4`, `right`, `level`, `file`, `time`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, now())';
              
      console.log(sql);
    var  param = [
      obj.openid,
      obj.avatarUrl,
      obj.nickName,
      obj.gender,
      obj.city,
      obj.province
    ]
    return new Promise(resolve => {
        connection.query(sql, param, (err, result) => {
            if(err){
                console.log(err.message);
                resolve(false);
                return;
            }
            console.log('INSERT ID: ', result); 
            resolve(true);    
        });
    });
}

const remove = function(id){
  var sql = 'DELETE FROM `asset`.`rank` WHERE id=?';
  var param = [id];
  return new Promise(resolve => {
    connection.query(sql, param, (err, result) => {
        if(err){
            console.log(err.message);
            return;
        }
        console.log('INSERT ID: ', result);     
        resolve(true);
    });
  });
}

const updateScore = function(obj){
  //UPDATE `asset`.`rank` SET `openid` = 'jgjhkjjlkl', `avatarUrl` = 'ghghpp', `nickName` = 'kjjkll' WHERE (`id` = '1') and (`openid` = 'jgjhkjjlkl');
  var sql = "UPDATE `asset`.`rank` SET `score` = '?', `time` = now() WHERE `openid` = '?';";
  // var sql = 'UPDATE `asset`.`question` SET `type` = ?, `question` = ?, `answer1` = ?, `answer2` = ?, `answer3` = ?, `answer4` = ?, `right` = ?, `level` = ?, `file` = ? WHERE (`id` = ?)';
  var param = [
      obj.score,
      obj.openid
  ]
  return new Promise(resolve => {
    connection.query(sql, param, (err, result) => {
        if(err){
            console.log(err.message);
            return;
        }
        console.log('INSERT ID: ', result);     
        resolve(true);
    });
  });
}

const updatInfo = function(obj){
  //UPDATE `asset`.`rank` SET `openid` = 'jgjhkjjlkl', `avatarUrl` = 'ghghpp', `nickName` = 'kjjkll' WHERE (`id` = '1') and (`openid` = 'jgjhkjjlkl');
  var sql = "UPDATE `asset`.`rank` SET `avatarUrl` = '?', `nickName` = '?', `gender` = '?', `city` = '?', `province` = '?' WHERE `openid` = '?';";
  // var sql = 'UPDATE `asset`.`question` SET `type` = ?, `question` = ?, `answer1` = ?, `answer2` = ?, `answer3` = ?, `answer4` = ?, `right` = ?, `level` = ?, `file` = ? WHERE (`id` = ?)';
  var param = [
    obj.avatarUrl,
    obj.nickName,
    obj.gender,
    obj.city,
    obj.province,
    obj.openid
  ]
  return new Promise(resolve => {
    connection.query(sql, param, (err, result) => {
        if(err){
            console.log(err.message);
            return;
        }
        console.log('INSERT ID: ', result);     
        resolve(true);
    });
  });
}

const selectOne = function(id){
  var  sql = 'SELECT * FROM `asset`.`rank` WHERE openid = ?';
    var param = [id];
    return new Promise(resolve => {
      connection.query(sql, param, (err, result) => {
          if(err){
              console.log(err.message);
              return;
          }
          console.log('INSERT ID: ', result);     
          resolve(true);
      });
    });
}

const selectTotal = function(){
  sql = 'SELECT COUNT(id) AS total FROM `asset`.`rank`';
  return new Promise(resolve => {
    connection.query(sql, (err, result) => {
      if(err){
          console.log(err.message);
          return;
      }
      console.log('INSERT ID: ', result);     
      console.log('total: ', result[0]['total']); 
      resolve(result[0]['total']);
    });
  })
}

const selectAll = function(){
    var  sql = 'SELECT * FROM `asset`.`rank` LIMIT ?,?';
    var param = [0, 300];
    return new Promise(resolve => {
      connection.query(sql, param, (err, result) => {
          if(err){
              console.log(err.message);
              return;
          }
          // console.log('INSERT ID: ', result);     
          resolve(result);
      });
    });
}


module.exports = {
    user,
    question
}