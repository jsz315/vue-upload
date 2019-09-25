const mysql = require("mysql");

const config = require('./config');

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

const test = function(){
    var sql = `SELECT 1 + 1 AS solution`;
    connection.query(sql, function(error, results, fields){
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    })
}

const insert = function(url){
    // var  sql = 'INSERT INTO `qiniu`.`asset`(`path`, `type`) VALUES(?, ?)';
    var sql = `
            INSERT INTO qiniu.asset(path, type)
            SELECT "${url}", 0
            FROM dual
            WHERE NOT EXISTS(SELECT * FROM qiniu.asset WHERE path='${url}')
        `;
    // var  param = [url, 0];
    return new Promise(resolve => {
        connection.query(sql, (err, result) => {
            if(err){
                console.log(err.message);
                resolve(false);
                return;
            }
            console.log('INSERT ID: ', result); 
            resolve(true);    
        });
    })
   
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
    insert,
    selectAll,
    selectPath,
    deleteFolder,
    deleteFile,
    copyFolder,
    copyFile
}