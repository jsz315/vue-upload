import * as qiniu from 'qiniu-js';
import axios from 'axios';
import config from '@/client/js/config';

function upload(file, item, path, token){
    //去掉前面的“/”
    var key = getKey(path + file.name);
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
    var key = getKey(path + item.name + "/");
    axios.get("/deleteFolder", {
        params: {url: key}
    }).then(res => {
        console.log(res.data);
    });
}

function deleteFile(item, path){
    var key = getKey(path + item.name);
    axios.get("/deleteFile", {
        params: {url: key}
    }).then(res => {
        console.log(res.data);
    });
}

function copyFolder(){

}

function copyFile(){

}

function getKey(url){
    if(url[0] == "/"){
        return url.substr(1);
    }
    return url;
}

export default {
    startUpload, 
    deleteFolder, 
    deleteFile,
    copyFolder,
    copyFiles,
}