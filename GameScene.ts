/** 
 *地图自由生成的类
 */
class BattleScene{
    private groundYs = [];
    private groundPointsNum = 1024;
    private xStep = 5;
    private startY = 600;
    private endY = 1200;
    private mainPage = null;
    private focusSprite = null;
    private allSprites = [];
    private player = null;
    private leftBtn = null;
    private rightBtn = null;
    public constructor(main){
        this.mainPage = main;
        this.createScene(main);
    }

    private createScene(main) {
        //this.mainPage = main;
        this.createGround(main);
        this.createButton(main);
    }

   
    public addSprite(sprite){
        this.mainPage.addChild(sprite);
        sprite.setScene(this);
        this.allSprites.push(sprite);
        console.log("fffffff", sprite);
    }

    public removeSprite(sprite){
        sprite.isDestroyed = false;
        this.mainPage.removeChild(sprite);
    }

    public getGroundYs(){
        return this.groundYs;
    }

    public getXStep(){
        return this.xStep;
    }

    public setFocusSprite(sprite){
        this.focusSprite = sprite;
        this.onSetFocus();
        console.log("mainPage", this.mainPage.x);
        console.log("sprite", this.focusSprite.x, this.focusSprite.y);
    }

    public setPlayer(sprite){
        this.player = sprite;
    }

    public setRandomPos(sprite){
        let idx = Math.round(Math.random() * this.groundPointsNum);
        sprite.x = idx * this.xStep;
        sprite.y = this.groundYs[idx];
        sprite.lastX = sprite.x;
    }

    private onSetFocus(){
        this.mainPage.x = -this.focusSprite.x + 200;
        this.leftBtn.x = this.focusSprite.x;
        this.rightBtn.x = this.focusSprite.x + 100;
    }

    private createButton(main){
        this.leftBtn = new egret.Sprite();
        this.leftBtn.graphics.beginFill( 0x0000ff );
        this.leftBtn.graphics.drawRect( 0, 0, 80, 80);
        this.leftBtn.graphics.endFill();
        main.addChild(this.leftBtn);
        this.leftBtn.x = 0;
        this.leftBtn.y = 0;

        this.rightBtn = new egret.Sprite();
        this.rightBtn.graphics.beginFill( 0x0000aa );
        this.rightBtn.graphics.drawRect( 0, 0, 80, 80);
        this.rightBtn.graphics.endFill();
        main.addChild(this.rightBtn);
        this.rightBtn.x = 100;
        this.rightBtn.y = 0;

        this.leftBtn.touchEnabled = true;
        this.rightBtn.touchEnabled = true;
        this.leftBtn.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.leftBtnOnTouchBegin, this );
        this.leftBtn.addEventListener( egret.TouchEvent.TOUCH_END, this.leftBtnOnTouchEnd, this );
        this.rightBtn.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.rightBtnOnTouchBegin, this );
        this.rightBtn.addEventListener( egret.TouchEvent.TOUCH_END, this.rightBtnOnTouchEnd, this );
        console.log("kkkkkkk");
    }

    private leftBtnOnTouchBegin(evt:egret.TouchEvent){
        if(this.player == null)
            return;
        this.player.moveState = 2;
        console.log("left button is touch begin");
    }

    private leftBtnOnTouchEnd(){
        if(this.player == null)
            return;
        this.player.moveState = 0;
        console.log("left button is touch end");
    }

    private rightBtnOnTouchBegin(){
        if(this.player == null)
            return;
        this.player.moveState = 1;
        console.log("right button is touch begin");

    }

    private rightBtnOnTouchEnd(){
        if(this.player == null)
            return;
        this.player.moveState = 0;
        console.log("right button is touch end");
    }



    private createGround(main){
        this.groundYs = [];

        let idx = 0;
        let pointY = this.startY + Math.random() * 400;
        let abs = 0;
        for(; idx < this.groundPointsNum;){
            let lineStep = 20 + Math.round(Math.random() * 4);
            let tan = -3 + Math.random() * 6;
            if(abs != 0){
                tan = Math.abs(tan) * abs;
            }
            while(lineStep--){
                pointY += this.xStep * tan;
                if(pointY >= this.startY + 400){
                    pointY = this.startY + 400;
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

        var groundline:egret.Shape = new egret.Shape();
        groundline.graphics.lineStyle(2, 0x00ff00);
        groundline.graphics.beginFill( 0x0000aa );
        groundline.graphics.moveTo(0, this.groundYs[0]);
        for(idx = 1; idx <= this.groundPointsNum; idx++){
            groundline.graphics.lineTo(idx * this.xStep, this.groundYs[idx]);
        }
    
        groundline.graphics.lineTo( (idx - 1)* this.xStep, this.endY);
        groundline.graphics.lineTo(0, this.endY);
        groundline.graphics.lineTo(0, this.groundYs[0]);
        groundline.graphics.endFill();
        main.addChild(groundline);

        this.mainPage.addEventListener( egret.Event.ENTER_FRAME, ( evt:egret.Event )=>{
           this.allSprites.forEach(sprite => {
               if(!sprite.isDestroyed){
                   return;
               }
               sprite.onUpdateFrame();
               if(sprite == this.focusSprite){
                   this.onSetFocus();
               }
           });
        }, this );
    }

    

    private testBodyMove(main){
        var spr:egret.Sprite = new egret.Sprite();
        spr.graphics.beginFill( 0x0000ff );
        spr.graphics.drawRect( 0, 0, 20, 20);
        spr.graphics.endFill();
        main.addChild(spr);
        
    }
}

