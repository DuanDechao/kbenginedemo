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

class Main extends egret.DisplayObjectContainer {



    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //var _myGraphicsTest:GraphicsTest = new GraphicsTest();
        //this.addChild(_myGraphicsTest);

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        let groundPointX = [68,167,221, 290, 297,412, 600]
        let groundPointY = [84,76,118, 162, 228,250, 174]
        var shp:egret.Shape = new egret.Shape();
        shp.graphics.lineStyle(2, 0x00ff00);
        shp.graphics.beginFill( 0x0000aa );
        shp.graphics.moveTo( groundPointX[0], groundPointY[0]);
        let idx = 1;
        for(; idx <= 6; idx++){
            shp.graphics.lineTo(groundPointX[idx], groundPointY[idx]);
        }
        
        
        shp.graphics.lineTo( groundPointX[idx-1], 700 );
        shp.graphics.lineTo( groundPointX[0], 700 );
        shp.graphics.lineTo( groundPointX[0], groundPointY[0] );
        shp.graphics.endFill();
        this.addChild(shp);

        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        sky.mask = shp

        var spr:egret.Sprite = new egret.Sprite();
        spr.graphics.beginFill( 0x0000ff );
        spr.graphics.drawRect( 0, 0, 20, 20);
        spr.graphics.endFill();
        this.addChild(spr);
        let step = 0;
        spr.x = groundPointX[step];
        spr.y = groundPointY[step];
        let tan = ((groundPointY[step + 1] - groundPointY[step]) / (groundPointX[step + 1] - groundPointX[step]));
        let cos = Math.cos(tan);
        let speed = 2;
        this.addEventListener( egret.Event.ENTER_FRAME, ( evt:egret.Event )=>{
           if(cos < 0){
               cos = 1 + cos;
           }
           let xMove = speed * cos;
           if(xMove <= 1){
               xMove = 1;
           }
           spr.x += xMove;
           spr.y += xMove * tan;
           if(spr.x >= groundPointX[step + 1]){
               spr.x = groundPointX[step + 1];
               spr.y = groundPointY[step + 1];
               step++;
               tan = ((groundPointY[step + 1] - groundPointY[step]) / (groundPointX[step + 1] - groundPointX[step]));
               cos = Math.cos(tan);
           }
        }, this );
        
        this.drawText();
        var bullt:egret.Shape = new egret.Shape();
        bullt.x = 100;
        bullt.y = 100;
        bullt.graphics.lineStyle(10, 0x00ff00);
        bullt.graphics.beginFill(0xff0000, 1);
        bullt.graphics.drawCircle(0, 0, 100);
        bullt.graphics.endFill();
       // this.addChild(bullt);

        var isHit:boolean = bullt.hitTestPoint(68, 84);
        this.infoText.text = "isHit:" + isHit;
    }
    private infoText:egret.TextField;
    private drawText(){
        this.infoText = new egret.TextField();
        this.infoText.x = 700;
        this.infoText.y = 400;
        this.infoText.text = "isHit";
        this.addChild(this.infoText);
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: string[]) {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }
}

class GraphicsTest extends egret.DisplayObjectContainer{
    public constructor(){
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event){
        var shp:egret.Shape = new egret.Shape();
        shp.graphics.lineStyle(2, 0x00ff00);
        shp.graphics.beginFill( 0x0000aa );
        shp.graphics.moveTo( 68, 84 );
        shp.graphics.lineTo( 167, 76 );
        shp.graphics.lineTo( 221, 118 );
        shp.graphics.lineTo( 290, 162 );
        shp.graphics.lineTo( 297, 228 );
        shp.graphics.lineTo( 412, 250 );
        shp.graphics.lineTo( 443, 174 );
        shp.graphics.lineTo( 443, 500 );
        shp.graphics.lineTo( 68, 500 );
        shp.graphics.lineTo( 68, 84 );
        shp.graphics.endFill();
        //this.addChild(shp);

        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);

        var spr:egret.Sprite = new egret.Sprite();
        spr.graphics.beginFill( 0x0000ff );
        spr.graphics.drawRect( 0, 0, 200, 200 );
        spr.graphics.endFill();
        spr.x = 10;
        spr.y = 10;
        this.addChild(spr);
        spr.addChild(shp);
        spr.mask = shp;
    }

    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}