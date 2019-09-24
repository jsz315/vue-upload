const FILE_TYPE = {
    UNKNOW: 0,
    IMAGE: 1,
    MODEL: 2,
    FOLDER: 3
}

const HOST = "http://py325bkfy.bkt.clouddn.com";

const LINK = {
    UNKNOW: "/asset/img/file.png",
    IMAGE: "/asset/img/pic.png",
    MODEL: "/asset/img/3d.png",
    FOLDER: "/asset/img/folder.png",
    FRESH: "/asset/img/fresh.png"
}

const bucket = 'three-js-model';

export default {FILE_TYPE, HOST, LINK, bucket};