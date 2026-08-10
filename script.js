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

document.getElementById('search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') search();
});


function openApp(type) {
    const content = document.getElementById('app-content');

    if (type === 'notes') {
        content.innerHTML = `
            <h3 style="color:#fff; margin-bottom:12px;">📝 Notes</h3>
            <textarea id="notes-text" placeholder="Write something..." style="width:100%; height:120px; background:#0a0a0a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:10px; padding:12px; font-family:Space Mono; resize:none;"></textarea>
            <button onclick="saveNote()" style="margin-top:10px; padding:10px 20px; background:#2a2a3a; color:#d4d4d4; border:1px solid #3a3a4a; border-radius:8px; cursor:pointer;">💾 Save</button>
            <div id="saved-notes" style="margin-top:10px; color:#888;"></div>
        `;
        loadNotes();
    } else if (type === 'calc') {
        content.innerHTML = `
            <h3 style="color:#fff; margin-bottom:12px;">🧮 Calculator</h3>
            <input id="calc-input" type="text" placeholder="0" style="width:100%; padding:12px; background:#0a0a0a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:10px; font-size:1.5rem; text-align:right; font-family:Space Mono; margin-bottom:12px;">
            <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px;">
                <button onclick="calcPress('7')" style="padding:12px; background:#1a1a2a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; cursor:pointer;">7</button>
                <button onclick="calcPress('8')" style="padding:12px; background:#1a1a2a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; cursor:pointer;">8</button>
                <button onclick="calcPress('9')" style="padding:12px; background:#1a1a2a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; cursor:pointer;">9</button>
                <button onclick="calcPress('+')" style="padding:12px; background:#2a2a3a; color:#d4d4d4; border:1px solid #3a3a4a; border-radius:8px; cursor:pointer;">+</button>
                <button onclick="calcPress('4')" style="padding:12px; background:#1a1a2a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; cursor:pointer;">4</button>
                <button onclick="calcPress('5')" style="padding:12px; background:#1a1a2a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; cursor:pointer;">5</button>
                <button onclick="calcPress('6')" style="padding:12px; background:#1a1a2a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; cursor:pointer;">6</button>
                <button onclick="calcPress('-')" style="padding:12px; background:#2a2a3a; color:#d4d4d4; border:1px solid #3a3a4a; border-radius:8px; cursor:pointer;">-</button>
                <button onclick="calcPress('1')" style="padding:12px; background:#1a1a2a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; cursor:pointer;">1</button>
                <button onclick="calcPress('2')" style="padding:12px; background:#1a1a2a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; cursor:pointer;">2</button>
                <button onclick="calcPress('3')" style="padding:12px; background:#1a1a2a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; cursor:pointer;">3</button>
                <button onclick="calcPress('*')" style="padding:12px; background:#2a2a3a; color:#d4d4d4; border:1px solid #3a3a4a; border-radius:8px; cursor:pointer;">×</button>
                <button onclick="calcClear()" style="padding:12px; background:#3a1a1a; color:#d4d4d4; border:1px solid #4a2a2a; border-radius:8px; cursor:pointer;">C</button>
                <button onclick="calcPress('0')" style="padding:12px; background:#1a1a2a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; cursor:pointer;">0</button>
                <button onclick="calcResult()" style="padding:12px; background:#2a3a2a; color:#d4d4d4; border:1px solid #3a4a3a; border-radius:8px; cursor:pointer;">=</button>
                <button onclick="calcPress('/')" style="padding:12px; background:#2a2a3a; color:#d4d4d4; border:1px solid #3a3a4a; border-radius:8px; cursor:pointer;">÷</button>
            </div>
        `;
    } else if (type === 'timer') {
        content.innerHTML = `
            <h3 style="color:#fff; margin-bottom:12px;">⏱️ Timer</h3>
            <div id="timer-display" style="font-size:3rem; font-family:Space Mono; color:#ffffff; text-align:center; margin-bottom:20px;">00:00</div>
            <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                <input id="timer-minutes" type="number" placeholder="Min" style="width:80px; padding:10px; background:#0a0a0a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; text-align:center; font-family:Space Mono;">
                <input id="timer-seconds" type="number" placeholder="Sec" style="width:80px; padding:10px; background:#0a0a0a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; text-align:center; font-family:Space Mono;">
                <button onclick="startTimer()" style="padding:10px 20px; background:#2a3a2a; color:#d4d4d4; border:1px solid #3a4a3a; border-radius:8px; cursor:pointer;">▶ Start</button>
                <button onclick="stopTimer()" style="padding:10px 20px; background:#3a2a2a; color:#d4d4d4; border:1px solid #4a3a3a; border-radius:8px; cursor:pointer;">⏹ Stop</button>
                <button onclick="resetTimer()" style="padding:10px 20px; background:#2a2a3a; color:#d4d4d4; border:1px solid #3a3a4a; border-radius:8px; cursor:pointer;">⟳ Reset</button>
            </div>
        `;
    } else if (type === 'todo') {
        content.innerHTML = `
            <h3 style="color:#fff; margin-bottom:12px;">✅ Todo</h3>
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <input id="todo-input" type="text" placeholder="Add a task..." style="flex:1; padding:10px; background:#0a0a0a; color:#d4d4d4; border:1px solid #2a2a3a; border-radius:8px; font-family:Space Mono;">
                <button onclick="addTodo()" style="padding:10px 20px; background:#2a3a2a; color:#d4d4d4; border:1px solid #3a4a3a; border-radius:8px; cursor:pointer;">Add</button>
            </div>
            <div id="todo-list" style="color:#888;"></div>
        `;
        loadTodos();
    } else if (type === 'pong') {
        content.innerHTML = `
            <h3 style="color:#fff; margin-bottom:12px;">🏓 Ping Pong</h3>
            <p style="color:#888; font-size:0.9rem; margin-bottom:12px;">Player 1: W/S &nbsp;|&nbsp; Player 2: Arrow Keys</p>
            <canvas id="pong" width="600" height="350"></canvas>
        `;
        setTimeout(initPong, 100);
    } else if (type === 'about') {
        content.innerHTML = `
            <h3 style="color:#fff; margin-bottom:12px;">ℹ️ About</h3>
            <p style="color:#aaaaaa; line-height:1.8; font-size:0.95rem;">
                <strong style="color:#ffffff;">My OS</strong><br>
                Built by @anshum_2422<br><br>
                Features:<br>
                • Live clock<br>
                • Simulated weather<br>
                • Google search<br>
                • Notes with save<br>
                • Calculator<br>
                • Timer<br>
                • Todo list<br>
                • Ping Pong<br><br>
                Made with ☕ and 🚀
            </p>
        `;
    }
}

function saveNote() {
    const note = document.getElementById('notes-text');
    if (note && note.value.trim()) {
        const notes = JSON.parse(localStorage.getItem('os-notes') || '[]');
        notes.push(note.value.trim());
        localStorage.setItem('os-notes', JSON.stringify(notes));
        note.value = '';
        loadNotes();
    }
}

function loadNotes() {
    const container = document.getElementById('saved-notes');
    if (container) {
        const notes = JSON.parse(localStorage.getItem('os-notes') || '[]');
        if (notes.length === 0) {
            container.innerHTML = '<span style="color:#444;">No notes saved yet.</span>';
        } else {
            container.innerHTML = notes.map((n, i) =>
                '<div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #1a1a2a;">' +
                '<span style="color:#aaa;">' + n + '</span>' +
                '<button onclick="deleteNote(' + i + ')" style="background:none; border:none; color:#664444; cursor:pointer;">✕</button>' +
                '</div>'
            ).join('');
        }
    }
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('os-notes') || '[]');
    notes.splice(index, 1);
    localStorage.setItem('os-notes', JSON.stringify(notes));
    loadNotes();
}


function calcPress(value) {
    const input = document.getElementById('calc-input');
    if (input) input.value += value;
}

function calcClear() {
    const input = document.getElementById('calc-input');
    if (input) input.value = '';
}

function calcResult() {
    const input = document.getElementById('calc-input');
    if (input) {
        try {
            input.value = eval(input.value);
        } catch (e) {
            input.value = 'Error';
        }
    }
}


let timerInterval = null;
let timerSeconds = 0;

function startTimer() {
    const mins = parseInt(document.getElementById('timer-minutes').value) || 0;
    const secs = parseInt(document.getElementById('timer-seconds').value) || 0;
    timerSeconds = mins * 60 + secs;
    updateTimerDisplay();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert('⏰ Time is up!');
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    timerSeconds = 0;
    updateTimerDisplay();
    const mins = document.getElementById('timer-minutes');
    const secs = document.getElementById('timer-seconds');
    if (mins) mins.value = '';
    if (secs) secs.value = '';
}

function updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    if (display) {
        const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
        const s = String(timerSeconds % 60).padStart(2, '0');
        display.textContent = m + ':' + s;
    }
}


function addTodo() {
    const input = document.getElementById('todo-input');
    if (input && input.value.trim()) {
        const todos = JSON.parse(localStorage.getItem('os-todos') || '[]');
        todos.push(input.value.trim());
        localStorage.setItem('os-todos', JSON.stringify(todos));
        input.value = '';
        loadTodos();
    }
}

function loadTodos() {
    const container = document.getElementById('todo-list');
    if (container) {
        const todos = JSON.parse(localStorage.getItem('os-todos') || '[]');
        if (todos.length === 0) {
            container.innerHTML = '<span style="color:#444;">No tasks yet. Add one above!</span>';
        } else {
            container.innerHTML = todos.map((t, i) =>
                '<div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #1a1a2a;">' +
                '<span style="color:#aaa;">' + t + '</span>' +
                '<button onclick="deleteTodo(' + i + ')" style="background:none; border:none; color:#664444; cursor:pointer;">✕</button>' +
                '</div>'
            ).join('');
        }
    }
}

function deleteTodo(index) {
    const todos = JSON.parse(localStorage.getItem('os-todos') || '[]');
    todos.splice(index, 1);
    localStorage.setItem('os-todos', JSON.stringify(todos));
    loadTodos();
}

let pongAnimationId = null;

function initPong() {
    const canvas = document.getElementById('pong');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Make canvas responsive
    const container = canvas.parentElement;
    if (container) {
        const maxWidth = container.clientWidth - 10;
        if (maxWidth < 600) {
            canvas.style.width = maxWidth + 'px';
            canvas.style.height = (maxWidth * 350 / 600) + 'px';
        }
    }

    const paddleWidth = 12;
    const paddleHeight = 80;
    const ballSize = 10;

    let leftY = 135;
    let rightY = 135;
    let ballX = 300;
    let ballY = 175;
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

        ctx.font = '20px Arial';
        ctx.fillStyle = '#4a4a6a';
        ctx.fillText(leftScore, canvas.width/2 - 40, 35);
        ctx.fillText(rightScore, canvas.width/2 + 30, 35);

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

        pongAnimationId = requestAnimationFrame(draw);
    }

    if (pongAnimationId) cancelAnimationFrame(pongAnimationId);
    draw();
}