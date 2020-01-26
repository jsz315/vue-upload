import config from '@/client/js/config'
import typeTooler from '@/client/js/typeTooler'

function addItem(obj, path){
    var fname;
    var isFile;
    if(typeof(obj) == "string"){
        fname = obj;
        isFile = false;
    }
    else{
        fname = obj.fullPath ? obj.fullPath.substr(1) : obj.name;
        isFile = true;
    }
    var item = {
                    name: fname,
                    percentage: 0,
                    loading: isFile,
                    exist: false,
                    file: isFile ? obj : null,
                    selected: false,
                    isFolder: false,
                    isModel: false
                };
    var fileType = typeTooler.checkType(fname);
    console.log(item);
    if(fileType == config.FILE_TYPE.IMAGE){
        if(isFile){
            item.src = config.LINK.IMAGE;
            var fr = new FileReader();
            fr.readAsDataURL(obj);
            fr.onload = () => {
                item.src = fr.result;
            };
        }
        else{
            // if(fname.indexOf(config.HOST) == -1){
            //     item.src = `${config.HOST}${path}${fname}`;
            // }
            // else{
            //     item.src = fname;
            //     item.name = fname.split("/").pop();
            // }
            item.src = `${path}${fname}`;
            item.name = fname.split("/").pop();
        }
    }
    else if(fileType == config.FILE_TYPE.MODEL){
        item.src = config.LINK.MODEL;
        item.isModel = true;
    }
    else if(fileType == config.FILE_TYPE.FOLDER){
        item.src = config.LINK.FOLDER;
        item.isFolder = true;
    }
    else{
        item.src = config.LINK.UNKNOW;
    }
    // this.$store.commit('addFiles', item);
    return item;
}

export default {addItem}