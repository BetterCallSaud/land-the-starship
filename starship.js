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
};

var sn;
var platform;
var cursors;

function create ()
{
    // Images
    this.add.image(w/2, 0.25*h, 'sky').setScale(3);
    this.add.image(w/2, 0.75*h, 'desert').setScale(4);
    this.add.image(w/2, h-20, 'platform').setScale(0.5);

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
        frameRate: 0.1,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('sn', { start: 0, end: 1 }),
        frameRate: 0.1,
        repeat: -1
    });
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('sn', { start: 7, end: 8 }),
        frameRate: 20,
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

function update ()
{
    if (sn.y > h && isGameOver == false)
    {
        gameOver = this.add.text(w*0.45, h*0.5, 'GAME OVER!', { fontSize: '30px', fill: "#000" });
        isGameOver = true;
    }

    if (!isGameOver) {

        velCount.setText('v = ' + Math.round(sn.body.velocity.y));
        snHeight.setText('h = ' + Math.round(sn.body.y));

        if (cursors.up.isDown)
        {
            sn.setVelocityY(sn.body.velocity.y - 5);
            sn.anims.play('up', true);
        }
        else if (cursors.left.isDown)
        {
            sn.setVelocityX(-90);
            sn.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            sn.setVelocityX(90);
            sn.anims.play('right', true);
        }
        else
        {
            sn.setVelocityX(0);
            sn.anims.play('turn', true);
        }
    }
};

function checkLanding() {
    if (sn.body.velocity.y > 15 && sn.y < w) {
        this.physics.pause();
        landingFailed = this.add.text(w*0.44, h*0.5, "Starship crashed...", {fontSize: "30px", fill: "#000"});
        sn.setTint(0xff0000);
        sn.anims.play('turn');
        game.destroy(removeCanvas=false);
    }
    else {
        this.physics.pause();
        landingConfirmed = this.add.text(w*0.44, h*0.5, "Landing confirmed...", {fontSize: "30px", fill: "#000"});
        sn.setTint(0x00ff00);
        sn.anims.play('turn');
        game.destroy(removeCanvas=false);
    }
}