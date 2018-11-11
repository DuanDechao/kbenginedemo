/** 
 *地图自由生成的类
 */
class Avatar extends egret.Sprite{
    public constructor(){
        super();
    }
    protected scene = null;
    public isDestroyed = true;

    public setScene(scene){
        this.scene = scene;
    }

}
class Player extends Avatar{
    public constructor(){
        super();
        this.create();
    }

    public moveState = 0;
    public speed = 2;
    public lastX = 0;

    private create(){
        this.graphics.beginFill(0x0000ff);
        this.graphics.drawRect(0, 0, 20,20);
        this.graphics.endFill();
        this.anchorOffsetX = 20;
        this.$anchorOffsetY = 20;
    }

    public onUpdateFrame(){
        if(this.moveState == 1){
            this.onSpriteMove(this, true);
        }
        if(this.moveState == 2){
            this.onSpriteMove(this, false);
        }
    }

    private onSpriteMove(sprite, isRight){
        if(this.scene == null)
            return;
        let xStep = this.scene.getXStep();
        let groundYs = this.scene.getGroundYs();
        let step = Math.floor(sprite.x / xStep);
        if(!isRight && sprite.x == step * xStep){
            step -= 1;
        }
        let tan = (groundYs[step + 1] - groundYs[step])/xStep;
        let cos = Math.cos(tan);
        let speed = sprite.speed;
        sprite.lastX = sprite.x;
        if(cos < 0){
               cos = 1 + cos;
           }
        let xMove = speed * cos;
        if(xMove <= 1){
            xMove = 1;
        }

        if(isRight){
            sprite.x += xMove;
            sprite.y += xMove * tan;
        }
        else{
            sprite.x -= xMove;
            sprite.y -= xMove * tan;
        }

        if(isRight){
            if(sprite.x >= xStep * (step + 1)){
                if(groundYs[step + 2] < groundYs[step +1])
                    sprite.anchorOffsetX = 20;
                else
                    sprite.anchorOffsetX = 0;
                sprite.x = xStep * (step + 1);
                sprite.y = groundYs[step + 1];
            }
        }
        else{
            if(sprite.x <= xStep * step){
                sprite.x = xStep * step;
                sprite.y = groundYs[step];
            }
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
        this.time+= 0.01;

        let xStep = this.scene.getXStep();
        let groundYs = this.scene.getGroundYs();
        let step = Math.floor(this.x / xStep);
        let tan = (groundYs[step + 1] - groundYs[step])/xStep;
        let cos = Math.cos(tan);
        if(cos < 0){
               cos = 1 + cos;
           }
        let xMove = (this.x - xStep * step) * cos;
        let y = groundYs[step] + xMove * tan;
        if(this.y < y){
            this.scene.removeSprite(this);
            console.log("mmmmmmmmmmmmm");
        }
    }

    public startMove(){
        this.moving = true;
    }
}


