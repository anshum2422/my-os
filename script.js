function updateClock() {
    const now = new Date();
    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString();
    }
}
setInterval(updateClock, 1000);
updateClock();
function updateWeather() {
    const temp = Math.floor(Math.random() * 15) + 15;
    const icons = ['☀️', '⛅', '🌤️', '🌙'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    const weatherElement = document.getElementById('weather');
    if (weatherElement) {
        weatherElement.textContent = icon + ' ' + temp + '°C';
    }
}
updateWeather();
function search() {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        const query = searchInput.value.trim();
        if (query) {
            window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
        }
    }
}
let gameRunning = false;
let animationId = null;

function openPingPong() {
    console.log('openPingPong called!');
    const game = document.getElementById('game');
    if (game) {
        game.style.display = 'block';
        if (!gameRunning) {
            gameRunning = true;
            initPong();
        }
    }
}

function closeGame() {
    console.log('closeGame called!');
    const game = document.getElementById('game');
    if (game) {
        game.style.display = 'none';
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
}

function initPong() {
    console.log('initPong called!');
    const canvas = document.getElementById('pong');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }
    const ctx = canvas.getContext('2d');

    const paddleWidth = 12;
    const paddleHeight = 80;
    const ballSize = 10;

    let leftY = 150;
    let rightY = 150;
    let ballX = 300;
    let ballY = 200;
    let ballSpeedX = 4;
    let ballSpeedY = 3;
    let leftScore = 0;
    let rightScore = 0;

    let upPressed = false;
    let downPressed = false;
    let wPressed = false;
    let sPressed = false;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') upPressed = true;
        if (e.key === 'ArrowDown') downPressed = true;
        if (e.key === 'w' || e.key === 'W') wPressed = true;
        if (e.key === 's' || e.key === 'S') sPressed = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp') upPressed = false;
        if (e.key === 'ArrowDown') downPressed = false;
        if (e.key === 'w' || e.key === 'W') wPressed = false;
        if (e.key === 's' || e.key === 'S') sPressed = false;
    });

    function draw() {
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#2a2a3a';
        ctx.setLineDash([10, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#d4d4d4';
        ctx.fillRect(10, leftY, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - 10 - paddleWidth, rightY, paddleWidth, paddleHeight);

        ctx.fillStyle = '#d4d4d4';
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '24px Arial';
        ctx.fillStyle = '#4a4a6a';
        ctx.fillText(leftScore, canvas.width/2 - 40, 40);
        ctx.fillText(rightScore, canvas.width/2 + 30, 40);

        if (wPressed && leftY > 0) leftY -= 5;
        if (sPressed && leftY < canvas.height - paddleHeight) leftY += 5;
        if (upPressed && rightY > 0) rightY -= 5;
        if (downPressed && rightY < canvas.height - paddleHeight) rightY += 5;

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }

        if (ballX - ballSize < 10 + paddleWidth && 
            ballX + ballSize > 10 &&
            ballY > leftY && 
            ballY < leftY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballX = 10 + paddleWidth + ballSize;
        }

        if (ballX + ballSize > canvas.width - 10 - paddleWidth &&
            ballX - ballSize < canvas.width - 10 &&
            ballY > rightY &&
            ballY < rightY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballX = canvas.width - 10 - paddleWidth - ballSize;
        }

        if (ballX < 0) {
            rightScore++;
            resetBall();
        }
        if (ballX > canvas.width) {
            leftScore++;
            resetBall();
        }

        function resetBall() {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
            ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
        }

        animationId = requestAnimationFrame(draw);
    }

    draw();
}
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                search();
            }
        });
    }
});