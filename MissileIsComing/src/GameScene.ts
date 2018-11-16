/** 
 *地图自由生成的类
 */
class BattleScene{
    private groundYs = [];
    private groundPointsNum = 600;
    private xStep = 5;
    private startY = 500;
    private vaildY = 800;
    private endY = 1200;
    private _mainPage = null;
    private focusSprite = null;
    private allSprites = [];
    private player = null;
    private leftBtn = null;
    private rightBtn = null;
    private fireBtn = null;
    private moveFocusXSpeed = 0;
    private moveFocusYSpeed = 0;
    private isMovingFocus = false;
    private groundLine = null;
    private _battleUI = null;
    public constructor(main){
        this._mainPage = main;
        this.createBattleUI();
        this.createGround();
    }

    private createBattleUI(){
        this._battleUI = new BattleUI(this._mainPage);
        this._mainPage.stage.addChild(this._battleUI);
    }

    private createGround(){
        this.randomGroundPoint();
        this.drawGroundLine();
        this.fillBg();

        this._mainPage.addEventListener( egret.Event.ENTER_FRAME, ( evt:egret.Event )=>{
           this.allSprites.forEach(sprite => {
               if(sprite.isDestroyed){
                   return;
               }
               sprite.onUpdateFrame();
               if(sprite == this.focusSprite){
                   this.onSetFocus();
               }

               if(this.isMovingFocus){
                   this.onMoveFocus();
               }
           });
        }, this );
    }

    private randomGroundPoint(){
        this.groundYs = [];
        let idx = 0;
        let pointY = this.startY + Math.random() * (this.vaildY - this.startY);
        let abs = 0;
        for(; idx <= this.groundPointsNum;){
            let lineStep = 20 + Math.round(Math.random() * 4);
            let tan = -3 + Math.random() * 6;
            if(abs != 0){
                tan = Math.abs(tan) * abs;
            }
            while(lineStep--){
                pointY += this.xStep * tan;
                if(pointY >= this.startY + (this.vaildY - this.startY)){
                    pointY = this.startY + (this.vaildY - this.startY);
                    abs = -1;
                }else if(pointY <= this.startY){
                    pointY = this.startY;
                    abs = 1;
                }else{
                    abs = 0;
                }
                this.groundYs.push(pointY);
                idx++;
                if(idx >= this.groundPointsNum){
                    break;
                }
            } 
        }
    }

    private drawGroundLine(){
        if(this.groundLine){
            this._mainPage.removeChild(this.groundLine);
        }

        this.groundLine = new egret.Shape();
        this.groundLine.graphics.lineStyle(2, 0x00ff00);
        this.groundLine.graphics.beginFill( 0x0000aa );
        this.groundLine.graphics.moveTo(0, this.groundYs[0]);
        let idx = 1;
        for(; idx <= this.groundPointsNum; idx++){
            this.groundLine.graphics.lineTo(idx * this.xStep, this.groundYs[idx]);
        }
    
        this.groundLine.graphics.lineTo((idx - 1)* this.xStep, this.endY);
        this.groundLine.graphics.lineTo(0, this.endY);
        this.groundLine.graphics.lineTo(0, this.groundYs[0]);
        this.groundLine.graphics.endFill();
        this._mainPage.addChild(this.groundLine);
    }

    private fillBg(){
        let battleGroundBG = this._mainPage.createBitmapByName("battle_ground_png");
        this._mainPage.addChild(battleGroundBG);
        battleGroundBG.width = this.groundPointsNum * this.xStep;
        battleGroundBG.height = this.vaildY;
        battleGroundBG.y = 170;
        battleGroundBG.mask = this.groundLine;
    }

    public addSprite(sprite){
        this._mainPage.addChild(sprite);
        sprite.setScene(this);
        this.allSprites.push(sprite);
        sprite.isDestroyed = false;
    }

    public removeSprite(sprite){
        sprite.isDestroyed = true;
        this._mainPage.removeChild(sprite);
    }

    public setFocusSprite(sprite){
        this.focusSprite = sprite;
        this.onSetFocus();
    }

    public setPlayer(sprite){
        this.player = sprite;
        this._battleUI.setMoveStickListener(this.player, this.player.moveStateChange);
    }

    public setRandomPos(sprite){
        let idx = 50 + Math.round(Math.random() * (this.groundPointsNum - 150));
        sprite.x = idx * this.xStep;
        sprite.y = this.groundYs[idx];
        sprite.lastX = sprite.x;
    }

    public isHitPoint(x, y){
        let step = Math.floor(x / this.xStep);
        let tan = (this.groundYs[step + 1] - this.groundYs[step])/this.xStep;
        let angle = Math.atan(tan);
        let cos = Math.cos(angle);
        cos = Math.abs(cos);
        let xMove = (x - this.xStep * step) * cos;
        let fixedY = this.groundYs[step] + xMove * tan;
        return fixedY <= y;
    }

    public getPointY(x){
        let step = Math.floor(x / this.xStep);
        let tan = (this.groundYs[step + 1] - this.groundYs[step])/this.xStep;
        let angle = Math.atan(tan);
        let cos = Math.cos(angle);
        cos = Math.abs(cos);
        let xMove = (x - this.xStep * step) * cos;
        return this.groundYs[step] + xMove * tan;
    }

    public moveRight(sprite){
        if(sprite.scene != this)
            return;
        let step = Math.floor(sprite.x / this.xStep);
        let tan = (this.groundYs[step + 1] - this.groundYs[step])/this.xStep;
        let angle = Math.atan(tan);
        let speed = sprite.speed;
        sprite.lastX = sprite.x;
        let cos = Math.cos(angle);
        let xMove = speed * Math.abs(cos);
        if(xMove < 0.25){
            xMove = 0.25;
        }
        if(sprite.x <= (this.groundPointsNum - 2) * this.xStep){
            sprite.x += xMove;
            sprite.y += xMove * tan;
        }
        
        if(sprite.x >= this.xStep * (step + 1)){
            sprite.x = this.xStep * (step + 1);
            sprite.y = this.groundYs[step + 1];
        }
    }

    public moveLeft(sprite){
        if(sprite.scene != this)
            return;
        let step = Math.floor(sprite.x / this.xStep);
        if(sprite.x == step * this.xStep){
            step -= 1;
        }
        let tan = (this.groundYs[step + 1] - this.groundYs[step])/this.xStep;
        let angle = Math.atan(tan);
        let cos = Math.cos(angle);
        let speed = sprite.speed;
        sprite.lastX = sprite.x;
        let xMove = speed * Math.abs(cos);
        if(xMove < 0.25){
            xMove = 0.25;
        }
        
        if(sprite.x >= 2 * this.xStep){
            sprite.x -= xMove;
            sprite.y -= xMove * tan;
        }

        if(sprite.x <= this.xStep * step){
            sprite.x = this.xStep * step;
            sprite.y = this.groundYs[step];
        }
    }

    public onMissileBombed(bomb, radius){
        let minStep = Math.round((bomb.x - radius) / this.xStep);
        let maxStep = Math.floor((bomb.x + radius) / this.xStep);
        for(let idx = minStep - 5; idx <= maxStep + 5; idx++){
            let xOffset = Math.abs(bomb.x - idx * this.xStep);
            xOffset = Math.min(xOffset, radius);
            let offsetY = Math.sqrt(radius * radius - xOffset * xOffset);
            if(bomb.y + offsetY > this.groundYs[idx] && (idx >= minStep && idx <= maxStep)){
                this.groundYs[idx] = bomb.y + offsetY;
            }

            if((this.groundYs[idx] - this.groundYs[idx-1]) / this.xStep > 3){
                    this.groundYs[idx]  = this.groundYs[idx-1] +  this.xStep * 3;
            }
            if((this.groundYs[idx] - this.groundYs[idx-1]) / this.xStep < -3){
                this.groundYs[idx]  = this.groundYs[idx-1] -  this.xStep * 3;
            }
        }

        this.drawGroundLine();
    }

    private onSetFocus(){
        if(this.focusSprite.x >= 400 && this.focusSprite.x <= 2050){
            this._mainPage.x = -this.focusSprite.x + 400;
        }
        if(this.focusSprite.y <= 900){
            this._mainPage.y = -this.focusSprite.y + 550;
        }
    }

    private onMoveFocus(){
    }

    private fireBtnOnTouch(){
        if(this.player.isFiring)
            return;
        this.player.fire();
    }
    
}

