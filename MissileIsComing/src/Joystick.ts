class StickEvent extends egret.Event{
    public static STICK = "STICKEVENT";
    public _eventType = 0; // 0:touchBegan 1:touchMove 2:touchEnd
    public _lastRadian = 0;
    public _radian = 0;
    public _direction = 0;
    public _lastDirection = 0;
    public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
        super(type, bubbles, cancelable);
    }
}

class Joystick extends egret.Sprite{
    private _stick = null;       //控杆
    private _stickBG = null;     //控杆背景
    private _radius= 0;         //半径
    private _angle = null;       //角度
    private _radian = null;      //弧度
    private _lastRadian = null;  //上次弧度
    private _lastDirection = null; //上次更新的方向
    private _lockX = false;      //限制水平移动
    private _lockY = false;      //限制垂直移动

    public constructor(radius, listener, listenerCallback, stick = null, stickBG = null){
        super();
        //创建摇杆精灵
        this._stick = stick;
        this._stickBG = stickBG;
        this._createStickSprite(radius);
        //初始化触摸事件
        this._stickBG.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegan, this);
        this.addEventListener(StickEvent.STICK, listenerCallback, listener);
    }

    private _createStickSprite(radius){
        this._radius = radius;
        //摇杆背景精灵
        if(this._stickBG == null){
            this._stickBG = new egret.Shape(); 
            this._stickBG.graphics.beginFill(0x75736d);
            this._stickBG.graphics.drawCircle(0, 0, 150);
            this._stickBG.graphics.endFill();
            this._stickBG.x = radius;
            this._stickBG.y = radius;
            this._stickBG.alpha = 0.5;
        }

        //摇杆精灵
        if(this._stick == null){
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
    }

    //计算角度并返回
    private _getAngle(point){
        let x = this._stickBG.x;
        let y = this._stickBG.y;
        this._angle = Math.atan2(point.y-y, point.x-x) * (180/Math.PI);
        return this._angle;
    }

    //计算弧度并返回
    private _getRadian(point) {
        this._lastRadian = this._radian;
        this._radian = Math.PI / 180 * this._getAngle(point);
        return this._radian;
    }

    //计算两点间的距离并返回
    private _getDistance(pos1, pos2){
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) +
        Math.pow(pos1.y - pos2.y, 2));
    }

    private onTouchBegan(evt: egret.TouchEvent): void{
        //触摸监听目标
        //var target = evt.target;
        //把触摸点坐标转换为相对与目标的模型坐标
        let _movePoint = this.globalToLocal(evt.stageX, evt.stageY);

        //点与圆心的距离
        var distance = this._getDistance(_movePoint, this._stickBG);

        //圆的半径
        var radius = this._stickBG.getBounds().width / 2;

        this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
        this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnded, this);
        this.parent.stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnded, this);
        
        //如果点与圆心距离小于圆的半径,返回true
        if(radius > distance){
            if(!this._lockX)
                this._stick.x = _movePoint.x;
            if(!this._lockY)
                this._stick.y = _movePoint.y;
        }
        
        var event:StickEvent = new StickEvent(StickEvent.STICK);
        event._eventType = 0;
        this.dispatchEvent(event);
    }

    private onTouchMoved(evt: egret.TouchEvent): void {
        // //触摸监听目标
        //var target = evt.target;

        // //把触摸点坐标转换为相对与目标的模型坐标
        let _movePoint = this.globalToLocal(evt.stageX, evt.stageY);
        // //点与圆心的距离
         var distance = this._getDistance(_movePoint, this._stickBG);

        // //圆的半径
         var radius = this._radius;

        // //如果点与圆心距离小于圆的半径,控杆跟随触摸点
        let radian = this._getRadian(_movePoint);
        if(radius > distance){
            if(!this._lockX)
                this._stick.x = _movePoint.x;
            if(!this._lockY)
                this._stick.y = _movePoint.y;
        }
        else{
            if(!this._lockX){
                var x = this._stickBG.x + Math.cos(radian) * this._radius;
                this._stick.x = x;
            }
            if(!this._lockY){
                var y = this._stickBG.y + Math.sin(radian) * this._radius;
                this._stick.y = y;
            }
        }

        if(this._lastRadian != this._radian){
            var event:StickEvent = new StickEvent(StickEvent.STICK);
            event._eventType = 1;
            event._lastRadian = this._lastRadian;
            event._radian = this._radian;
            event._lastDirection = this._lastDirection;
            event._direction = this.computeDirection();
            this.dispatchEvent(event);
            this._lastDirection = event._direction;
        }
    }

    private onTouchEnded(evt: egret.TouchEvent): void {
        // //触摸监听目标
        //var target = evt.target;

        // //摇杆恢复位置
        this._stick.x = this._stickBG.x;
        this._stick.y = this._stickBG.y;

        this.parent.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
        this.parent.stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnded, this);
        this.parent.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnded, this);
        
        var event:StickEvent = new StickEvent(StickEvent.STICK);
        event._eventType = 2;
        event._lastDirection = this._lastDirection;
        event._direction  = 0;
        this.dispatchEvent(event);
    }

    //设置透明度
    public setOpacity(opacity){
        this._stick.alpha = opacity;
    }

    public setBGOpacity(opacity){
        this._stickBG.alpha = opacity;
    }

    public setLockX(b){
        this._lockX = b;
    }

    public setLockY(b){
        this._lockY = b;
    }

    //获取角度
    public getAngle(){
        return this._angle;
    }

    public computeDirection(){
        if(this._lastRadian == this._radian)
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
        if ( this._radian > angle45 && this._radian < (angle45 * 3) && !this._lockX) {
            direction = 1;
        } else if ( this._radian > -angle45 && this._radian <= angle45 && !this._lockY) {
            direction = 0;
        } else if ( this._radian > (-angle45 * 3) && this._radian <= -angle45 && !this._lockX) {
            direction = 3;
        } else if (!this._lockY) {
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
            } else {
                direction = 2;
            }
        }

        if (this._lockX) {
            if (this._radian > 0) {
                direction = 1;
            } else {
                direction = 3;
            }
        }
        return direction;
    }

}