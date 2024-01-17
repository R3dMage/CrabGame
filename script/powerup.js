function powerup(x, y){
	this.loc = new position(x, y, 10, 10);
	R = Math.floor(Math.random() * 7);
	switch(R){
	case 0:
		this.letter = 'P';
		break;
	case 1:
		this.letter = 'P';
		break;
	case 2:
		this.letter = 'P';
		break;
	case 3:
		this.letter = 'A';
		break;
	case 4:
		this.letter = 'A';
		break;
    case 5:
        this.letter = 'A';
        break;
    case 6:
        this.letter = 'A';
        break;
	}
	
	this.draw = function(ctx){
		switch(this.letter){
		case 'P':
			this.Color = '#FF9999';
			break;
		case 'D':
			this.Color = '#004400';
			break;
		case 'A':
			this.Color = '#99FF99';
			break;
        case 'W':
            this.Color = '#555500';
            break;
		}
		OldStyle = ctx.fillStyle;
		ctx.fillStyle = this.Color;
		ctx.beginPath();
		ctx.arc(this.loc.x, this.loc.y, 10, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = OldStyle;
	}
	
	this.move = function(){
		this.loc.y += 4;
	}
}