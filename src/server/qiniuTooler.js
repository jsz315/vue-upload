var qiniu = require('qiniu')
var config = require('./config');

let accessKey = config.accessKey;
let secretKey = config.secretKey;
let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
let bucketManager = getBucketManager();

function getBucketManager(){
    var config = new qiniu.conf.Config();
    //config.useHttpsDomain = true;
    config.zone = qiniu.zone.Zone_z2;
    var bucketManager = new qiniu.rs.BucketManager(mac, config);
    console.log("bucketManager------------");
    console.log(bucketManager);
    return bucketManager;
}

const getToken = function(key){
    let options = {
        scope: key ? (config.bucket + ':' + key) : config.bucket, //七牛资源目录
        deadline: Date.now() + 3600 * 1000
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
}

//上传参数为/key
const deleteFile = function(key){
    key = getKey(key);
    return new Promise(resolve => {
        bucketManager.delete(config.bucket, key, function(err, ret) {
            if (!err) {
                // ok
                console.log("删除成功：" + key);
                resolve(true);
            } else {
                console.log(err);
                resolve(false);
            }
        });
    })
}

//上传参数为/key
const deleteFolder = async function(key){
    var res = await getFiles(getKey(key));
    res.items.forEach(item => {
        deleteFile(item.key);
    })
    if(res.nextMarker){
        console.log("----------------继续删除----------------");
        deleteFolder(key);
    }
    else{
        console.log("----------------删除完毕----------------");
    }
}

//上传参数为文件名和/路径/
const copyFile = function(names, srcPath, destPath){
    return new Promise(async resolve => {
        var srcBucket = config.bucket;
        var destBucket = config.bucket;

        //每个operations的数量不可以超过1000个，如果总数量超过1000，需要分批发送
        // var copyOperations = [
            // qiniu.rs.copyOp(srcBucket, srcKey, destBucket, 'qiniu1.mp4'),
            // qiniu.rs.copyOp(srcBucket, srcKey, destBucket, 'qiniu2.mp4'),
            // qiniu.rs.copyOp(srcBucket, srcKey, destBucket, 'qiniu3.mp4'),
            // qiniu.rs.copyOp(srcBucket, srcKey, destBucket, 'qiniu4.mp4'),
        // ];

        var copyOperations = names.map(name => {
            var srcKey = getKey(srcPath + name);
            var destKey = getKey(destPath + name);
            return qiniu.rs.copyOp(srcBucket, srcKey, destBucket, destKey);
        })
        await moveFiles(copyOperations);
        resolve();
    })
}

//文件批量转移
const moveFiles = function(copyOperations){
    return new Promise(resolve => {
        bucketManager.batch(copyOperations, function(err, respBody, respInfo) {
            if (err) {
                console.log(err);
                //throw err;
            } else {
                // 200 is success, 298 is part success
                if (parseInt(respInfo.statusCode / 100) == 2) {
                    respBody.forEach(function(item) {
                        if (item.code == 200) {
                            console.log(item.code + "\tsuccess");
                            resolve();
                        } else {
                            console.log(item.code + "\t" + item.data.error);
                        }
                    });
                } else {
                    console.log(respInfo.deleteusCode);
                    console.log(respBody);
                }
            }
        });
    });
}

//上传参数为文件名和/路径/
const copyFolder = async function(names, srcPath, destPath){
    names.forEach((name) => {
        var key = getKey(srcPath + name);
        moveFolder(key, srcPath, destPath);
    })
}

//移动文件夹下的文件
const moveFolder = async function(key, srcPath, destPath){
    var res = await getFiles(key);
    var srcBucket = config.bucket;
    var destBucket = config.bucket;

    console.log(key, srcPath, destPath);

    var copyOperations = res.items.map(item => {
        var srcKey = item.key;
        var f = getFolderPath(srcKey);
        var destKey = getKey(item.key.replace(f + "/", destPath + f + "/"));

        console.log("copy------- " + f);
        console.log(srcKey);
        console.log(destKey);

        return qiniu.rs.copyOp(srcBucket, srcKey, destBucket, destKey);
    })

    await moveFiles(copyOperations);
    if(res.nextMarker){
        console.log("----------------继续复制----------------");
        moveFolder(key, srcPath, destPath);
    }
    else{
        console.log("----------------复制完毕----------------");
    }
}

//参数为不带/的文件夹名称
const getFiles = function(prefix){
    // @param options   列举操作的可选参数
    // prefix           列举的文件前缀，为空则删除根目录下的所有文件
    // marker           上一次列举返回的位置标记，作为本次列举的起点信息
    // limit            每次返回的最大列举文件数量
    // delimiter        指定目录分隔符
    var options = {
        limit: 10,
        prefix: prefix + "/",
    };
    return new Promise(resolve => {
        bucketManager.listPrefix(config.bucket, options, function(err, respBody, respInfo) {
            if (err) {
                console.log(err);
                throw err;
            }
            var items = [];
            var nextMarker = 0;
            if (respInfo.statusCode == 200) {
                //如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
                //指定options里面的marker为这个值
                nextMarker = respBody.marker;
                var commonPrefixes = respBody.commonPrefixes;
                console.log("nextMarker:" + nextMarker);
                console.log("commonPrefixes:" + commonPrefixes);
                items = respBody.items;
                items.forEach(function(item) {
                    console.log(item.key);          
                });
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
            }
            resolve({items, nextMarker});
        });
    })
}

function getKey(url){
    if(url[0] == "/"){
        return url.substr(1);
    }
    return url;
}

function getFolderPath(url){
    var list = url.split("/");
    list.pop();
    return list.join("/");
}

module.exports = {
    getToken,
    getFiles,
    deleteFile,
    deleteFolder,
    copyFile,
    copyFolder
};