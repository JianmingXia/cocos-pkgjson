var plist = require('plist');

var pkgJson = {
    _twoNumReg: /^\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*$/,
    _fourNumReg: /^\s*\{\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*,\s*\{\s*([\-]?\d+[.]?\d*)\s*,\s*([\-]?\d+[.]?\d*)\s*\}\s*\}\s*$/,

    _rect: function (x, y, width, height) {
        return {
            x: x || 0,
            y: y || 0,
            width: width || 0,
            height: height || 0
        }
    },
    _p: function (x, y) {
        return {
            x: x || 0,
            y: y || 0
        }
    },
    _size: function (width, height) {
        return {
            width: width || 0,
            height: height || 0
        }
    },

    _parseFrame: function(dict) {
        // init
        var res_frames = dict["frames"];
        var res_meta = dict["metadata"] || dict["meta"];

        var frames = {};
        var meta = {};
        var format = 0;

        if (res_meta) {
            var tmp_format = res_meta["format"];
            format = (tmp_format.length <= 1) ? parseInt(tmp_format) : tmp_format;
            meta.image = res_meta["textureFileName"] || res_meta["textureFileName"] || res_meta["image"];
        }

        for (var key in res_frames) {
            var res_frame_dict = res_frames[key];
            if (!res_frame_dict) continue;
            var real_frame = {};

            if (format == 0) {
                real_frame.rect = this._rect(res_frame_dict["x"], res_frame_dict["y"], res_frame_dict["width"], res_frame_dict["height"]);
                real_frame.rotated = false;
                real_frame.offset = this._p(res_frame_dict["offsetX"], res_frame_dict["offsetY"]);
                var ow = res_frame_dict["originalWidth"];
                var oh = res_frame_dict["originalHeight"];

                ow = Math.abs(ow);
                oh = Math.abs(oh);
                real_frame.size = this._size(ow, oh);
            } else if (format == 1 || format == 2) {
                real_frame.rect = this._rectFromString(res_frame_dict["frame"]);
                real_frame.rotated = res_frame_dict["rotated"] || false;
                real_frame.offset = this._pointFromString(res_frame_dict["offset"]);
                real_frame.size = this._sizeFromString(res_frame_dict["sourceSize"]);
            } else if (format == 3) {
                // get values
                var sprite_size = this._sizeFromString(res_frame_dict["spriteSize"]);
                var texture_rect = this._rectFromString(res_frame_dict["textureRect"]);
                if (sprite_size) {
                    texture_rect = this._rect(texture_rect.x, texture_rect.y, sprite_size.width, sprite_size.height);
                }
                real_frame.rect = texture_rect;
                real_frame.rotated = res_frame_dict["textureRotated"] || false;
                real_frame.offset = this._pointFromString(res_frame_dict["spriteOffset"]);
                real_frame.size = this._sizeFromString(res_frame_dict["spriteSourceSize"]);
                real_frame.aliases = res_frame_dict["aliases"];
            } else {
                var tmp_frame = res_frame_dict["frame"],
                    tmpSourceSize = res_frame_dict["sourceSize"];
                key = res_frame_dict["filename"] || key;
                real_frame.rect = this._rect(tmp_frame["x"], tmp_frame["y"], tmp_frame["w"], tmp_frame["h"]);
                real_frame.rotated = res_frame_dict["rotated"] || false;
                real_frame.offset = this._p(0, 0);
                real_frame.size = this._size(tmpSourceSize["w"], tmpSourceSize["h"]);
            }
            frames[key] = real_frame;
        }
        return {
            _inited: true,
            frames: frames,
            meta: meta
        };
    },
    /**
     * content: Data to be parse
     * type: type of parse
     *      "frame": parse spriteFrame, default
     */
    parse: function (content, type = "frame") {
        var dict = plist.parse(content);

        switch (type) {
            case "frame":
                return this._parseFrame(dict);
            default:
                return dict;
        }
    },

    parseFrameConfig: function (content) {
        return this.parse(content);
    },

    _rectFromString: function (content) {
        var result = this._fourNumReg.exec(content);
        if (!result) return this._rect(0, 0, 0, 0);
        return this._rect(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]), parseFloat(result[4]));
    },

    _pointFromString: function (content) {
        var result = this._twoNumReg.exec(content);
        if (!result) return this._p(0, 0);
        return this._p(parseFloat(result[1]), parseFloat(result[2]));
    },

    _sizeFromString: function (content) {
        var result = this._twoNumReg.exec(content);
        if (!result) return this._size(0, 0);
        return this._size(parseFloat(result[1]), parseFloat(result[2]));
    },
}

module.exports = pkgJson;
