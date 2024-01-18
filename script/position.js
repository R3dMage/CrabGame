function position(x, y, W, H){
	this.x = x;
	this.y = y;
	this.width = W;
	this.height = H;
	this.getX1 = function(){
		return this.x + this.width;
	}
	this.getY1 = function(){
		return this.y + this.height;
	}
	 
	 this.collidedWith = function(L1){
		if(( L1.getY1() < this.y ) || ( L1.y > this.getY1() ||
			( L1.x > this.getX1() ) || ( L1.getX1() < this.x )))
		{
			return false;
		}
		else
		{
			return true;
		}
	 }
}