function player(){
// Drawing
	this.image = document.getElementById('CrabGuns');
	this.width = 48;
	this.height = 40;
	this.speed = 8;
    
// Weaponry
	this.WaveCannon = false;
	this.DualCannon = true;
	this.WeaponWeight = 1;

// Shields
    this.Shields = 0;

// Player Damaged / Killed
	this.Splosion = new boom(this.x, this.y);
	this.invincibleTime = 0;
	this.invincible = false;
	this.exploding = false;
	this.explodeDistance = 0;
	this.loc = new position(212.5, 634, this.width, this.height);
	
	this.died = function(){
		this.WaveCannon = false;
		this.DualCannon = false;
		this.WeaponWeight = 1;
        this.Shields = 0;
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
        if(this.WaveCannon)
            return 'WAVE';
        
        if(this.DualCannon)
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
				
                if( this.Shields > 0 )
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
        
        ctx.strokeStyle = WeightChart(this.Shields);
        ctx.beginPath();
        ctx.arc(this.loc.x + this.wingspan, this.loc.y + this.loc.height/2, ShieldRadius, 2 * Math.PI, false);
        ctx.closePath();
        ctx.stroke();
    }
}
  
function missile(x, y, weight, direction, isWave){
	if(isWave)
		this.loc = new position(x, y, 40, 10);
	else
		this.loc = new position(x, y, 3, 9);
  this.weight = weight;
  this.direction = direction;
  this.Wave = isWave;
  
  switch(this.direction){
  case 0:
	this.Duration = y - 400;
	break;
  case 1:
	this.Duration = y + 400;
	break;
  }
  
  this.Color = WeightChart(this.weight);
  
  this.draw = function(ctx){
	if(this.Wave){
		ctx.beginPath();
		ctx.arc(this.loc.x,this.loc.y,20, 0, Math.PI, true);
		ctx.closePath();
		ctx.fillStyle = this.Color;
		ctx.fill();
	}
	else{
		ctx.fillStyle = this.Color;
		ctx.fillRect(this.loc.x, this.loc.y,this.loc.width, this.loc.height);
	}
  }
  
  this.move = function(){
	switch(this.direction){
	case 0:
		this.loc.y -= 10;
		break;
	case 1:
		this.loc.y += 10;
		break;
	}
  }
  
  this.endDuration = function(){
	switch(this.direction){
	case 0:
		if(this.loc.y < this.Duration)
			return true;
		break;
	case 1:
		if(this.loc.y > this.Duration)
			return true;
		break;
	}
	return false;
  }
  
}