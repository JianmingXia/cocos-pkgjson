# cocos-pkgjson
a pkgJson tool, convert plist file to json data. It can be custom pkgLoader used directly

## 中文
这是一个用于生成pkgJson的工具：将.plist文件中的数据提取出来，生成cocos底层SpriteFrame的数据结构，这样在加载.pkgJson之后，使用```cc._pkgJsonLoader```即可直接使用数据。避免了像在加载plist文件后，还需要解析plist数据才能生成底层需要的结构。简单言之：将解析plist的数据提前，减少网络请求，加快数据获取。

### 如何使用
#### Node.js
Install using npm:

```
npm i cocos-pkgjson
```

Then require() the cocos-pkgjson module in your file:
```
const fs = require('fs');
const pkgJson = require('./cocos-pkgjson');

// Here I use fs.readFileSync get content
let content = fs.readFileSync("test.plist", "utf8");

console.log(JSON.stringify(pkgJson.parseFrameConfig(content)));
```

console result:
```
{"_inited":true,"frames":{"0.png":{"rect":{"x":1,"y":55,"width":64,"height":49},"rotated":false,"offset":{"x":0,"y":0},"size":{"width":64,"height":49},"aliases":[]},"1.png":{"rect":{"x":1,"y":1,"width":67,"height":52},"rotated":false,"offset":{"x":0,"y":0},"size":{"width":67,"height":52},"aliases":[]}},"meta":{"image":"radio.png"}}
```

JsonData:

![](./result.png)


### 配套的cc._pkgJsonLoader
```
cc._pkgJsonLoader = {
    load: function (realUrl, url, res, cb) {
        var self = this, locLoader = cc.loader, cache = locLoader.cache;
        locLoader.loadJson(realUrl, function (err, pkg) {
            if (err) return cb(err);
            var dir = cc.path.dirname(url);
            for (var key in pkg) {
                var filePath = cc.path.join(dir, key);
                cache[filePath] = pkg[key];
            }
            cb(null, true);
        });
    }
};

cc.loader.register(["pkgJson"], cc._pkgJsonLoader);
```