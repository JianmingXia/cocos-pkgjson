const fs = require('fs');
const pkgJson = require('./pkgJson');

let content = fs.readFileSync("test.plist", "utf8");

console.log(JSON.stringify(pkgJson.parseFrameConfig(content)));