import * as qiniu from 'qiniu-js';
import axios from 'axios';
import config from '@/client/js/config';

function upload(file, item, path, token){
    //去掉前面的“/”
    var key = (path + file.name).substr(1);
    var putExtra = {
        fname: file.name,
        params: {},
        mimeType: null
    };
    var config = {
        useCdnDomain: true,
        region: qiniu.region.z2
    };

    return new Promise(resolve => {
        var observable = qiniu.upload(file, key, token, putExtra, config);
        var observer = {
            next(res){
                var n = Math.floor(res.total.percent);
                item.percentage = n;
            },
            error(err){
                console.log(err);
                if(err.code == 614){
                    item.loading = false;
                    item.exist = true;
                }
                resolve(false);
            },
            complete(res){
                item.loading = false;
                console.log("上传完成：" + key);
                console.log(item);
                resolve(true);
            }
        }
        observable.subscribe(observer);
    })
}

async function startUpload(item, path, token){
    var suc = await upload(item.file, item, path, token);
    if(suc){
        axios.get("/insert", {
            params: {url: `${config.HOST}${path}${item.name}`}
        }).then(res => {
            console.log(res.data);
        });
    }
}

function deleteFolder(item, path){

}

function deleteFile(item, path){
    var key = (path + item.name).substr(1);

    var client = new qiniu.rs.Client();
    //你要测试的空间， 并且这个key在你空间中存在
    bucket = config.bucket;
    //删除资源
    client.remove(bucket, key, function(err, ret) {
        if (!err) {
            console.log("删除成功");
            console.log(ret);
        } else {
            console.log(err);
        }
    });
}

export default {startUpload, deleteFolder, deleteFile}