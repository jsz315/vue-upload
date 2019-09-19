var qiniu = require('qiniu')

var accessKey = 'MDNdTeEsk_7k4LrKpMwSO_ZtrbOoWPwbMRk4pA8w';
var secretKey = 'vNlCEQ2elBBnxT-h-16kVS-yDzil7qjybSw9K9QK';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const getToken = function(){
    var options = {
        scope: 'three-model',
    };
    
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
}

module.exports = {getToken};