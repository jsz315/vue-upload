function start(file, item, url) {
    var fd = new FormData();
    fd.append("file", file);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.upload.addEventListener("progress", (e) => {
        item.percentage = Math.round((e.loaded * 100) / e.total);
    }, false);
    xhr.onload = function() {
        item.loading = false;
    };
    xhr.send(fd);
}

export default {start}