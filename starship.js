// Configuration variable
w = window.innerWidth;
h = window.innerHeight;

var config = {
    type: Phaser.AUTO,
    width: w,
    height: h,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png')
    this.load.image('desert', 'assets/desert.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.spritesheet('sn', 'assets/starship.png',
    { frameWidth: 40, frameHeight: 40 });
    this.load.image('upBtn', 'assets/up.png');
    this.load.image('leftBtn', 'assets/left.png');
    this.load.image('rightBtn', 'assets/right.png');
};

// Global game variables
var sn;
var platform;
var cursors;

function create ()
{
    // Images
    this.add.image(w/2, 0.25*h, 'sky').setScale(3);
    this.add.image(w/2, 0.75*h, 'desert').setScale(4);
    this.add.image(w/2, h-20, 'platform').setScale(0.5);

    // Arrow buttons for mobile devices
    //this.add.image(4*w/10, 0.75*h, 'leftBtn', left, this).setScale(0.2);
    //this.add.image(5*w/10, 0.75*h, 'upBtn', up, this).setScale(0.2);
    //this.add.image(6*w/10, 0.75*h, 'rightBtn', right, this).setScale(0.2);

    // Platform
    platform = this.physics.add.sprite(w/2, h, 'platform').setScale(0.5);
    platform.setCollideWorldBounds(true);

    // Starship
    sn = this.physics.add.sprite(Phaser.Math.Between(0,w), 0, 'sn').setScale(1.5);
    sn.body.setGravityY(50);

    // Animation properies
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'sn', frame: 4 } ]
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('sn', { start: 2, end: 3 }),
        frameRate: 30,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('sn', { start: 0, end: 1 }),
        frameRate: 30,
        repeat: -1
    });
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('sn', { start: 7, end: 8 }),
        frameRate: 30,
        repeat: -1
    });

    // Collider call to check landing 
    this.physics.add.collider(sn, platform, checkLanding, null, this);

    // Creating cursor keys
    cursors = this.input.keyboard.createCursorKeys();

    // Adding all the required texts
    velCount = this.add.text(w*0.8,h/6,'v = ',{fontSize: '14px', fill: '#000'});
    snHeight = this.add.text(w*0.2,h/6,'h = ',{fontSize: '14px', fill: '#000'});
    bro = this.add.text(w*0.35, h*0.01, 'CREATED BY Saud Hashmi', {fontSize: "20px", fill: "#ffffff"});
};

let isGameOver = false;

function up() {
    sn.setVelocityY(sn.body.velocity.y - 4);
    sn.anims.play('up', true);
}

function left() {
    sn.setVelocityX(-60);
    sn.anims.play('left', true);
}

function right() {
    sn.setVelocityX(60);
    sn.anims.play('right', true);
}

function update ()
{
    if (sn.y > h && isGameOver == false)
    {
        gameOver = this.add.text(
            w*0.45, 
            h*0.5, 
            'GAME OVER!', 
            { 
                fontSize: '30px', 
                fill: "#000" 
            });
        isGameOver = true;
        game.destroy(removeCanvas=true);
        restartGame();
    }

    if (!isGameOver) {

        velCount.setText('v = ' + Math.round(sn.body.velocity.y));
        snHeight.setText('h = ' + (h - Math.round(sn.body.y)));

        if (cursors.up.isDown)
        {
            up();
        }
        else if (cursors.left.isDown)
        {
            left();
        }
        else if (cursors.right.isDown)
        {
            right();
        }
        else
        {
            sn.setVelocityX(0);
            sn.anims.play('turn', true);
        }
    }
};

function checkLanding() {
    if (sn.body.velocity.y > 20 && sn.y < w) {
        const landed = false;
        restartGame(landed);
    }
    else {
        const landed = true;
        restartGame(landed);
    }
}

function restartGame(landed) {

    game.destroy(removeCanvas=true);

    var h1 = document.createElement("h1");
    var text = document.createTextNode("Do you wanna restart the game?");
    h1.appendChild(text);

    var div = document.getElementById("screen");
    div.appendChild(h1);

    if (landed) {
        var LC = document.createElement("h1");
        LC.id = "landingConfirmed";
        var LCText = document.createTextNode("LANDING CONFIRMED!");
        LC.appendChild(LCText);
        div.appendChild(LC);
    } else {
        var LF = document.createElement("h1");
        LF.id = "landingFailed";
        var LFText = document.createTextNode("LANDING FAILED!");
        LF.appendChild(LFText);
        div.appendChild(LF);
    }

    var yesBtn = document.createElement("button");
    yesBtn.id = "yes";
    yesBtn.innerText = "YES";

    div.appendChild(yesBtn);

    yesBtn.onclick = () => {
        window.location.reload();
    }
}
