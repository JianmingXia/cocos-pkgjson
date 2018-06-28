var pkgJson = require("../lib/pkgJson");
var should = require("should");
var fs = require('fs');

var correct_result = {
    "_inited": true,
    "frames": {
        "0.png": {
            "rect": {
                "x": 1,
                "y": 55,
                "width": 64,
                "height": 49
            },
            "rotated": false,
            "offset": {
                "x": 0,
                "y": 0
            },
            "size": {
                "width": 64,
                "height": 49
            },
            "aliases": []
        },
        "1.png": {
            "rect": {
                "x": 1,
                "y": 1,
                "width": 67,
                "height": 52
            },
            "rotated": false,
            "offset": {
                "x": 0,
                "y": 0
            },
            "size": {
                "width": 67,
                "height": 52
            },
            "aliases": []
        }
    },
    "meta": {
        "image": "radio.png"
    }
};

var animation_result = {
    "animations": {
        "shield": {
            "delay": 0.1,
            "frames": ["shield_1.png", "shield_2.png", "shield_3.png", "shield_4.png", "shield_5.png", "shield_6.png"]
        }
    },
    "properties": {
        "spritesheets": ["shield.plist"],
        "format": 1
    }
};

describe("pkgJson", function () {
    it("parse plist file should equal", function (done) {
        fs.readFile("demo/test.plist", "utf-8", function (err, data) {
            JSON.stringify(pkgJson.parse(data)).should.equal(JSON.stringify(correct_result));

            done();
        });
    });

    it("parse plist file(animation) should notEqual", function (done) {
        fs.readFile("demo/animation.plist", "utf-8", function (err, data) {
            var result = JSON.stringify(pkgJson.parse(data));
            should.notEqual(result, JSON.stringify(animation_result));

            done();
        });
    });

    it("parse plist file(animation) should equal", function (done) {
        fs.readFile("demo/animation.plist", "utf-8", function (err, data) {
            JSON.stringify(pkgJson.parse(data, "other")).should.equal(JSON.stringify(animation_result));

            done();
        });
    });
});