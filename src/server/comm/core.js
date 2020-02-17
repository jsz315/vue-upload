const {readHtml, saveHtml, readTxt, saveTxt, readJson, saveJson} = require('../fileTooler');

const core = {
  shareData: readJson()
}

module.exports = core