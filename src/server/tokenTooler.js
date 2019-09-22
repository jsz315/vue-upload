var qiniu = require('qiniu')


// const getToken = function(){

//     var accessKey = 'MDNdTeEsk_7k4LrKpMwSO_ZtrbOoWPwbMRk4pA8w';
//     var secretKey = 'vNlCEQ2elBBnxT-h-16kVS-yDzil7qjybSw9K9QK';
//     var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

//     var options = {
//         scope: 'three-js-model',
//         returnBody: '{"key":"$(key)",fsize":$(fsize),"bucket":"$(bucket)"}'
//     };
    
//     var putPolicy = new qiniu.rs.PutPolicy(options);
//     var uploadToken = putPolicy.uploadToken(mac);
//     return uploadToken;
// }

// module.exports = {getToken};

const getToken = function(){
    let accessKey = 'MDNdTeEsk_7k4LrKpMwSO_ZtrbOoWPwbMRk4pA8w';
    let secretKey = 'vNlCEQ2elBBnxT-h-16kVS-yDzil7qjybSw9K9QK';
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let options = {
        scope: 'three-js-model', //七牛资源目录
        deadline: Date.now() + 3600 * 1000
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
}

module.exports = {getToken};