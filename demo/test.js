const fs = require('fs');
const pkgJson = require('../lib/pkgJson');

// let content = fs.readFileSync("demo/test.plist", "utf8");
let content = fs.readFileSync("demo/animation.plist", "utf8");

console.log(JSON.stringify(pkgJson.parse(content, "other")));