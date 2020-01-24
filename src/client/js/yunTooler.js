const axios = require('axios');

function startUpload(file, item) {
    let data = new FormData();
    data.append('fileName', file.name);
    data.append('file', file);

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

    axios.post(`/upload`, data, config).then((res) => {
        console.log(res.data);
    })
}

export default {
    startUpload
}