var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var MoveStickEvent = (function (_super) {
    __extends(MoveStickEvent, _super);
    function MoveStickEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        var _this = _super.call(this, type, bubbles, cancelable) || this;
        _this._lastDirection = 0;
        _this._direction = 0;
        _this._moveState = 0; //0：开始 1：进行 2:结束
        return _this;
    }
    MoveStickEvent.MOVESTICK = "MOVESTICK";
    return MoveStickEvent;
}(egret.Event));
__reflect(MoveStickEvent.prototype, "MoveStickEvent");
var BattleUI = (function (_super) {
    __extends(BattleUI, _super);
    function BattleUI(mainPage, moveStickListener, moveStickCallback) {
        if (moveStickListener === void 0) { moveStickListener = null; }
        if (moveStickCallback === void 0) { moveStickCallback = null; }
        var _this = _super.call(this) || this;
        _this._mainPage = null;
        _this._moveStickListener = null;
        _this._moveStickCallback = null;
        _this._moveStick = null;
        _this._mainPage = mainPage;
        _this._moveStickListener = moveStickListener;
        _this._moveStickCallback = moveStickCallback;
        return _this;
    }
    BattleUI.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    BattleUI.prototype.setMoveStickListener = function (listener, callback) {
        this._moveStickListener = listener;
        this._moveStickCallback = callback;
    };
    BattleUI.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //await this.loadResource()
                this.createMoveStick();
                return [2 /*return*/];
            });
        });
    };
    BattleUI.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loadTheme()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BattleUI.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    BattleUI.prototype.createMoveStick = function () {
        this._moveStick = new Joystick(80, this, this.moveStickEvent);
        this._moveStick.x = 50;
        this._moveStick.y = this.stage.stageHeight - 200;
        this._moveStick.setOpacity(0.1);
        this._moveStick.setBGOpacity(0.1);
        this._moveStick.setLockY(true);
        this.addChild(this._moveStick);
    };
    BattleUI.prototype.moveStickEvent = function (evt) {
        if (evt._eventType == 0) {
            this._moveStick.setOpacity(0.5);
            this._moveStick.setBGOpacity(0.5);
            if (this._moveStickListener && this._moveStickCallback)
                this.addEventListener(MoveStickEvent.MOVESTICK, this._moveStickCallback, this._moveStickListener);
        }
        if (this._moveStickListener && this._moveStickCallback) {
            var moveEvent = new MoveStickEvent(MoveStickEvent.MOVESTICK);
            moveEvent._moveState = evt._eventType;
            moveEvent._lastDirection = evt._lastDirection;
            moveEvent._direction = evt._direction;
            this.dispatchEvent(moveEvent);
        }
        if (evt._eventType == 2) {
            this._moveStick.setOpacity(0.1);
            this._moveStick.setBGOpacity(0.1);
            if (this._moveStickListener && this._moveStickCallback) {
                this.removeEventListener(MoveStickEvent.MOVESTICK, this._moveStickCallback, this._moveStickListener);
            }
        }
    };
    return BattleUI;
}(eui.UILayer));
__reflect(BattleUI.prototype, "BattleUI");
//# sourceMappingURL=BattleUI.js.map