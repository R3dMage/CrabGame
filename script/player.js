function player(){
// Drawing
	this.image = document.getElementById('CrabGuns');
	this.width = 48;
	this.height = 40;
	this.speed = 8;
	
// Weaponry
	this.waveCannon = false;
	this.dualCannon = true;
	this.weaponWeight = 1;

// Shields
	this.shields = 0;

// Player Damaged / Killed
	this.Splosion = new boom(this.x, this.y);
	this.invincibleTime = 0;
	this.invincible = false;
	this.exploding = false;
	this.explodeDistance = 0;
	this.loc = new position(212.5, 634, this.width, this.height);
	
	this.died = function(){
		this.waveCannon = false;
		this.dualCannon = false;
		this.weaponWeight = 1;
		this.shields = 0;
	}

	this.canShoot = function(){
		return (!this.exploding);
	}
	
	this.setPosition = function(x, y){
		if(!this.exploding){
			if(x < 0)
				x = 0;
			else if( x > 500 - (this.width))
				x = 500 - (this.width);
			
			if(y < 0)
				y = 0;
			if(y > 750 - this.height)
				y = 750 - this.height;
				
			this.loc.x = x;
			this.loc.y = y;
		}
	}

	this.moveLeft = function(){
		this.setPosition(this.loc.x - this.speed, this.loc.y);
	}

	this.moveRight = function(){
		this.setPosition(this.loc.x + this.speed, this.loc.y);
	}

	this.moveUp = function(){
		this.setPosition(this.loc.x, this.loc.y - this.speed);
	}

	this.moveDown = function(){
		this.setPosition(this.loc.x, this.loc.y + this.speed);
	}
	
	this.getMissileType = function(){
		if(this.waveCannon)
			return 'WAVE';
		
		if(this.dualCannon)
			return 'DUAL';
		
		return 'SINGLE';
	}
	
	this.draw = function(ctx){
		try {
			if(!this.exploding){
				ctx.drawImage(this.image, this.loc.x, this.loc.y, this.width, this.height);
				if(this.invincible){
					ctx.font = '10px Arial';
					ctx.fillStyle = 'rgba(142,214,255,' + this.invincibleTime * 0.013 + ')';
					ctx.fillText(75 - this.invincibleTime, this.loc.getX1() - 5, this.loc.y + 10);
					this.invincibleTime += 1;
					if(this.invincibleTime >= 75){
						this.invincibleTime = 0;
						this.invincible = false;
					}
				}

				if( this.shields > 0 )
					this.drawShields();
			}
			else{
				this.explodeDistance += 0.5;
				ctx.beginPath();
				ctx.moveTo(this.loc.x + this.loc.width / 2, this.loc.y + this.loc.height / 2);
				ctx.arc(this.loc.x + this.loc.width / 2, this.loc.y + this.loc.height / 2, this.explodeDistance, 2 * Math.PI, false);
				if(this.explodeDistance % 2 == 0)
					ctx.fillStyle = 'rgba(255, 255, 255, 1)';
				else
					ctx.fillStyle = 'rgba(255, 255, 0, 1)';
				ctx.fill();
				if (this.explodeDistance >= 40){
					this.explodeDistance = 0;
					this.exploding = false;
					this.loc.x = 250;
					this.loc.y = 634;
				}
			}
		}
		catch (e){
		}
	}
	
	this.drawShields = function(){
		var ShieldRadius = 0;
		if( this.loc.width > this.loc.height )
			ShieldRadius = this.loc.width;
		else
			ShieldRadius = this.loc.height;
		
		ctx.strokeStyle = WeightChart(this.shields);
		ctx.beginPath();
		ctx.arc(this.loc.x + this.wingspan, this.loc.y + this.loc.height/2, ShieldRadius, 2 * Math.PI, false);
		ctx.closePath();
		ctx.stroke();
	}

	this.processPowerUp = function(letter){
		switch(letter){
			case 'P':
				this.weaponWeight += 1;
				break;
			case 'A':
				this.shields += 1;
				break;
		}
	}

	this.getProjectiles = function(){
		let projectiles = [];
		let shotSpeed = 10;
		let target = new position(this.loc.x, -10, 0, 0);

		target = new position(this.loc.x + 6, -10, 0, 0);
		projectiles.push(new missile(this.loc.x + 6, this.loc.y, target, shotSpeed, this.weaponWeight, this.waveCannon));
		target = new position(this.loc.x + 42, -10, 0, 0);
		projectiles.push(new missile(this.loc.x + 42, this.loc.y, target, shotSpeed, this.weaponWeight, this.waveCannon));
		
		return projectiles;
	}
}

function missile(x, y, target, speed, weight, isWave){
	if(isWave)
		this.loc = new position(x, y, 40, 10);
	else
		this.loc = new position(x, y, 3, 9);
	this.target = target;
	this.weight = weight;
	this.speed = speed;
	this.direction = Math.atan2(target.y - this.loc.y, target.x - this.loc.x);
	this.wave = isWave;

	this.Color = WeightChart(this.weight);

	this.draw = function(ctx){
		ctx.fillStyle = this.Color;
		ctx.save();
		ctx.translate(this.loc.x, this.loc.y);
		ctx.rotate(this.direction + Math.PI / 2);

		if(this.wave){
			ctx.beginPath();
			ctx.arc(this.loc.width / 2, this.loc.height / 2, this.loc.width / 2, 0, Math.PI, true);
			ctx.fill();
		}
		else{
			ctx.fillRect(this.loc.width / -2, this.loc.height / -2, this.loc.width, this.loc.height);
		}
		
		ctx.restore();
	}

	this.move = function(){		
		this.loc.x += Math.cos(this.direction) * this.speed;
		this.loc.y += Math.sin(this.direction) * this.speed;
	}

	this.endDuration = function(){
		if(this.loc.y < -5 || this.loc.y > 720 || this.loc.x < -5 || this.loc.x > 500)
			return true;

		return false;
	}
}