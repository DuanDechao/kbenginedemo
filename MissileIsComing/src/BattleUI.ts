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
class MoveStickEvent extends egret.Event{
    public static MOVESTICK:string = "MOVESTICK";
    public _lastDirection = 0;
    public _direction = 0;
    public _moveState = 0; //0：开始 1：进行 2:结束
    public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
        super(type,bubbles, cancelable);
    }
}

class BattleUI extends eui.UILayer {
    public constructor(mainPage, moveStickListener = null, moveStickCallback = null){
        super();
        this._mainPage = mainPage;
        this._moveStickListener = moveStickListener;
        this._moveStickCallback = moveStickCallback;
    }

    private _mainPage = null;
    private _moveStickListener = null;
    private _moveStickCallback = null;
    private _moveStick = null;
    protected createChildren(): void {
        super.createChildren();

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame().catch(e => {
            console.log(e);
        })
    }

    public setMoveStickListener(listener, callback){
        this._moveStickListener = listener;
        this._moveStickCallback = callback;
    }


    private async runGame() {
        //await this.loadResource()
        this.createMoveStick();
    }


     private async loadResource() {
        try {
            await this.loadTheme();
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    protected createMoveStick(): void {
        this._moveStick = new Joystick(80, this, this.moveStickEvent);
        this._moveStick.x = 50;
        this._moveStick.y = this.stage.stageHeight - 200;
        this._moveStick.setOpacity(0.1);
        this._moveStick.setBGOpacity(0.1);
        this._moveStick.setLockY(true); 
        this.addChild(this._moveStick);
    }

    private moveStickEvent(evt:StickEvent):void{
        if(evt._eventType == 0){
            this._moveStick.setOpacity(0.5);
            this._moveStick.setBGOpacity(0.5);
            if(this._moveStickListener && this._moveStickCallback)
                this.addEventListener(MoveStickEvent.MOVESTICK, this._moveStickCallback, this._moveStickListener);
        }

        if(this._moveStickListener && this._moveStickCallback){
            var moveEvent:MoveStickEvent = new MoveStickEvent(MoveStickEvent.MOVESTICK);
            moveEvent._moveState = evt._eventType;
            moveEvent._lastDirection = evt._lastDirection;
            moveEvent._direction = evt._direction;
            this.dispatchEvent(moveEvent);
        }

        if(evt._eventType == 2){
            this._moveStick.setOpacity(0.1);
            this._moveStick.setBGOpacity(0.1);
            if(this._moveStickListener && this._moveStickCallback){
                this.removeEventListener(MoveStickEvent.MOVESTICK, this._moveStickCallback, this._moveStickListener);
            }
        }
    }
}
