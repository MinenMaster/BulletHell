const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const pcanvas = document.getElementById("pcanvas");
const pctx = pcanvas.getContext("2d");
const hpElement = document.getElementById("hp");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const endScoreElement = document.getElementById("endScore");
const endHighScoreElement = document.getElementById("endHighScore");
const startMenu = document.getElementById("start-menu");
const gameOverMenu = document.getElementById("game-over-menu");
const gameContainer = document.getElementById("gameContainer");
const restartButton = document.getElementById("restart-button");
const level1Button = document.getElementById("level1Button");
const level2Button = document.getElementById("level2Button");
const level3Button = document.getElementById("level3Button");
const startHelpButton = document.getElementById("start-help-button");
const endHelpButton = document.getElementById("end-help-button");
const helpMenu = document.getElementById("help-menu");
const startInfoButton = document.getElementById("start-info-button");
const endInfoButton = document.getElementById("end-info-button");
const infoMenu = document.getElementById("info-menu");

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;
pcanvas.width = window.innerWidth * 0.05;
pcanvas.height = window.innerHeight * 0.1;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.drawX = pcanvas.width / 2;
        this.drawY = pcanvas.height / 2;
        this.radius = radius;
        this.color = color;
        this.angle = 0;
        this.SpeedX = 0;
        this.SpeedY = 0;
        this.maxSpeed = 16;
        this.acceleration = 0.85;
        this.shootSpeed = 20;
        this.health = 100;
    }

    draw() {
        pctx.beginPath();
        pctx.fillStyle = "darkgray";
        pctx.lineWidth = 10;
        pctx.moveTo(this.drawX, this.drawY);
        pctx.lineTo(this.drawX + this.radius - 1, this.drawY);
        pctx.lineTo(this.drawX, this.drawY - this.radius - 10);
        pctx.lineTo(this.drawX - this.radius + 1, this.drawY);
        pctx.closePath();
        pctx.fill();
        pctx.beginPath();
        pctx.arc(this.drawX, this.drawY, this.radius, 0, Math.PI * 2, false);
        pctx.fillStyle = this.color;
        pctx.fill();
        pctx.closePath();
    }

    update() {
        this.angle = Math.atan2(mouse_y - this.y, mouse_x - this.x);
        this.draw();
        pcanvas.style.transform = `rotate(${this.angle + Math.PI / 2}rad)`;
    }
}

class Enemy {
    constructor(x, y, radius, color, level, health, shootingStyle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.randomAngle = Math.random() * Math.PI * 2;
        this.straightAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
        if (this.straightAngles.includes(this.randomAngle)) {
        this.angle = this.randomAngle + (Math.random() - 2) * 0.1; // Adjust by a small random value between -2 and 2
        } else {
        this.angle = this.randomAngle;
        }
        this.speed = 2;
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed,
        };
        this.shootingInterval = 2000 / level; // Adjust the shooting interval based on level
        this.lastShootTime = 0;
        this.shootSpeed = 2;
        this.health = health;
        this.shootingStyle = shootingStyle;
        this.circleFire = {
            cooldown: 10000, // 10 Seconds
            lastFiredTime: 0,
            numShots: 50,
            spreadAngle: (Math.PI * 2) / 50, // Angle between each shot
            consecutiveShots: 1
        };
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    
        // Reverse direction when hitting the edges of the canvas
        if (this.x + this.radius > canvas.width + canvas.width*0.1 || this.x - this.radius < 0 - canvas.width*0.1) {
            this.velocity.x *= -1;
        }
        if (this.y + this.radius > canvas.height + canvas.height*0.1  || this.y - this.radius < 0 - canvas.height*0.1) {
            this.velocity.y *= -1;
        }
    
        // Check if enough time has passed to shoot
        const currentTime = Date.now();
        if (currentTime - this.lastShootTime > this.shootingInterval) {
            // Shoot projectiles based on the shooting style
            if (this.shootingStyle === "normal") {
                const angle = Math.atan2(player.y - this.y, player.x - this.x);
                const velocity = {
                    x: Math.cos(angle) * this.shootSpeed * (this.level + 1),
                    y: Math.sin(angle) * this.shootSpeed * (this.level + 1),
                };
                projectiles.push(new Projectile(this.x, this.y, 5, "yellow", velocity, "enemy"));
            } else if (this.shootingStyle === "boss") {
                for (let i = 0; i < 3; i++) {
                    const angle = Math.atan2(player.y - this.y, player.x - this.x);
                    const spreadAngle = (Math.PI / 20) * (i - 1); // Adjust the spread angle as per your preference
                    const totalAngle = angle + spreadAngle;
                    const velocity = {
                        x: Math.cos(totalAngle) * this.shootSpeed * (this.level + 1),
                        y: Math.sin(totalAngle) * this.shootSpeed * (this.level + 1),
                    };
                    projectiles.push(new Projectile(this.x, this.y, 5, "yellow", velocity, "enemy"));
                }
            }
            this.lastShootTime = currentTime;
        }
        if (this.shootingStyle === "boss") {
            // Check if enough time has passed since the last circle fire
            if (currentTime - this.circleFire.lastFiredTime > this.circleFire.cooldown) {
                for (let i = 0; i < this.circleFire.consecutiveShots; i++) {
                    setTimeout(() => {
                        for (let j = 0; j < this.circleFire.numShots; j++) {
                            const angle = player.angle + j * this.circleFire.spreadAngle  + (i * 0.2);
                            const velocity = {
                                x: Math.cos(angle) * this.shootSpeed * this.level,
                                y: Math.sin(angle) * this.shootSpeed * this.level,
                            };
                            projectiles.push(new Projectile(this.x, this.y, 5, "fuchsia", velocity, "enemy"));
                        }
                    }, i * 200); // Delay each consecutive shot by 200 milliseconds
                }

                // Update the last fired time
                this.circleFire.lastFiredTime = currentTime;
            }
        }
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity, shooter) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.shooter = shooter;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

let keys = {};
let mouse_x = 0;
let mouse_y = 0;
const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 30, "white");
const projectiles = [];
const enemies = [];
const thirdFire = {
    cooldown: 20000, // 20 Seconds
    lastFiredTime: 0,
    numShots: 75,
    spreadAngle: (Math.PI * 2) / 75, // Angle between each shot
    consecutiveShots: 3
};
const secondFire = {
    cooldown: 15000, // 15 Seconds
    lastFiredTime: 0,
    numShots: 1,
    consecutiveShots: 75
};
let level = 0;
let score = 0;
let highScore = 0;
let animationId;

function spawnEnemies() {

    for (let i = 0; i < 10; i++) {
        let x, y;
        const color = i === 0 ? "purple" : "blue"; // Set the color of the first enemy to purple
        const health = i === 0 ? 10 : 1;
        const radius = i === 0 ? 30 : 15;
        const shootingStyle = i === 0 ? "boss" : "normal";

        // Generate random positions on the sides of the canvas
        if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
        } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        enemies.push(new Enemy(x, y, radius, color, level, health, shootingStyle));
        increaseEnemyShootingSpeed();
    }
}

function updatePlayerPosition() {
    if (keys["w"]) {
        player.SpeedY -= player.acceleration;
    }
    if (keys["a"]) {
        player.SpeedX -= player.acceleration;
    }
    if (keys["s"]) {
        player.SpeedY += player.acceleration;
    }
    if (keys["d"]) {
        player.SpeedX += player.acceleration;
    }

    // Limit the player's speed
    player.SpeedX = Math.max(-player.maxSpeed, Math.min(player.SpeedX, player.maxSpeed));
    player.SpeedY = Math.max(-player.maxSpeed, Math.min(player.SpeedY, player.maxSpeed));

    // Restrict horizontal movement
    const minX = 0;
    const maxX = window.innerWidth * 0.8;
    player.x = Math.max(minX, Math.min(player.x, maxX));

    // Restrict vertical movement
    const minY = 0;
    const maxY = window.innerHeight * 0.8;
    player.y = Math.max(minY, Math.min(player.y, maxY));

    // Update the player's position
    player.x += player.SpeedX;
    player.y += player.SpeedY;
    pcanvas.style.left = player.x + (window.innerWidth * 0.1) - (window.innerWidth * 0.025) + "px";
    pcanvas.style.top = player.y + (window.innerHeight * 0.1) - (window.innerHeight * 0.05) + "px";

    // Apply friction to gradually reduce the player's speed
    player.SpeedX *= 0.99;
    player.SpeedY *= 0.99;
}

function increaseEnemyShootingSpeed() {
    enemies.forEach((enemy) => {
        enemy.level = level;
        enemy.shootingInterval = 2000 / enemy.level;
    });
}

function startGame() {
    // Hide the start menu
    startMenu.classList.add("hidden");

    // Show the game container
    document.getElementById("gameContainer").classList.remove("hidden");

    // Start the game logic
    animate();
}

function endGame() {

    // Show the game over menu
    gameOverMenu.classList.remove("hidden");

    // Display final score
    endScoreElement.textContent = `Final Score: ${score}`;
    endHighScoreElement.textContent = `Session-Highscore: ${highScore}`;

    // Hide the game container
    document.getElementById("gameContainer").classList.add("hidden");
}

function resetGame() {
    // Reset player's position
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.SpeedX = 0;
    player.SpeedY = 0;

    // Reset player's health and score
    player.health = 100;
    score = 0;
    thirdFire.lastFiredTime = 0;
    secondFire.lastFiredTime = 0;

    // Clear enemies and projectiles
    enemies.splice(0, enemies.length);
    projectiles.splice(0, projectiles.length);

    // Reset level and enemy shooting speed
    level = 0;
    increaseEnemyShootingSpeed();

    // Hide the game over menu
    gameOverMenu.classList.add("hidden");

    // Show the game container
    document.getElementById("gameContainer").classList.remove("hidden");
}

function showHelpMenu() {
    // Show the help menu
    helpMenu.classList.remove("hidden");

    // Add event listener to the back button
    const helpBackButton = helpMenu.querySelector("#h-back-button");
    helpBackButton.addEventListener("click", showPreviousMenuHelp);
}

function showPreviousMenuHelp() {
    // Hide the help menu
    helpMenu.classList.add("hidden");
}

function showInfoMenu() {
    // Show the help menu
    infoMenu.classList.remove("hidden");

    // Add event listener to the back button
    const infoBackButton = infoMenu.querySelector("#i-back-button");
    infoBackButton.addEventListener("click", showPreviousMenuInfo);
}

function showPreviousMenuInfo() {
    // Hide the help menu
    infoMenu.classList.add("hidden");
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayerPosition();
    player.update();
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        
        // Check for collision with player
        const distanceToPlayer = Math.hypot(enemy.x - player.x, enemy.y - player.y);
        if (distanceToPlayer - player.radius - enemy.radius < 1) {
            // Player collided with enemy
            
            // Decrease player's health
            player.health -= 1;
            
            if (enemy.health > 1) {
                // Reduce enemy HP if it has health left
                enemy.health--;
            } else {
                // Remove enemy and projectile if enemy has no health left
                enemies.splice(enemyIndex, 1);
                score++;
            }
            
            // Check if player's health is zero or below
            if (player.health <= 0) {
                if (score > highScore) {
                    highScore = score;
                }
                // Perform game over actions
                endGame();
            }
        }
    });
    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update();

        // Remove projectiles that are off-screen
        if (
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            projectiles.splice(projectileIndex, 1);
        }

        const projectileToPlayerDistance = Math.hypot(projectile.x - player.x, projectile.y - player.y);
        if ((projectileToPlayerDistance - player.radius - projectile.radius < 1) && projectile.shooter === "enemy") {
            // Decrease player's health
            player.health -= 1; 
            
            // Remove the projectile
            projectiles.splice(projectileIndex, 1);
            
            // Check if player's health is zero or below
            if (player.health <= 0) {
                if (score > highScore) {
                    highScore = score;
                }
                // Perform game over actions or any other logic
                console.log("Game Over");
                endGame();
            }
        }

        enemies.forEach((enemy, enemyIndex) => {
            const projectileToEnemyDistance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            // Remove enemy and projectile on collision
            if ((projectileToEnemyDistance - enemy.radius - projectile.radius < 1) && projectile.shooter === "player") {
                if (enemy.health > 1) {
                    // Reduce enemy HP if it has health left
                    enemy.health--;
                    projectiles.splice(projectileIndex, 1);
                } else {
                    // Remove enemy and projectile if enemy has no health left
                    setTimeout(() => {
                    enemies.splice(enemyIndex, 1);
                    projectiles.splice(projectileIndex, 1);
                    score++;
                    }, 0);
                }
            }
        });
    });
    if (enemies.length === 0) {
        spawnEnemies();
        level++;
        increaseEnemyShootingSpeed();
    }
    if (keys[" "]) {
        const currentTime = Date.now();
        // Check if enough time has passed since the last third fire
        if (currentTime - thirdFire.lastFiredTime > thirdFire.cooldown) {
            for (let i = 0; i < thirdFire.consecutiveShots; i++) {
                setTimeout(() => {
                    for (let j = 0; j < thirdFire.numShots; j++) {
                        const angle = player.angle + j * thirdFire.spreadAngle  + (i * 0.2);
                        const velocity = {
                            x: Math.cos(angle) * (player.shootSpeed / 2),
                            y: Math.sin(angle) * (player.shootSpeed / 2),
                        };
                        projectiles.push(new Projectile(player.x, player.y, 5, "red", velocity, "player"));
                    }
                }, i * 200); // Delay each consecutive shot by 200 milliseconds
            }

            // Update the last fired time
            thirdFire.lastFiredTime = currentTime;
        }
    }
    if (keys["f"]) {        
        const currentTime = Date.now();
        // Check if enough time has passed since the last second fire
        if (currentTime - secondFire.lastFiredTime > secondFire.cooldown) {
            for (let i = 0; i < secondFire.consecutiveShots; i++) {
                setTimeout(() => {
                    for (let j = 0; j < secondFire.numShots; j++) {
                        const angle = player.angle;
                        const velocity = {
                            x: Math.cos(angle) * player.shootSpeed,
                            y: Math.sin(angle) * player.shootSpeed,
                        };
                        projectiles.push(new Projectile(player.x, player.y, 5, "red", velocity, "player"));
                    }
                }, i * 25); // Delay each consecutive shot by 25 milliseconds
            }

            // Update the last fired time
            secondFire.lastFiredTime = currentTime;
        }
    }

    hpElement.textContent = `HP: ${player.health}`;
    scoreElement.textContent = `Score: ${score}`;
    highScoreElement.textContent = `Session-HighScore: ${highScore}`;
}

document.getElementById("start-button").addEventListener("click", startGame);

window.addEventListener("click", (event) => {
    const angle = Math.atan2(mouse_y - player.y, mouse_x - player.x);
    console.log(angle, event);
    const velocity = {
        x: Math.cos(angle) * player.shootSpeed,
        y: Math.sin(angle) * player.shootSpeed,
    };
    projectiles.push(new Projectile(player.x, player.y, 5, "red", velocity, "player"));
});

window.addEventListener("mousemove", (event) => {
    mouse_x = event.clientX - canvas.offsetLeft;
    mouse_y = event.clientY - canvas.offsetTop;
});

window.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

restartButton.addEventListener("click", () => {
    resetGame();
});

level1Button.addEventListener("click", () => {
    level = 0;
});

level2Button.addEventListener("click", () => {
    level = 1;
});

level3Button.addEventListener("click", () => {
    level = 2;
});

startHelpButton.addEventListener("click", showHelpMenu);
endHelpButton.addEventListener("click", showHelpMenu);
startInfoButton.addEventListener("click", showInfoMenu);
endInfoButton.addEventListener("click", showInfoMenu);