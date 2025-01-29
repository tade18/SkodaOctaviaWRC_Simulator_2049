const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const actualScore = document.getElementById("actualScore");
const actualSpeed = document.getElementById("actualSpeed");

// Načítání obrázku auta
const carImage = new Image();
carImage.src = 'skoda_octaviawrc.png';

const obstacleImage = new Image();
    obstacleImage.src = 'tree.png';


const car = {
  width: 120,
  height: 50,
  x: 50,
  y: canvas.height / 2 - 50,
  lane: 1 // Výchozí řada
};

const lanes = [50, 150, 250];
let obstacles = [];
let speed = 5; // Rychlost pohybu překážek
let gameOver = false;
let score = 0;

// Vykreslení auta pomocí obrázku
function drawCar() {
  ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
}

// Vytváření překážek
function createObstacle() {
  const lane = Math.floor(Math.random() * 3);
  const obstacle = {
    width: 50,
    height: 50,
    x: canvas.width,
    y: lanes[lane],
    lane: lane
  };
  obstacles.push(obstacle);
}

// Vykreslení překážek
function drawObstacles() {
  ctx.fillStyle = 'red';
  obstacles.forEach(obstacle => {
    ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Aktualizace překážek
function updateObstacles() {
  obstacles.forEach(obstacle => {
    obstacle.x -= speed;

    // Kontrola kolize s autem
    if (
      obstacle.lane === car.lane && 
      obstacle.x < car.x + car.width && 
      obstacle.x + obstacle.width > car.x && 
      obstacle.y < car.y + car.height &&
      obstacle.y + obstacle.height > car.y
    ) {
      gameOver = true;
    }
  });

  // reset překážek
  obstacles = obstacles.filter(obstacle => obstacle.x > -50);
}

//GAMELOOP-----------------------------------------------------------
function gameLoop() {
  if (gameOver) {
    ctx.font = "30px Arial";
    ctx.fillText("Konec hry!", canvas.width / 3, canvas.height / 2);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
    score += 1;
    speed +=0.1;
    actualScore.innerText = "Score: "+score;
    actualSpeed.innerText = "Speed: "+speed+" Km/h";
  drawCar();
  drawObstacles();
  updateObstacles();
  requestAnimationFrame(gameLoop);
}

// Posouvání auta mezi řadami
document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp' && car.lane > 0) {
    car.lane--;
    car.y = lanes[car.lane];
  }
  if (event.key === 'ArrowDown' && car.lane < 2) {
    car.lane++;
    car.y = lanes[car.lane];
  }
});

//INTERVALY GENEROVÁNÍ PŘEKÁŽEK
setInterval(createObstacle, 1000);

//GAME START
carImage.onload = function() {
  gameLoop();
};
