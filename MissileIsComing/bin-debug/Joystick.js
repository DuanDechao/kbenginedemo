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
var StickEvent = (function (_super) {
    __extends(StickEvent, _super);
    function StickEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        var _this = _super.call(this, type, bubbles, cancelable) || this;
        _this._eventType = 0; // 0:touchBegan 1:touchMove 2:touchEnd
        _this._lastRadian = 0;
        _this._radian = 0;
        _this._direction = 0;
        _this._lastDirection = 0;
        return _this;
    }
    StickEvent.STICK = "STICKEVENT";
    return StickEvent;
}(egret.Event));
__reflect(StickEvent.prototype, "StickEvent");
var Joystick = (function (_super) {
    __extends(Joystick, _super);
    function Joystick(radius, listener, listenerCallback, stick, stickBG) {
        if (stick === void 0) { stick = null; }
        if (stickBG === void 0) { stickBG = null; }
        var _this = _super.call(this) || this;
        _this._stick = null; //控杆
        _this._stickBG = null; //控杆背景
        _this._radius = 0; //半径
        _this._angle = null; //角度
        _this._radian = null; //弧度
        _this._lastRadian = null; //上次弧度
        _this._lastDirection = null; //上次更新的方向
        _this._lockX = false; //限制水平移动
        _this._lockY = false; //限制垂直移动
        //创建摇杆精灵
        _this._stick = stick;
        _this._stickBG = stickBG;
        _this._createStickSprite(radius);
        //初始化触摸事件
        _this._stickBG.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouchBegan, _this);
        _this.addEventListener(StickEvent.STICK, listenerCallback, listener);
        return _this;
    }
    Joystick.prototype._createStickSprite = function (radius) {
        this._radius = radius;
        //摇杆背景精灵
        if (this._stickBG == null) {
            this._stickBG = new egret.Shape();
            this._stickBG.graphics.beginFill(0x75736d);
            this._stickBG.graphics.drawCircle(0, 0, 150);
            this._stickBG.graphics.endFill();
            this._stickBG.x = radius;
            this._stickBG.y = radius;
            this._stickBG.alpha = 0.5;
        }
        //摇杆精灵
        if (this._stick == null) {
            this._stick = new egret.Shape();
            this._stick.graphics.beginFill(0xe5e4de);
            this._stick.graphics.drawCircle(0, 0, 80);
            this._stick.graphics.endFill();
            this._stick.x = radius;
            this._stick.y = radius;
            this._stick.alpha = 0.5;
        }
        this.addChild(this._stickBG);
        this._stickBG.touchEnabled = true;
        this.addChild(this._stick);
        //根据半径设置缩放比例
        var scale = radius / (this._stickBG.width / 2);
        this._stickBG.scaleX = scale;
        this._stickBG.scaleY = scale;
        this._stick.scaleX = scale;
        this._stick.scaleY = scale;
        //设置大小
        this.width = this._stickBG.getBounds().width;
        this.height = this._stickBG.getBounds().height;
    };
    //计算角度并返回
    Joystick.prototype._getAngle = function (point) {
        var x = this._stickBG.x;
        var y = this._stickBG.y;
        this._angle = Math.atan2(point.y - y, point.x - x) * (180 / Math.PI);
        return this._angle;
    };
    //计算弧度并返回
    Joystick.prototype._getRadian = function (point) {
        this._lastRadian = this._radian;
        this._radian = Math.PI / 180 * this._getAngle(point);
        return this._radian;
    };
    //计算两点间的距离并返回
    Joystick.prototype._getDistance = function (pos1, pos2) {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) +
            Math.pow(pos1.y - pos2.y, 2));
    };
    Joystick.prototype.onTouchBegan = function (evt) {
        //触摸监听目标
        //var target = evt.target;
        //把触摸点坐标转换为相对与目标的模型坐标
        var _movePoint = this.globalToLocal(evt.stageX, evt.stageY);
        //点与圆心的距离
        var distance = this._getDistance(_movePoint, this._stickBG);
        //圆的半径
        var radius = this._stickBG.getBounds().width / 2;
        this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
        this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnded, this);
        this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnded, this);
        //如果点与圆心距离小于圆的半径,返回true
        if (radius > distance) {
            if (!this._lockX)
                this._stick.x = _movePoint.x;
            if (!this._lockY)
                this._stick.y = _movePoint.y;
        }
        var event = new StickEvent(StickEvent.STICK);
        event._eventType = 0;
        this.dispatchEvent(event);
    };
    Joystick.prototype.onTouchMoved = function (evt) {
        // //触摸监听目标
        //var target = evt.target;
        // //把触摸点坐标转换为相对与目标的模型坐标
        var _movePoint = this.globalToLocal(evt.stageX, evt.stageY);
        // //点与圆心的距离
        var distance = this._getDistance(_movePoint, this._stickBG);
        // //圆的半径
        var radius = this._radius;
        // //如果点与圆心距离小于圆的半径,控杆跟随触摸点
        var radian = this._getRadian(_movePoint);
        if (radius > distance) {
            if (!this._lockX)
                this._stick.x = _movePoint.x;
            if (!this._lockY)
                this._stick.y = _movePoint.y;
        }
        else {
            if (!this._lockX) {
                var x = this._stickBG.x + Math.cos(radian) * this._radius;
                this._stick.x = x;
            }
            if (!this._lockY) {
                var y = this._stickBG.y + Math.sin(radian) * this._radius;
                this._stick.y = y;
            }
        }
        if (this._lastRadian != this._radian) {
            var event = new StickEvent(StickEvent.STICK);
            event._eventType = 1;
            event._lastRadian = this._lastRadian;
            event._radian = this._radian;
            event._lastDirection = this._lastDirection;
            event._direction = this.computeDirection();
            this.dispatchEvent(event);
            this._lastDirection = event._direction;
        }
    };
    Joystick.prototype.onTouchEnded = function (evt) {
        // //触摸监听目标
        //var target = evt.target;
        // //摇杆恢复位置
        this._stick.x = this._stickBG.x;
        this._stick.y = this._stickBG.y;
        this.parent.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
        this.parent.stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnded, this);
        this.parent.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnded, this);
        var event = new StickEvent(StickEvent.STICK);
        event._eventType = 2;
        event._lastDirection = this._lastDirection;
        event._direction = 0;
        this.dispatchEvent(event);
    };
    //设置透明度
    Joystick.prototype.setOpacity = function (opacity) {
        this._stick.alpha = opacity;
    };
    Joystick.prototype.setBGOpacity = function (opacity) {
        this._stickBG.alpha = opacity;
    };
    Joystick.prototype.setLockX = function (b) {
        this._lockX = b;
    };
    Joystick.prototype.setLockY = function (b) {
        this._lockY = b;
    };
    //获取角度
    Joystick.prototype.getAngle = function () {
        return this._angle;
    };
    Joystick.prototype.computeDirection = function () {
        if (this._lastRadian == this._radian)
            return;
        var angle45 = Math.PI / 4;
        var angle90 = Math.PI / 2;
        var direction;
        // Angular direction
        //     \  UP /
        //      \   /
        // LEFT       RIGHT
        //      /   \
        //     /DOWN \
        //
        if (this._radian > angle45 && this._radian < (angle45 * 3) && !this._lockX) {
            direction = 1;
        }
        else if (this._radian > -angle45 && this._radian <= angle45 && !this._lockY) {
            direction = 0;
        }
        else if (this._radian > (-angle45 * 3) && this._radian <= -angle45 && !this._lockX) {
            direction = 3;
        }
        else if (!this._lockY) {
            direction = 2;
        }
        // Plain direction
        //    UP                 |
        // _______               | RIGHT
        //                  LEFT |
        //   DOWN                |
        if (this._lockY) {
            if (this._radian > -angle90 && this._radian < angle90) {
                direction = 0;
            }
            else {
                direction = 2;
            }
        }
        if (this._lockX) {
            if (this._radian > 0) {
                direction = 1;
            }
            else {
                direction = 3;
            }
        }
        return direction;
    };
    return Joystick;
}(egret.Sprite));
__reflect(Joystick.prototype, "Joystick");
//# sourceMappingURL=Joystick.js.map