import * as qiniu from 'qiniu-js';

function start(file, item, path, token){
    var key = path + file.name;
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

export default {start}