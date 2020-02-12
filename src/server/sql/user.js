let connection;

const test = async function(){
    selectTotal();
}

const add = function(obj){
  
  var sql = "INSERT INTO `asset`.`user` (`openid`, `avatarUrl`, `nickName`, `gender`, `city`, `province`) VALUES (?, ?, ?, ?, ?, ?);";
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
  var sql = 'DELETE FROM `asset`.`user` WHERE `id` = ?';
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
  //UPDATE `asset`.`user` SET `openid` = 'jgjhkjjlkl', `avatarUrl` = 'ghghpp', `nickName` = 'kjjkll' WHERE (`id` = '1') and (`openid` = 'jgjhkjjlkl');
  var sql = "UPDATE `asset`.`user` SET `score` = ?, `time` = now() WHERE `openid` = ?;";
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

const updateInfo = function(obj){
  //UPDATE `asset`.`user` SET `openid` = 'jgjhkjjlkl', `avatarUrl` = 'ghghpp', `nickName` = 'kjjkll' WHERE (`id` = '1') and (`openid` = 'jgjhkjjlkl');
  var sql = "UPDATE `asset`.`user` SET `avatarUrl` = ?, `nickName` = ?, `gender` = ?, `city` = ?, `province` = ? WHERE `openid` = ?;";
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
  var  sql = 'SELECT * FROM `asset`.`user` WHERE `openid` = ?';
    var param = [id];
    return new Promise(resolve => {
      connection.query(sql, param, (err, result) => {
          if(err){
              console.log(err.message);
              return;
          }
          console.log('INSERT ID: ', result);     
          resolve(result);
      });
    });
}

const selectTotal = function(){
  sql = 'SELECT COUNT(`id`) AS total FROM `asset`.`user`';
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
    var  sql = 'SELECT * FROM `asset`.`user` LIMIT ?,?';
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

const ranks = function(){
  var  sql = 'SELECT * FROM `asset`.`user` ORDER BY `score` DESC LIMIT ?,?';
  var param = [0, 100];
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

const myRank = function(id){
  // var  sql = 'SELECT * FROM `asset`.`user` LIMIT ?,?';
  var sql = "SELECT (SELECT COUNT(1) + 1 FROM `asset`.`user` B WHERE B.score > A.score) AS rownumber FROM `asset`.`user` A WHERE A.openid = ?;";
  var param = [id];
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

const init = function(c){
  connection = c;
}

module.exports = {
    test,
    add,
    selectAll,
    selectOne,
    selectTotal,
    updateScore,
    updateInfo,
    remove,
    ranks,
    myRank,
    init
}