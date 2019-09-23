function getPath(url){
    var list = url.split("/");
    var aim = list.map((item, index) => {
        var link = list.slice(0, index + 1).join("/") + "/";
        return {
            label: item + "/",
            link: link
        }
    })
    aim.pop();
    return aim;
}

export default {getPath}