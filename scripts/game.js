const config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100vh',
    title: 'Catch the eggs',
    useTicker: true,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    physics: {
        default: 'arcade',
    }
};

const scaleRatio = window.devicePixelRatio / 3;
const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('hen', 'assets/images/hen.svg');
    this.load.image('egg', 'assets/images/egg.svg');
    this.load.image('bowl', 'assets/images/bowl.svg');
    this.load.image('arrowRight', 'assets/images/arrow-right.png');
    this.load.image('arrowLeft', 'assets/images/arrow-left.png');
}


let henSpeed = 100;

function create() {
    this.score = 0;
    this.scoreText = this.add.text(0, 0, 'Score: 0', { fontSize: '32px', fill: '#000' });
    this.scoreText.depth = 1;

    this.lifes = 5;
    this.lifesText = this.add.text(300, 0, `Lifes: ${this.lifes}`, { fontSize: '32px', fill: '#000' });
    this.lifesText.depth = 1;


    // create the background
    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.displayWidth = window.innerWidth;
    background.displayHeight = window.innerHeight;

    // create the chicken
    this.hen = this.physics.add.sprite(50, 60, 'hen');
    this.hen.setScale(0.5);
    this.hen.setCollideWorldBounds(true);

    this.bowl = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight - 30, 'bowl');
    this.bowl.setCollideWorldBounds(true);

    this.arrowRight = this.physics.add
        .sprite(window.innerWidth - 50, window.innerHeight - 30, 'arrowRight');
    this.arrowRight.setInteractive();
    this.arrowRight.on('pointerdown', (event) => {
        this.bowl.setVelocityX(160);
    });
    this.arrowRight.on('pointerup', (event) => {
        this.bowl.setVelocityX(0);
    });

    this.arrowLeft = this.physics.add
        .sprite(50, window.innerHeight - 30, 'arrowLeft');

    this.arrowLeft.setInteractive();
    this.arrowLeft.on('pointerdown', (event) => {
        this.bowl.setVelocityX(-160);
    });
    this.arrowLeft.on('pointerup', (event) => {
        this.bowl.setVelocityX(0);
    });

    this.egg = this.physics.add.image(50, 40, 'egg');
    this.egg.setCollideWorldBounds(true);
    this.eggSpeed = Phaser.Math.GetSpeed(600, 6);
    this.physics.add.collider(this.bowl, this.egg, upScore , null, this);
}

function upScore() {
    resetEgg(this);
    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);
}

function downLifes(scene) {
    scene.lifes--;
    scene.lifesText.setText(`Lifes: ${scene.lifes}`);
}


function resetEgg(scene) {
    scene.egg.x = scene.hen.x;
    scene.egg.y = scene.hen.y;
}

function update(time, delta) {
    if (this.hen.x > window.innerWidth - 50) {
        this.hen.setVelocityX(-henSpeed);
    } else if (this.hen.x <= 50) {
        this.hen.setVelocityX(henSpeed);
    }

    this.egg.y += this.eggSpeed * delta + this.score / 100;
    henSpeed = 100 + this.score;

    if (this.egg.y >= window.innerHeight - 30) {
        downLifes(this);
        resetEgg(this);
    }
}