const mysql = require("mysql");

const config = {
    host: "localhost",
    user: "root",
    password: "Jsz04005301",
    database: "qiniu"
}

let connection;
resetConnect();

function resetConnect() {
    if(!connection){
        connection = mysql.createConnection(config);
    }
    connection.connect();
    connection.on('error', function(err) {
      if (!err.fatal) {
        return;
      }
   
      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
        throw err;
      }
   
      console.log('重新链接数据库');
      resetConnect();
    });
} 

const test = function(){
    var sql = `SELECT 1 + 1 AS solution`;
    connection.query(sql, function(error, results, fields){
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    })
}

const insert = function(url){
    var list = url.split("/");
    var name = list.pop();
    var  sql = 'INSERT INTO `qiniu`.`asset`(`path`, `type`) VALUES(?, ?)';
    var  param = [url, 0];
    // INSERT INTO `qiniu`.`asset`(`path`, `name`, `type`) VALUES ('http://py325bkfy.bkt.clouddn.com/', 't1.jpg', 0);
    
    connection.query(sql, param, (err, result) => {
        if(err){
            console.log(err.message);
            return;
        }
        console.log('INSERT ID: ', result);     
    });
}

const selectAll = function(url){
    var  sql = 'SELECT * FROM qiniu.asset';
    connection.query(sql, (err, result) => {
        if(err){
            console.log(err.message);
            return;
        }
        console.log('INSERT ID: ', result);     
    });
}

const selectPath = function(path){
    var  sql = `
        SELECT DISTINCT
        IFNULL(SUBSTRING_INDEX(SUBSTR(path,
                        LENGTH('${path}') + 1),
                        '/',
                        1),
                SUBSTR(path,
                    LENGTH('${path}') + 1))
        FROM
            qiniu.asset
        WHERE
            path LIKE '${path}%';
    `;
    connection.query(sql, (err, result) => {
        if(err){
            console.log(err.message);
            return;
        }
        console.log('INSERT ID: ', result);     
    });
}

module.exports = {
    test,
    insert,
    selectAll,
    selectPath
}