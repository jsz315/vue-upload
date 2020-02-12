let connection;

const test = async function(){
    // var sql = `SELECT 1 + 1 AS solution`;
    // connection.query(sql, function(error, results, fields){
    //     if (error) throw error;
    //     console.log('The solution is: ', results[0].solution);
    // })

    // await update({
    //   type: 0,
    //   question: "就会更多的",
    //   answer1: "更好",
    //   answer2: "快捷键",
    //   answer3: "老婆",
    //   answer4: "放大",
    //   right: 2,
    //   level: 0,
    //   file: "",
    //   id: 1
    // })
    // await remove(1);

    // selectOne(2);
    selectTotal();

}

const add = function(obj){
  // INSERT INTO `asset`.`question` (`type`, `question`, `answer1`, `answer2`, `answer3`, `answer4`, `right`, `level`) VALUES ('1', '找借口', 'a', 'b', 'c', 'd', '2', '1');

    // var  sql = 'INSERT INTO `qiniu`.`asset`(`path`, `type`) VALUES(?, ?)';
    var sql = 'INSERT INTO `asset`.`question`(`type`, `question`, `answer1`, `answer2`, `answer3`, `answer4`, `right`, `level`, `file`, `time`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, now())';
              
      console.log(sql);
    var  param = [
      obj.type,
      obj.question,
      obj.answer1,
      obj.answer2,
      obj.answer3,
      obj.answer4,
      obj.right,
      obj.level,
      obj.file
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
  var sql = 'DELETE FROM `asset`.`question` WHERE `id` = ?';
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

const update = function(obj){
  var sql = 'UPDATE `asset`.`question` SET `type` = ?, `question` = ?, `answer1` = ?, `answer2` = ?, `answer3` = ?, `answer4` = ?, `right` = ?, `level` = ?, `file` = ? WHERE (`id` = ?)';
  var param = [
      obj.type,
      obj.question,
      obj.answer1,
      obj.answer2,
      obj.answer3,
      obj.answer4,
      obj.right,
      obj.level,
      obj.file,
      obj.id
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
  var  sql = 'SELECT * FROM `asset`.`question` WHERE `id` = ?';
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
  sql = 'SELECT COUNT(`id`) AS total FROM `asset`.`question`';
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
    var  sql = 'SELECT * FROM `asset`.`question` LIMIT ?,?';
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

const selectLevel = function(level){
  var  sql = 'SELECT * FROM `asset`.`question` WHERE `level` = ? LIMIT ?,?';
    var param = [level, 0, 300];
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

const selectType = function(type){
  var  sql = 'SELECT * FROM `asset`.`question` WHERE `type` = ? LIMIT ?,?';
    var param = [level, 0, 300];
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
    selectLevel,
    selectType,
    update,
    remove,
    init
}