import config from './config';

function checkType(url){
    if(url.match(/\.(jpe?g|png|gif)$/i)){
        return config.FILE_TYPE.IMAGE;
    }
    else if(url.match(/\.(gltf|glb|fbx)$/i)){
        return config.FILE_TYPE.MODEL;
    }
    else if(url.match(/\.html$/i)){
        return config.FILE_TYPE.HTML;
    }
    else{
        var name = url.split("/").pop();
        if(name.indexOf(".") == -1){
            return config.FILE_TYPE.FOLDER;
        }
    }
    return config.FILE_TYPE.UNKNOW;
}

export default {checkType}