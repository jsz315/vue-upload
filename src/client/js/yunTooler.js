const axios = require('axios');

function startUpload(file) {
    let data = new FormData();
    data.append('fileName', file.name);
    data.append('file', file);

    axios({
        method: 'post',
        timeout: 2000,
        url: '/upload',
        data: data
    })
    .then(response => {
        console.log(response.data)
    })
    .catch(error => {
        console.log(error)
    })
}

export default {
    startUpload
}