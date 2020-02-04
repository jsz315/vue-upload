const axios = require('axios');

function getTypeFile(type, file){
  var str;
  if(type == 1){
    str = "/media/image/" + file;
  }
  else if(type == 2){
    str = "/media/audio/" + file;
  }
  else if(type == 3){
    str = "/media/video/" + file;
  }
  return str;
}

function getFolder(path, fullPath){
    var p = path.replace(/\/$/, "");
    var list = fullPath.split("/");
    list.pop();
    return p + list.join("/");
}

function updateQuestion(file, obj, onProgress){
  let data = new FormData();
  if(file){
    data.append('fileName', file.name);
    data.append('file', file);
  }
  
  for(var i in obj){
    data.append(i, obj[i]);
  }

  let config = {
    onUploadProgress: progressEvent => {
      var n = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      // var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
      console.log(n + '%');
      onProgress(n)
    }
  }
  axios.post(`/yun/question/update`, data, config).then((res) => {
      console.log(res.data);
  })
}

function addQuestion(file, obj, onProgress){
  let data = new FormData();
  if(file){
    data.append('fileName', file.name);
    data.append('file', file);
  }
  
  for(var i in obj){
    data.append(i, obj[i]);
  }

  let config = {
    onUploadProgress: progressEvent => {
        var n = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        // var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
        console.log(n + '%');
        onProgress(n)
    }
  }
  axios.post(`/yun/question/add`, data, config).then((res) => {
      console.log(res.data);
  })
}

function removeQuestion(obj){
  axios.post(`/yun/question/remove`, {
    id: obj.id,
    type: obj.type,
    file: obj.file
  }).then((res) => {
    console.log(res.data);
  })
}

function startUpload(file, item, path) {
    var t = getFolder(path, file.fullPath);
    let data = new FormData();
    data.append('fileName', file.name);
    data.append('file', file);
    data.append('path', t);

    // axios({
    //     method: 'post',
    //     timeout: 2000,
    //     url: '/upload',
    //     data: data
    // })
    // .then(response => {
    //     console.log(response.data)
    // })
    // .catch(error => {
    //     console.log(error)
    // })

    let config = {
        onUploadProgress: progressEvent => {
            var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
            console.log(complete);
            item.percentage = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            if(item.percentage == 100){
                item.loading = false;
            }
        }
    }

    axios.post(`/yun/upload`, data, config).then((res) => {
        console.log(res.data);
    })
}


//上传参数为/key
function deleteFolder(item, path){
    var key = path + item.name;
    axios.get("/yun/deleteFolder", {
        params: {url: key}
    }).then(res => {
        console.log(res.data);
    });
}

//上传参数为/key
function deleteFile(item, path){
    var key = path + item.name;
    axios.get("/yun/deleteFile", {
        params: {url: key}
    }).then(res => {
        console.log(res.data);
    });
}

export default {
    startUpload,
    getTypeFile,
    addQuestion,
    updateQuestion,
    removeQuestion,
    deleteFolder,
    deleteFile
}
