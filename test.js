var sqlTooler = require('./src/server/sqlTooler');

var str = `
http://py325bkfy.bkt.clouddn.com/all.jpeg
http://py325bkfy.bkt.clouddn.com/a/pic.jpeg
http://py325bkfy.bkt.clouddn.com/a/a1/timg1.jpeg
http://py325bkfy.bkt.clouddn.com/a/a2/timg2.jpeg
http://py325bkfy.bkt.clouddn.com/a/a3/timg3.jpeg

http://py325bkfy.bkt.clouddn.com/b/a1/timg1.jpeg
http://py325bkfy.bkt.clouddn.com/b/a2/timg2.jpeg
http://py325bkfy.bkt.clouddn.com/b/a3/timg3.jpeg

http://py325bkfy.bkt.clouddn.com/c/a1/timg1.jpeg
http://py325bkfy.bkt.clouddn.com/c/a1/timg2.jpeg
http://py325bkfy.bkt.clouddn.com/c/a1/timg4.jpeg
http://py325bkfy.bkt.clouddn.com/c/a2/timg5.jpeg
`

// var list = str.match(/http.*\S/g);
// list.forEach(item => {
//     console.log(item);
//     sqlTooler.insert(item);
// })
// sqlTooler.selectAll();
sqlTooler.selectPath("http://py325bkfy.bkt.clouddn.com/");