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

    var observable = qiniu.upload(file, key, token, putExtra, config);
    var observer = {
        next(res){
            var n = Math.floor(res.total.percent);
            item.percentage = n;
        },
        error(err){
            console.log(err);
        },
        complete(res){
            item.loading = false;
            console.log("上传完成：" + key);
            console.log(item);
        }
    }
    var subscription = observable.subscribe(observer);
}

export default {start}