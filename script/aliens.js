var SwooperState = {
	SWOOP   :  0,
	RUSH    :  1,
	RETREAT :  2};
	
function swooper(x, y, health, weight){
	this.loc = new position(x, y, 40, 15);
	this.size = 18;
	this.health = health;
	this.weight = weight;
	this.state = SwooperState.SWOOP;
	this.moveRight = true;
	this.Color = '8844FF'
	let X = (Math.random() * 10) + 80;
	this.posX = this.loc.x + X;
	this.negX = this.loc.x - X;
	this.origY = this.loc.y;
	this.origX = this.loc.x;
	this.swoop = 0;
	this.swoopMax = Math.random() * 10;
	this.powerUp = false;
	if (Math.random() * 100 < 10)
		this.powerUp = true;

	this.draw = function(ctx){
		if (this.isDead())
			return;

		var drawX = this.loc.x + 25;
		var drawY = this.loc.y;
		this.color = WeightChart(this.health);

		ctx.beginPath();
		ctx.moveTo(drawX - 25, drawY);
		ctx.lineTo(drawX, drawY + 10);
		ctx.lineTo(drawX + 25, drawY);
		ctx.lineTo(drawX - 25, drawY);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	this.fire = function(){
		X = Math.random() * 1000;
		if ( X > 1000 - this.weight * 10)
			return true;
		else
			return false;
	}

	this.move = function(){
		if (this.isDead())
			return;

		switch(this.state){
		case SwooperState.SWOOP:
			if (this.moveRight){
				if (this.loc.getX1() < this.posX &&
					this.loc.getX1() < 500)
					this.loc.x += 5;
				else{
					this.moveRight = false;
					this.swoop += 1;
				}
			}
			else{
				if (this.loc.x > this.negX &&
					this.loc.x > 10)
					this.loc.x -= 5;
				else{
					this.moveRight = true;
					this.swoop += 1;
				}
			}
			if(this.swoop >= this.swoopMax &&
				this.loc.x > this.origX - 10 &&
				this.loc.x < this.origX + 10){
				this.swoop = 0;
				this.state = SwooperState.RUSH;
			}
			break;
		case SwooperState.RUSH:
			this.loc.y += 15;
			if (this.loc.y > this.origY + 300){
				this.origY += 100;
				if (this.loc.y > 600)
					this.origY = 50;
				this.state = SwooperState.RETREAT;}
			break;
		case SwooperState.RETREAT:
			this.loc.y -= 5;
			if (this.loc.y <= this.origY)
				this.state = SwooperState.SWOOP;
			break;
		}
	}

	this.isDead = function(){
		return (this.health <= 0);
	}

	this.canShoot = function(){
		return false;
	}
}