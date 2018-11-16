/** 
 *地图自由生成的类
 */
class Avatar extends egret.Sprite{
    public constructor(){
        super();
    }
    protected scene = null;
    public isDestroyed = false;

    public setScene(scene){
        this.scene = scene;
    }

}
class Player extends Avatar{
    public constructor(){
        super();
        this.create();
    }

    private moveState = 0;
    public speed = 2;
    public lastX = 0;
    public isFiring = false;
    public _direction = 0;
    private create(){
        this.graphics.beginFill(0x0000ff);
        this.graphics.drawRect(0, 0, 20,20);
        this.graphics.endFill();
        this.anchorOffsetX = 20/2;
        this.anchorOffsetY = 20;
        
    }

    public fire(){
        this.setMoveState(0);
        let missile = new Missile(10, 1);
        missile.setOwner(this);
        this.scene.addSprite(missile);
        missile.fire();
        this.scene.setFocusSprite(missile);
        this.isFiring = true;
    }

    public moveStateChange(evt:MoveStickEvent){
        this.moveState = evt._moveState;
        this._direction = evt._direction;
    }

    public setMoveState(state){
        this.moveState = state;
    }

    public onUpdateFrame(){
        //
        if(this.moveState == 0 || this.moveState == 2)
            return;

        if(this._direction == 0){
            this.scene.moveRight(this);
        }
        
        if(this._direction == 2){
            this.scene.moveLeft(this);
        }
    }
}

class Missile extends Avatar{
    public constructor(v0, angle){
        super();
        this.v0 = v0;
        this.angle = angle;
        this.create();
    }
    public v0 = 0;
    public angle = 0;
    public g = 4;
    private time = 0;
    private moving = false;
    private owner = null;
    private bombRadius = 100;
    private create(){
        this.graphics.beginFill(0x0000ff);
        this.graphics.drawRect(0, 0, 10,10);
        this.graphics.endFill();
        this.anchorOffsetX = 10;
        this.anchorOffsetY = 10;

    }

    public onUpdateFrame(){
        if(!this.moving)
            return;
        let xV = this.v0 * Math.cos(this.angle);
        let yV = -this.v0 * Math.cos(this.angle);
        this.x += xV;
        this.y += yV + this.time * this.g;
        this.time += 0.01;

        if(this.scene.isHitPoint(this.x, this.y)){
            this.bomb();
        }
    }

    public fire(){
        this.x = this.owner.x;
        this.y = this.owner.y;
        this.time = 0;
        this.moving = true;
    }

    public bomb(){
        this.scene.removeSprite(this);
        //this.scene.setFocusSprite(this.owner);
        this.moving = false;
        this.scene.onMissileBombed(this, this.bombRadius);
        
    }

    public setOwner(owner){
        this.owner = owner;
    }
}


