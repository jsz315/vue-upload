const {readHtml, saveHtml, readTxt, saveTxt, readShare, readFilter} = require('../fileTooler');

const core = {
  shareData: readShare(),
  filterData: readFilter()
}

module.exports = core