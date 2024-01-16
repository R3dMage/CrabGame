function kaboom(x, y, Size){
	this.loc = new position(x,y,Size,Size);
	this.ExplodeDistance = 0;
	this.Done = false;
	
	this.draw = function(){
		if(!this.Done){
			this.ExplodeDistance += 0.5;
			ctx.beginPath();
			ctx.moveTo(this.loc.X, this.loc.Y);
			ctx.arc(this.loc.X, this.loc.Y, this.ExplodeDistance, 2 * Math.PI, false);
			ctx.closePath();
			if(this.ExplodeDistance % 2 == 0)
				ctx.fillStyle = 'rgba(255, 255, 255,' + Math.random()/2 + ')';
			else
				ctx.fillStyle = 'rgba(255, 255, 0,' + Math.random()/2 + ')';
			ctx.fill();
			if (this.ExplodeDistance >= this.loc.Width)
				this.Done = true;
		}
	}	
}

function boom(x, y){
	this.size = 10;
	this.loc = new position(x, y, this.size, this.size);
	this.Image = document.getElementById('Explosion');
	this.Done = false;

	this.draw = function(){
		//ctx.fillText("test", this.loc.x, this.loc.y);
		ctx.drawImage(this.Image, this.loc.X, this.loc.Y, this.size, this.size);
		//console.log(this.loc.x);
		this.loc.size += 1;

		if (this.size > 100)
			this.Done = true;
	}
}