const mysql = require("mysql");

const config = require('./config');
const database = config.databaseConfig.database;

let connection;
resetConnect();

function resetConnect() {
    if(!connection){
        connection = mysql.createConnection(config.databaseConfig);
    }
    connection.connect();
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
              
    // var sql = `INSERT INTO 'asset'.'question'('type', 'question', 'answer1', 'answer2', 'answer3', 'answer4', 'right', 'level', 'file', 'time') VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, now())`;
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
  var sql = 'DELETE FROM `asset`.`question` WHERE id=?';
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
  var  sql = 'SELECT * FROM `asset`.`question` WHERE id = ?';
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
  sql = 'SELECT COUNT(id) AS total FROM `asset`.`question`';
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
    // var  sql = 'SELECT * FROM `asset`.`question` LIMIT ?,?';
    var  sql = `SELECT * FROM asset.question 
    LIMIT ?,?`;
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
    // sql = 'SELECT COUNT(id) AS total FROM `asset`.`question`';
    // connection.query(sql, (err, result) => {
    //   if(err){
    //       console.log(err.message);
    //       return;
    //   }
    //   console.log('INSERT ID: ', result);     
    //   console.log('total: ', result[0]['total']);     
    // });
}


const selectPath = function(path){
    var  sql = `
        SELECT DISTINCT
        IFNULL(SUBSTRING_INDEX(SUBSTR(path,
                CHAR_LENGTH('${path}') + 1),
                '/',
                1),
            SUBSTR(path,
                CHAR_LENGTH('${path}') + 1)) as cpath
        FROM
            qiniu.asset
        WHERE
            path LIKE '${path}%';
    `;
    return new Promise(resolve => {
        connection.query(sql, (err, result, fields) => {
            if(err){
                console.log(err.message);
                return;
            }
            // var t1 = JSON.stringify(result);
            // var t2 = JSON.parse(t1);
            console.log(Object.values(result));
            var list = [];
            for(var i = 0; i < result.length; i++){
                for(var j in result[i]){
                    console.log('INSERT ID: ', result[i][j]);
                    list.push(result[i][j]);
                }
            }
            resolve(list);
        });
    })
    
}

//上传参数为/key
const deleteFolder = function(key){
    let link = config.HOST + key + "/";
    return new Promise(resolve => {
        var sql = `delete from qiniu.asset where path like "${link}%"`;
        connection.query(sql, function(error, results, fields){
            if (error) throw error;
            resolve(true);
        })
    })
}

//上传参数为/key
const deleteFile = function(key){
    let link = config.HOST + key;
    return new Promise(resolve => {
        var sql = `delete from qiniu.asset where path="${link}"`;
        connection.query(sql, function(error, results, fields){
            if (error) throw error;
            resolve(true);
        })
    })

}

//上传参数为文件名和/路径/
const copyFolder = function(names, srcPath, destPath, isCut){
    var list;
    if(isCut){
        list = names.map(name => {
            var sql = `
                UPDATE qiniu.asset 
                SET 
                    path = REPLACE(path, '${config.HOST}${srcPath}${name}', '${config.HOST}${destPath}${name}')
                WHERE
                    path like '${config.HOST}${srcPath}${name}'/%;
            `;
            return sql;
        })
    }
    else{
        list = names.map(name => {
            var sql = `
                INSERT INTO qiniu.asset (path, type)
                SELECT replace(path, '${config.HOST}${srcPath}${name}/', '${config.HOST}${destPath}${name}/'), type
                FROM qiniu.asset
                WHERE path like '${config.HOST}${srcPath}${name}/%';
            `;
            return sql;
        })
    }
    return new Promise(resolve => {
        connection.query(list.join(""), function(error, results, fields){
            if (error) throw error;
            resolve(true);
        })
    })
}

//上传参数为文件名和/路径/
const copyFile = function(names, srcPath, destPath, isCut){
    var list;
    if(isCut){
        list = names.map(name => {
            var sql = `
                UPDATE qiniu.asset 
                SET 
                    path = REPLACE(path, '${config.HOST}${srcPath}${name}', '${config.HOST}${destPath}${name}')
                WHERE
                    path = '${config.HOST}${srcPath}${name}';
            `;
            return sql;
        })
    }
    else{
        list = names.map(name => {
            var sql = `
                INSERT INTO qiniu.asset (path, type)
                SELECT replace(path, '${config.HOST}${srcPath}${name}', '${config.HOST}${destPath}${name}'), type
                FROM qiniu.asset
                WHERE path = '${config.HOST}${srcPath}${name}';
            `;
            return sql;
        })
    }

    return new Promise(resolve => {
        connection.query(list.join(""), function(error, results, fields){
            if (error) throw error;
            resolve(true);
        })
    })
    
}

module.exports = {
    test,
    add,
    selectAll,
    selectTotal,
    update,
    remove,
    selectPath,
    deleteFolder,
    deleteFile,
    copyFolder,
    copyFile
}