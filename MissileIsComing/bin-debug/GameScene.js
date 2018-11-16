var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 *地图自由生成的类
 */
var BattleScene = (function () {
    function BattleScene(main) {
        this.groundYs = [];
        this.groundPointsNum = 600;
        this.xStep = 5;
        this.startY = 500;
        this.vaildY = 800;
        this.endY = 1200;
        this._mainPage = null;
        this.focusSprite = null;
        this.allSprites = [];
        this.player = null;
        this.leftBtn = null;
        this.rightBtn = null;
        this.fireBtn = null;
        this.moveFocusXSpeed = 0;
        this.moveFocusYSpeed = 0;
        this.isMovingFocus = false;
        this.groundLine = null;
        this._battleUI = null;
        this._mainPage = main;
        this.createBattleUI();
        this.createGround();
    }
    BattleScene.prototype.createBattleUI = function () {
        this._battleUI = new BattleUI(this._mainPage);
        this._mainPage.stage.addChild(this._battleUI);
    };
    BattleScene.prototype.createGround = function () {
        var _this = this;
        this.randomGroundPoint();
        this.drawGroundLine();
        this.fillBg();
        this._mainPage.addEventListener(egret.Event.ENTER_FRAME, function (evt) {
            _this.allSprites.forEach(function (sprite) {
                if (sprite.isDestroyed) {
                    return;
                }
                sprite.onUpdateFrame();
                if (sprite == _this.focusSprite) {
                    _this.onSetFocus();
                }
                if (_this.isMovingFocus) {
                    _this.onMoveFocus();
                }
            });
        }, this);
    };
    BattleScene.prototype.randomGroundPoint = function () {
        this.groundYs = [];
        var idx = 0;
        var pointY = this.startY + Math.random() * (this.vaildY - this.startY);
        var abs = 0;
        for (; idx <= this.groundPointsNum;) {
            var lineStep = 20 + Math.round(Math.random() * 4);
            var tan = -3 + Math.random() * 6;
            if (abs != 0) {
                tan = Math.abs(tan) * abs;
            }
            while (lineStep--) {
                pointY += this.xStep * tan;
                if (pointY >= this.startY + (this.vaildY - this.startY)) {
                    pointY = this.startY + (this.vaildY - this.startY);
                    abs = -1;
                }
                else if (pointY <= this.startY) {
                    pointY = this.startY;
                    abs = 1;
                }
                else {
                    abs = 0;
                }
                this.groundYs.push(pointY);
                idx++;
                if (idx >= this.groundPointsNum) {
                    break;
                }
            }
        }
    };
    BattleScene.prototype.drawGroundLine = function () {
        if (this.groundLine) {
            this._mainPage.removeChild(this.groundLine);
        }
        this.groundLine = new egret.Shape();
        this.groundLine.graphics.lineStyle(2, 0x00ff00);
        this.groundLine.graphics.beginFill(0x0000aa);
        this.groundLine.graphics.moveTo(0, this.groundYs[0]);
        var idx = 1;
        for (; idx <= this.groundPointsNum; idx++) {
            this.groundLine.graphics.lineTo(idx * this.xStep, this.groundYs[idx]);
        }
        this.groundLine.graphics.lineTo((idx - 1) * this.xStep, this.endY);
        this.groundLine.graphics.lineTo(0, this.endY);
        this.groundLine.graphics.lineTo(0, this.groundYs[0]);
        this.groundLine.graphics.endFill();
        this._mainPage.addChild(this.groundLine);
    };
    BattleScene.prototype.fillBg = function () {
        var battleGroundBG = this._mainPage.createBitmapByName("battle_ground_png");
        this._mainPage.addChild(battleGroundBG);
        battleGroundBG.width = this.groundPointsNum * this.xStep;
        battleGroundBG.height = this.vaildY;
        battleGroundBG.y = 170;
        battleGroundBG.mask = this.groundLine;
    };
    BattleScene.prototype.addSprite = function (sprite) {
        this._mainPage.addChild(sprite);
        sprite.setScene(this);
        this.allSprites.push(sprite);
        sprite.isDestroyed = false;
    };
    BattleScene.prototype.removeSprite = function (sprite) {
        sprite.isDestroyed = true;
        this._mainPage.removeChild(sprite);
    };
    BattleScene.prototype.setFocusSprite = function (sprite) {
        this.focusSprite = sprite;
        this.onSetFocus();
    };
    BattleScene.prototype.setPlayer = function (sprite) {
        this.player = sprite;
        this._battleUI.setMoveStickListener(this.player, this.player.moveStateChange);
    };
    BattleScene.prototype.setRandomPos = function (sprite) {
        var idx = 50 + Math.round(Math.random() * (this.groundPointsNum - 150));
        sprite.x = idx * this.xStep;
        sprite.y = this.groundYs[idx];
        sprite.lastX = sprite.x;
    };
    BattleScene.prototype.isHitPoint = function (x, y) {
        var step = Math.floor(x / this.xStep);
        var tan = (this.groundYs[step + 1] - this.groundYs[step]) / this.xStep;
        var angle = Math.atan(tan);
        var cos = Math.cos(angle);
        cos = Math.abs(cos);
        var xMove = (x - this.xStep * step) * cos;
        var fixedY = this.groundYs[step] + xMove * tan;
        return fixedY <= y;
    };
    BattleScene.prototype.getPointY = function (x) {
        var step = Math.floor(x / this.xStep);
        var tan = (this.groundYs[step + 1] - this.groundYs[step]) / this.xStep;
        var angle = Math.atan(tan);
        var cos = Math.cos(angle);
        cos = Math.abs(cos);
        var xMove = (x - this.xStep * step) * cos;
        return this.groundYs[step] + xMove * tan;
    };
    BattleScene.prototype.moveRight = function (sprite) {
        if (sprite.scene != this)
            return;
        var step = Math.floor(sprite.x / this.xStep);
        var tan = (this.groundYs[step + 1] - this.groundYs[step]) / this.xStep;
        var angle = Math.atan(tan);
        var speed = sprite.speed;
        sprite.lastX = sprite.x;
        var cos = Math.cos(angle);
        var xMove = speed * Math.abs(cos);
        if (xMove < 0.25) {
            xMove = 0.25;
        }
        if (sprite.x <= (this.groundPointsNum - 2) * this.xStep) {
            sprite.x += xMove;
            sprite.y += xMove * tan;
        }
        if (sprite.x >= this.xStep * (step + 1)) {
            sprite.x = this.xStep * (step + 1);
            sprite.y = this.groundYs[step + 1];
        }
    };
    BattleScene.prototype.moveLeft = function (sprite) {
        if (sprite.scene != this)
            return;
        var step = Math.floor(sprite.x / this.xStep);
        if (sprite.x == step * this.xStep) {
            step -= 1;
        }
        var tan = (this.groundYs[step + 1] - this.groundYs[step]) / this.xStep;
        var angle = Math.atan(tan);
        var cos = Math.cos(angle);
        var speed = sprite.speed;
        sprite.lastX = sprite.x;
        var xMove = speed * Math.abs(cos);
        if (xMove < 0.25) {
            xMove = 0.25;
        }
        if (sprite.x >= 2 * this.xStep) {
            sprite.x -= xMove;
            sprite.y -= xMove * tan;
        }
        if (sprite.x <= this.xStep * step) {
            sprite.x = this.xStep * step;
            sprite.y = this.groundYs[step];
        }
    };
    BattleScene.prototype.onMissileBombed = function (bomb, radius) {
        var minStep = Math.round((bomb.x - radius) / this.xStep);
        var maxStep = Math.floor((bomb.x + radius) / this.xStep);
        for (var idx = minStep - 5; idx <= maxStep + 5; idx++) {
            var xOffset = Math.abs(bomb.x - idx * this.xStep);
            xOffset = Math.min(xOffset, radius);
            var offsetY = Math.sqrt(radius * radius - xOffset * xOffset);
            if (bomb.y + offsetY > this.groundYs[idx] && (idx >= minStep && idx <= maxStep)) {
                this.groundYs[idx] = bomb.y + offsetY;
            }
            if ((this.groundYs[idx] - this.groundYs[idx - 1]) / this.xStep > 3) {
                this.groundYs[idx] = this.groundYs[idx - 1] + this.xStep * 3;
            }
            if ((this.groundYs[idx] - this.groundYs[idx - 1]) / this.xStep < -3) {
                this.groundYs[idx] = this.groundYs[idx - 1] - this.xStep * 3;
            }
        }
        this.drawGroundLine();
    };
    BattleScene.prototype.onSetFocus = function () {
        if (this.focusSprite.x >= 400 && this.focusSprite.x <= 2050) {
            this._mainPage.x = -this.focusSprite.x + 400;
        }
        if (this.focusSprite.y <= 900) {
            this._mainPage.y = -this.focusSprite.y + 550;
        }
    };
    BattleScene.prototype.onMoveFocus = function () {
    };
    BattleScene.prototype.fireBtnOnTouch = function () {
        if (this.player.isFiring)
            return;
        this.player.fire();
    };
    return BattleScene;
}());
__reflect(BattleScene.prototype, "BattleScene");
//# sourceMappingURL=GameScene.js.map