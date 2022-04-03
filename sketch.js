var trex, trexImg;
var ground, groundImg;
var invisible_ground;
var cloudImg;
var cactus1Img,cactus2Img,cactus3Img,cactus4Img,cactus5Img,cactus6Img;
var diesound,jumpsound,checkpointsound;
var trex_collided;
var score;
var PLAY = 1;
var END = 0; 
var gameState = PLAY;

function preload() {
  trexImg = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  diesound = loadSound("die.mp3");
  jumpsound = loadSound("jump.mp3");
  checkpointsound = loadSound("checkpoint.mp3");
  restartImg = loadImage("restart.png");
  gameoverImg = loadImage("gameOver.png");
  groundImg = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  cactus1Img = loadImage("obstacle1.png");
  cactus2Img = loadImage("obstacle2.png");
  cactus3Img = loadImage("obstacle3.png");
  cactus4Img = loadImage("obstacle4.png");
  cactus5Img = loadImage("obstacle5.png");
  cactus6Img = loadImage("obstacle6.png");
}

function setup() {
  createCanvas(600, 200);

  score = 0;

  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trexImg);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;

  gameOver = createSprite(300,100);
  gameOver.addImage(gameoverImg);
  gameOver.scale = 3;

  restart = createSprite(300,150)
  restart.addImage(restartImg);
  restart.scale = 0.5;

  ground = createSprite(300, 185, 600, 10);
  ground.addImage(groundImg);
  ground.velocityX = -(4+ 3 *score / 100 );
  ground.x = ground.width / 2;

  var edges = createEdgeSprites();

  invisible_ground = createSprite(300, 190, 600, 10);
  invisible_ground.visible = false;
  
  obstacleGroup = new Group();
  cloudGroup = new Group();

  var rand = Math.round(random(10,60));

}

function draw() {
  background(180);

  textSize(15);
  text("Score = "+score,510,17);

  trex.setCollider("circle",0,0,40);
  trex.debug = false;

  if(gameState === PLAY){
  gameOver.visible = false;
  restart.visible = false;
   ground.velocityX = -4;
   score = score + Math.round(getFrameRate() / 60); 
   if(score > 0 && score %1000 === 0){
    checkpointsound.play();
   }
   if (ground.x < 0) {
    ground.x = ground.width / 2;
  }
  if (keyDown("space") && trex.y > 100) {
    trex.velocityY = -10;
    jumpsound.play();
  }
  trex.velocityY = trex.velocityY + 0.5;
  spawnClouds();
  spawnObstacles();
if(obstacleGroup.isTouching(trex)){
  gameState = END;
  //trex.velocityY = -12;
  diesound.play();
}

}
  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    trex.changeAnimation("collided", trex_collided);
    trex.velocityX = 0;
    trex.velocityY = 0;
    ground.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
      reset();
    }
  }



  trex.collide(invisible_ground);

  drawSprites();

}

function spawnClouds(){
  if(frameCount % 60 === 0){
    var cloud = createSprite(600,100,40,10);
    cloud.velocityX = -3;
    cloud.addImage(cloudImg);
    cloud.y = Math.round(random(10,60));
    cloud.lifetime = 210;
    cloud.depth = trex.depth;
    trex.depth = trex.depth +1;
    
    cloudGroup.add(cloud);
  }
}

function spawnObstacles(){
  if(frameCount % 60 === 0){
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6+ score / 100);
    obstacle.depth = trex.depth;
    trex.depth = trex.depth +1;

    var rand = Math.round(random(1,6));
   switch(rand){
     case 1: obstacle.addImage(cactus1Img);
             break;
     case 2: obstacle.addImage(cactus2Img);
             break;
     case 3: obstacle.addImage(cactus3Img);
             break;
     case 4: obstacle.addImage(cactus4Img);
             break;
     case 5: obstacle.addImage(cactus5Img);
             break;
     case 6: obstacle.addImage(cactus6Img);
             break;
     default:break;       
   }
  obstacle.scale = 0.5;
  obstacle.lifetime = 210;

  obstacleGroup.add(obstacle);
  }

}

function reset(){
  gameState = PLAY;
  restart.visible = false;
  gameOver.visible = false;
  cloudGroup.destroyEach();
  obstacleGroup.destroyEach();
  trex.changeAnimation("running",trexImg);
  score = 0;
}