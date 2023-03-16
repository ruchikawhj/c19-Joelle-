var PLAY = 1;
var END = 0;
var gameState = PLAY;

var sonic, sonic_running, sonic_angry;
var ground, invisibleGround, groundImage;

var bgImg, bg

var motoBug, motoBugGroup, motoBugImg;

var rings, ringsGroup, ringsImg;

var score = 0;
var gameOverImg, restartImg;

function preload() {
    sonic_running = loadAnimation("0000.png", "0001.png", "0002.png", "0003.png", "0004.png", "0005.png", "0006.png", "0007.png", "0008.png", "0009.png", "0010.png", "0011.png", "0012.png", "0013.png", "0014.png", "0015.png");

    groundImage = loadImage("sonicground1.png");

    sonic_angry = loadAnimation("sonicAngry.png");

    bgImg = loadImage("sonibg.png")

    motoBugImg = loadImage("MotoBug.png");

    ringsImg = loadAnimation("ring1.png", "ring2.png");

    restartImg = loadImage("restart.png")
    gameOverImg = loadImage("gameOver.png")

}

function setup() {
    createCanvas(windowWidth, windowHeight);
    bg = createSprite(width / 2, height / 2);
    bg.scale = 2.4
    bg.addImage(bgImg);

    ringsImg.frameDelay = 5;

    ground = createSprite(width / 2, height, width, 100);
    ground.addImage(groundImage);

    invisibleGround = createSprite(width / 2, height, width, 100);
    invisibleGround.visible = false;

    sonic = createSprite(100, height - 100);
    sonic.addAnimation("running", sonic_running);
    sonic.addAnimation("collided", sonic_angry);
    sonic.scale = 0.3;
   // sonic.debug = true;

    gameOver = createSprite(width / 2, height / 2);
    gameOver.addImage(gameOverImg);

    restart = createSprite(width / 2, height / 2 + 70);
    restart.addImage(restartImg);
    restart.scale = 0.3;

    gameOver.visible = false;
    restart.visible = false;

    motoBugGroup = new Group();
    ringsGroup = new Group();

}

function draw() {

    background(180);

    if (gameState === PLAY) {
        sonic.changeAnimation("running");
        gameOver.visible = false;
        restart.visible = false;

        ground.velocityX = -4;
        if (ground.x <= width / 4) {
            ground.x = width / 2
        }

        if (keyDown("space") && sonic.y > height / 2) {
            sonic.velocityY = -10;
        }
        sonic.velocityY += 0.8;

        if (motoBugGroup.isTouching(sonic)) {
            gameState = END;
        }

        for (var i = 0; i < ringsGroup.length; i++) {
            if (ringsGroup.get(i).isTouching(sonic)) {
                score += 10;
                ringsGroup.get(i).destroy();
            }
        }
        spawnRings();

        spawnMotoBug();
    }
    if (gameState === END) {
        sonic.velocityY = 0;
        ground.velocityX = 0;

        sonic.changeAnimation("collided");
        motoBugGroup.setVelocityXEach(0);
        motoBugGroup.setLifetimeEach(-1);
        ringsGroup.setVelocityXEach(0);
        ringsGroup.setLifetimeEach(-1);

        gameOver.visible = true;
        restart.visible = true;
        if (mousePressedOver(restart)) {
            reset();
        }
    }

    sonic.collide(invisibleGround);
    drawSprites();

    fill("white");
    stroke("red");
    strokeWeight(2);
    textSize(30);
    text("Score: " + score, width - 200, 100);
}







function reset() {
    score = 0;
    gameState = PLAY;
    motoBugGroup.destroyEach();
    ringsGroup.destroyEach();
}


function spawnMotoBug() {
    if (frameCount % 120 === 0) {
        var motoBug = createSprite(width, height - 80, 10, 40);
        motoBug.addImage(motoBugImg)
        motoBug.velocityX = -(6);
      //  motoBug.debug = true

        motoBug.scale = 0.2;
        motoBug.lifetime = 300;

        motoBugGroup.add(motoBug);
    }
}

function spawnRings() {
    if (frameCount % 60 === 0) {
        var rings = createSprite(width, height - 80, 10, 40);
        rings.addAnimation("rings", ringsImg);
        rings.scale = 0.7;
        rings.velocityX = -(6);
        rings.debug = true;
        rings.y = Math.round(random(height / 2 + 100, 3 * height / 4))

      //  rings.scale = 0.2;
        rings.lifetime = 300;

        ringsGroup.add(rings);
    }
}



