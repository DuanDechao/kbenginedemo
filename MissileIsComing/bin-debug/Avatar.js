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
/**
 *地图自由生成的类
 */
var Avatar = (function (_super) {
    __extends(Avatar, _super);
    function Avatar() {
        var _this = _super.call(this) || this;
        _this.scene = null;
        _this.isDestroyed = false;
        return _this;
    }
    Avatar.prototype.setScene = function (scene) {
        this.scene = scene;
    };
    return Avatar;
}(egret.Sprite));
__reflect(Avatar.prototype, "Avatar");
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        _this.moveState = 0;
        _this.speed = 2;
        _this.lastX = 0;
        _this.isFiring = false;
        _this._direction = 0;
        _this.create();
        return _this;
    }
    Player.prototype.create = function () {
        this.graphics.beginFill(0x0000ff);
        this.graphics.drawRect(0, 0, 20, 20);
        this.graphics.endFill();
        this.anchorOffsetX = 20 / 2;
        this.anchorOffsetY = 20;
    };
    Player.prototype.fire = function () {
        this.setMoveState(0);
        var missile = new Missile(10, 1);
        missile.setOwner(this);
        this.scene.addSprite(missile);
        missile.fire();
        this.scene.setFocusSprite(missile);
        this.isFiring = true;
    };
    Player.prototype.moveStateChange = function (evt) {
        this.moveState = evt._moveState;
        this._direction = evt._direction;
    };
    Player.prototype.setMoveState = function (state) {
        this.moveState = state;
    };
    Player.prototype.onUpdateFrame = function () {
        //
        if (this.moveState == 0 || this.moveState == 2)
            return;
        if (this._direction == 0) {
            this.scene.moveRight(this);
        }
        if (this._direction == 2) {
            this.scene.moveLeft(this);
        }
    };
    return Player;
}(Avatar));
__reflect(Player.prototype, "Player");
var Missile = (function (_super) {
    __extends(Missile, _super);
    function Missile(v0, angle) {
        var _this = _super.call(this) || this;
        _this.v0 = 0;
        _this.angle = 0;
        _this.g = 4;
        _this.time = 0;
        _this.moving = false;
        _this.owner = null;
        _this.bombRadius = 100;
        _this.v0 = v0;
        _this.angle = angle;
        _this.create();
        return _this;
    }
    Missile.prototype.create = function () {
        this.graphics.beginFill(0x0000ff);
        this.graphics.drawRect(0, 0, 10, 10);
        this.graphics.endFill();
        this.anchorOffsetX = 10;
        this.anchorOffsetY = 10;
    };
    Missile.prototype.onUpdateFrame = function () {
        if (!this.moving)
            return;
        var xV = this.v0 * Math.cos(this.angle);
        var yV = -this.v0 * Math.cos(this.angle);
        this.x += xV;
        this.y += yV + this.time * this.g;
        this.time += 0.01;
        if (this.scene.isHitPoint(this.x, this.y)) {
            this.bomb();
        }
    };
    Missile.prototype.fire = function () {
        this.x = this.owner.x;
        this.y = this.owner.y;
        this.time = 0;
        this.moving = true;
    };
    Missile.prototype.bomb = function () {
        this.scene.removeSprite(this);
        //this.scene.setFocusSprite(this.owner);
        this.moving = false;
        this.scene.onMissileBombed(this, this.bombRadius);
    };
    Missile.prototype.setOwner = function (owner) {
        this.owner = owner;
    };
    return Missile;
}(Avatar));
__reflect(Missile.prototype, "Missile");
//# sourceMappingURL=Avatar.js.map