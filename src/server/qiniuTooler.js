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

const deleteFile = function(key){
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

const deleteFolder = async function(key){
    var res = await getFiles(key);
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

const getFiles = function(prefix){
    // @param options   列举操作的可选参数
    // prefix           列举的文件前缀，为空则删除根目录下的所有文件
    // marker           上一次列举返回的位置标记，作为本次列举的起点信息
    // limit            每次返回的最大列举文件数量
    // delimiter        指定目录分隔符
    var options = {
        limit: 10,
        prefix: prefix,
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

module.exports = {
    getToken,
    deleteFile,
    getFiles,
    deleteFolder
};