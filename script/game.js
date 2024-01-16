// Vital Game variables
var width = 500,
 height = 720,
 gLoop,
 gameState = 'PreRun',
 Score = 0;
 Lives = 5;
 Level = 1;
 Kills = 0;
 
var Enemies = [];
var Missiles = [];
var Explosions = [];
var PowerUps = [];
var howManyCircles = 4, circles = [];
var xplode = new boom(50, 50);

// Get the context from off the page!
 c = document.getElementById('c'),
 ctx = c.getContext('2d');

c.top = 150;
c.width = width + 110;
c.height = height;
Player = new player();

var clear = function(){
  ctx.fillStyle = '#0000FF';  
  ctx.beginPath();
  ctx.rect(0,0, width, height);
  ctx.closePath();
  ctx.fill();
    
    ctx.fillStyle = '#EEEEEE';
    ctx.beginPath();
    ctx.rect(width, 0, width + 100, height);
    ctx.closePath();
    ctx.fill();
  };

function pad(num) {
    var s = num+"";
    while (s.length < 10) s = "0" + s;
    return s;
}

KeyboardController({37: function() {Player.setPosition(Player.loc.X - 8, Player.loc.Y);},
          38: function() {Player.setPosition(Player.loc.X, Player.loc.Y - 8);},
          39: function() {Player.setPosition(Player.loc.X + 8, Player.loc.Y);},
          40: function() {Player.setPosition(Player.loc.X, Player.loc.Y + 8);}},20);

function PlayerShoot(){
  if(!Player.Exploding){
    Missiles.push(new missile(Player.loc.X - 18, Player.loc.Y, Player.WeaponWeight, 0, Player.WaveCannon));
    Missiles.push(new missile(Player.loc.X + 18, Player.loc.Y, Player.WeaponWeight, 0, Player.WaveCannon));
  }
}

function StartGame(){
  Enemies.splice(0, Enemies.length);
  Missiles.splice(0, Enemies.length);
  Kills = 0;
  Score = 0;
  Lives = 5;
  Level = 1;
  Player = new player();
  gameState = 'Run';
}

function HandlePowerUps(P,idx,array){
  P.move();
  P.draw();
  
  if( P.loc.CollidedWith( Player.loc) ){
    switch(P.Letter){
    case 'P':
      Player.WeaponWeight += 1;
      break;
    case 'D':
      Player.DualCannon = true;
      break;
        case 'A':
            Player.Shields += 1;
            break;
    case 'W':
      Player.WaveCannon = true;
      break;
    }
    PowerUps.splice(idx,1);
  }
  if( P.loc.Y > 720 )
    PowerUps.splice(idx,1);
}

function HandleKabooms(K,idx,array){
  K.draw();
  if(K.Done)
    Explosions.splice(idx,1);
}

function HandleMissiles(M,idx,array){  
    M.move();
  M.draw();
  
  for (var i = 0; i < Enemies.length; i++){
    // Check if player hit any bad guys!
    if( M.loc.CollidedWith( Enemies[i].loc) ){
      Enemies[i].Health -= M.Weight;
      if (Enemies[i].Health <= 0){
      // The enemy player hit has died. Get Points!
        Score += Enemies[i].Weight * 100;
        Explosions.push(new kaboom(Enemies[i].loc.X + Enemies[i].loc.Width / 2, Enemies[i].loc.Y, 15));
        if (Enemies[i].PowerUp){
          PowerUps.push(new powerup(Enemies[i].loc.X, Enemies[i].loc.Y));
        }
        Enemies.splice(i,1);
        Missiles.splice(idx,1);
        Kills += 1;
      }
    }
  }
  
  // Check if bad guy shot the player!
  if( M.Direction != 0 && M.loc.CollidedWith( Player.loc) ){
    // Some sort of player hit animation
    Player.Exploding = true;
    Player.Invincible = true;
    Player.died();
    Lives -= 1;
  }
  
  if (M.EndDuration())
    Missiles.shift();
}

function HandleEnemies(E, idx, array){
    E.move();
  E.draw();
  // Check if player collided with a bad guy
  if( !Player.Invincible && E.loc.CollidedWith( Player.loc) ){
    if (Player.Shields > 0){
            Player.Invincible = true;
            Player.Shields -= 1;
        }
        else{
            // Some sort of player hit animation
            Player.Exploding = true;
            Player.Invincible = true;
            Player.died();
            Lives -= 1;
        }
  }
  if (E.fire()){
    //Missiles.push(new missile(E.loc.X + (E.loc.getX1()/2), E.loc.getY1(), E.Weight, 1))
  }
  // If enemy gets to the bottom stop thinking about him
  if (E.loc.Y > 720)
    Enemies.shift();
}

function DrawStatus(){
// Draw the status on the top of the screen
    ctx.font = "15px Arial";
    ctx.textAlign = 'right';
    ctx.fillStyle = "White";
    ctx.fillText("Score: " + pad(Score),490,15);
    ctx.textAlign = 'center';
    ctx.fillText("Lives: " + Lives, 250, 15);
    ctx.textAlign = 'left';
    ctx.fillText('Level: ' + Level, 0, 15);
    
// Draw player ship status on right
    ctx.textAlign = 'left';
    ctx.fillStyle = 'Black';
    ctx.fillText( 'Type:' + Player.getMissileType(), 505, 100 );
    ctx.fillText( 'Gun:', 505, 120 );
    ctx.fillText( 'Shield:', 505, 140 );
    
    if( Player.Shields == 0 )
        ctx.fillText( 'NONE', 550, 140 );
    else
    {
        ctx.fillStyle = WeightChart(Player.Shields);
        ctx.fillRect( 550, 130, 40, 10 );
    }
    
    ctx.fillStyle = WeightChart(Player.WeaponWeight);
    ctx.fillRect( 550, 110, 40, 10 );
    
    
}

function PlayGame(){
    clear();
    X = Math.random() * 1000;
    if(Enemies.length < 5 && X > 990 ){
      Enemies.push(new swooper((Math.random() * 400 + 100), Math.random() * 50, Level, Level));
    }
   
// Handle all the drawing on the screen
    MoveCircles(Level); 
    DrawCircles();
    Missiles.forEach(HandleMissiles);
    Enemies.forEach(HandleEnemies);
    Explosions.forEach(HandleKabooms);
    PowerUps.forEach(HandlePowerUps);
    Player.draw();
    
    DrawStatus();
 // Handle Level Ups
    if( Kills > Level * 10 )
        Level += 1;
 // Handle dead player
    if( Lives <= 0 && !Player.Exploding ){
        gameState = 'GameOver';
    }
}

function PreGame(){
  clear();
  ctx.fillStyle = "White";
  ctx.font = "40px Arial";
  ctx.textAlign = 'center';
  ctx.fillText("Crab Guns!", 500/2, 200);
  
  ctx.font = '10px Arial';
  ctx.fillText('Press SPACE to play',250, 500);
  
  MoveCircles(1); 
  DrawCircles();

  xplode.draw();
}

function GameOver(){
  // Find out if we need to record users initials for highscore list
  // If so we need to run that function
  clear();
  ctx.fillStyle = "White";
  ctx.font = "40px Arial";
  ctx.textAlign = 'center';
  ctx.fillText("GAME OVER!", 500/2, 200);
  
  ctx.font = '10px Arial';
  ctx.fillText('Press SPACE to play',250, 500);
  
  MoveCircles(1); 
  DrawCircles();
}

function DisplayHighScores(){
  Request = new XMLHttpRequest();
  Request.open("POST","GetScore.php",true);
  Request.send();
  Request.onreadystatechange=function(){
    document.getElementById("highscores").innerHTML=Request.responseText;
  }
}

function RecordHighScore(){
  Request = new XMLHttpRequest();
  Request.open("POST","LogScore.php",true);
  Request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  Request.send("name=" + Name + "&score=" + Score);
}

var GameLoop = function(){
  switch (gameState){
  case "PreRun": 
  PreGame();
  break;
  case "Run":
  PlayGame();
  break;
  case "GameOver":
  GameOver();
  break;
  }
  gLoop = setTimeout(GameLoop, 1000 / 50);
}
DisplayHighScores();
initCircles();
GameLoop();