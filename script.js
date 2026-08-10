

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



let windowId = 0;
const windows = {};

function openWindow(type) {
    const container = document.getElementById('window-container');
    const id = 'win-' + (++windowId);
    const win = document.createElement('div');
    win.className = 'window';
    win.id = id;

    const x = 50 + Math.random() * 200;
    const y = 50 + Math.random() * 150;
    win.style.left = x + 'px';
    win.style.top = y + 'px';

    let title = '';
    let bodyHTML = '';

    if (type === 'notes') {
        title = '📝 Notes';
        bodyHTML = `
            <textarea id="notes-text-${id}" placeholder="Write something..." rows="4"></textarea>
            <button onclick="saveNote('${id}')">💾 Save</button>
            <div id="saved-notes-${id}" style="margin-top:10px;"></div>
        `;
    } else if (type === 'calc') {
        title = '🧮 Calculator';
        bodyHTML = `
            <input id="calc-input-${id}" type="text" placeholder="0" style="text-align:right; font-size:1.2rem;">
            <div class="calc-grid">
                <button onclick="calcPress('${id}','7')">7</button>
                <button onclick="calcPress('${id}','8')">8</button>
                <button onclick="calcPress('${id}','9')">9</button>
                <button onclick="calcPress('${id}','+')">+</button>
                <button onclick="calcPress('${id}','4')">4</button>
                <button onclick="calcPress('${id}','5')">5</button>
                <button onclick="calcPress('${id}','6')">6</button>
                <button onclick="calcPress('${id}','-')">-</button>
                <button onclick="calcPress('${id}','1')">1</button>
                <button onclick="calcPress('${id}','2')">2</button>
                <button onclick="calcPress('${id}','3')">3</button>
                <button onclick="calcPress('${id}','*')">×</button>
                <button onclick="calcClear('${id}')">C</button>
                <button onclick="calcPress('${id}','0')">0</button>
                <button onclick="calcResult('${id}')">=</button>
                <button onclick="calcPress('${id}','/')">÷</button>
            </div>
        `;
    } else if (type === 'timer') {
        title = '⏱️ Timer';
        bodyHTML = `
            <div class="timer-display" id="timer-display-${id}">00:00</div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <input id="timer-min-${id}" type="number" placeholder="Min" style="width:70px;">
                <input id="timer-sec-${id}" type="number" placeholder="Sec" style="width:70px;">
                <button onclick="startTimer('${id}')">▶ Start</button>
                <button onclick="stopTimer('${id}')">⏹ Stop</button>
                <button onclick="resetTimer('${id}')">⟳ Reset</button>
            </div>
        `;
    } else if (type === 'todo') {
        title = '✅ Todo';
        bodyHTML = `
            <div style="display:flex; gap:8px;">
                <input id="todo-input-${id}" placeholder="Add a task...">
                <button onclick="addTodo('${id}')">Add</button>
            </div>
            <div id="todo-list-${id}" style="margin-top:12px;"></div>
        `;
    } else if (type === 'pong') {
        title = '🏓 Ping Pong';
        bodyHTML = `
            <p style="color:#888; font-size:0.8rem; margin-bottom:10px;">Player 1: W/S &nbsp;|&nbsp; Player 2: Arrow Keys</p>
            <canvas id="pong-${id}" width="560" height="320"></canvas>
        `;
    } else if (type === 'about') {
        title = 'ℹ️ About';
        bodyHTML = `
            <p style="color:#aaaaaa; line-height:1.8;">
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

    win.innerHTML = `
        <div class="window-header" data-window="${id}">
            <span class="window-title">${title}</span>
            <button class="window-close" onclick="closeWindow('${id}')">✕</button>
        </div>
        <div class="window-body">${bodyHTML}</div>
    `;

    container.appendChild(win);
    win.style.display = 'block';

    windows[id] = { type, element: win };

    if (type === 'notes') loadNotes(id);
    if (type === 'todo') loadTodos(id);
    if (type === 'pong') setTimeout(() => initPong(id), 100);

    win.addEventListener('mousedown', () => bringToFront(id));
}

function closeWindow(id) {
    const win = windows[id];
    if (win) {
        win.element.remove();
        delete windows[id];
    }
}

function bringToFront(id) {
    const win = windows[id];
    if (win) {
        win.element.style.zIndex = 1000 + Object.keys(windows).length;
    }
}


let dragData = null;

document.addEventListener('mousedown', function(e) {
    const header = e.target.closest('.window-header');
    if (header) {
        const win = header.closest('.window');
        if (win) {
            const rect = win.getBoundingClientRect();
            dragData = {
                element: win,
                offsetX: e.clientX - rect.left,
                offsetY: e.clientY - rect.top
            };
            win.style.cursor = 'grabbing';
            bringToFront(win.id);
        }
    }
});

document.addEventListener('mousemove', function(e) {
    if (dragData) {
        const x = e.clientX - dragData.offsetX;
        const y = e.clientY - dragData.offsetY;
        dragData.element.style.left = x + 'px';
        dragData.element.style.top = y + 'px';
        dragData.element.style.transform = 'none';
    }
});

document.addEventListener('mouseup', function() {
    if (dragData) {
        dragData.element.style.cursor = 'default';
        dragData = null;
    }
});



function saveNote(id) {
    const note = document.getElementById('notes-text-' + id);
    if (note && note.value.trim()) {
        const notes = JSON.parse(localStorage.getItem('os-notes') || '[]');
        notes.push(note.value.trim());
        localStorage.setItem('os-notes', JSON.stringify(notes));
        note.value = '';
        loadNotes(id);
    }
}

function loadNotes(id) {
    const container = document.getElementById('saved-notes-' + id);
    if (container) {
        const notes = JSON.parse(localStorage.getItem('os-notes') || '[]');
        if (notes.length === 0) {
            container.innerHTML = '<span style="color:#444;">No notes saved yet.</span>';
        } else {
            container.innerHTML = notes.map((n, i) =>
                '<div class="note-item">' +
                '<span>' + n + '</span>' +
                '<button onclick="deleteNote(' + i + ')">✕</button>' +
                '</div>'
            ).join('');
        }
    }
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('os-notes') || '[]');
    notes.splice(index, 1);
    localStorage.setItem('os-notes', JSON.stringify(notes));
    Object.keys(windows).forEach(id => {
        if (windows[id].type === 'notes') loadNotes(id);
    });
}

// ============================================
// CALCULATOR
// ============================================

function calcPress(id, value) {
    const input = document.getElementById('calc-input-' + id);
    if (input) input.value += value;
}

function calcClear(id) {
    const input = document.getElementById('calc-input-' + id);
    if (input) input.value = '';
}

function calcResult(id) {
    const input = document.getElementById('calc-input-' + id);
    if (input) {
        try {
            input.value = eval(input.value);
        } catch (e) {
            input.value = 'Error';
        }
    }
}


let timerIntervals = {};

function startTimer(id) {
    const mins = parseInt(document.getElementById('timer-min-' + id).value) || 0;
    const secs = parseInt(document.getElementById('timer-sec-' + id).value) || 0;
    let total = mins * 60 + secs;

    if (timerIntervals[id]) clearInterval(timerIntervals[id]);

    timerIntervals[id] = setInterval(() => {
        if (total > 0) {
            total--;
            const m = String(Math.floor(total / 60)).padStart(2, '0');
            const s = String(total % 60).padStart(2, '0');
            const display = document.getElementById('timer-display-' + id);
            if (display) display.textContent = m + ':' + s;
        } else {
            clearInterval(timerIntervals[id]);
            alert('⏰ Time is up!');
        }
    }, 1000);
}

function stopTimer(id) {
    if (timerIntervals[id]) {
        clearInterval(timerIntervals[id]);
        timerIntervals[id] = null;
    }
}

function resetTimer(id) {
    stopTimer(id);
    const display = document.getElementById('timer-display-' + id);
    if (display) display.textContent = '00:00';
    const mins = document.getElementById('timer-min-' + id);
    const secs = document.getElementById('timer-sec-' + id);
    if (mins) mins.value = '';
    if (secs) secs.value = '';
}



function addTodo(id) {
    const input = document.getElementById('todo-input-' + id);
    if (input && input.value.trim()) {
        const todos = JSON.parse(localStorage.getItem('os-todos') || '[]');
        todos.push(input.value.trim());
        localStorage.setItem('os-todos', JSON.stringify(todos));
        input.value = '';
        loadTodos(id);
    }
}

function loadTodos(id) {
    const container = document.getElementById('todo-list-' + id);
    if (container) {
        const todos = JSON.parse(localStorage.getItem('os-todos') || '[]');
        if (todos.length === 0) {
            container.innerHTML = '<span style="color:#444;">No tasks yet.</span>';
        } else {
            container.innerHTML = todos.map((t, i) =>
                '<div class="todo-item">' +
                '<span>' + t + '</span>' +
                '<button onclick="deleteTodo(' + i + ')">✕</button>' +
                '</div>'
            ).join('');
        }
    }
}

function deleteTodo(index) {
    const todos = JSON.parse(localStorage.getItem('os-todos') || '[]');
    todos.splice(index, 1);
    localStorage.setItem('os-todos', JSON.stringify(todos));
    Object.keys(windows).forEach(id => {
        if (windows[id].type === 'todo') loadTodos(id);
    });
}



let pongAnimations = {};

function initPong(id) {
    const canvas = document.getElementById('pong-' + id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const container = canvas.parentElement;
    if (container) {
        const maxWidth = container.clientWidth - 10;
        if (maxWidth < 560) {
            canvas.style.width = maxWidth + 'px';
            canvas.style.height = (maxWidth * 320 / 560) + 'px';
        }
    }

    const paddleWidth = 10;
    const paddleHeight = 70;
    const ballSize = 8;

    let leftY = 125;
    let rightY = 125;
    let ballX = 280;
    let ballY = 160;
    let ballSpeedX = 4;
    let ballSpeedY = 3;
    let leftScore = 0;
    let rightScore = 0;

    let upPressed = false;
    let downPressed = false;
    let wPressed = false;
    let sPressed = false;

    const keyHandler = (e, val) => {
        if (e.key === 'ArrowUp') upPressed = val;
        if (e.key === 'ArrowDown') downPressed = val;
        if (e.key === 'w' || e.key === 'W') wPressed = val;
        if (e.key === 's' || e.key === 'S') sPressed = val;
    };

    document.addEventListener('keydown', (e) => keyHandler(e, true));
    document.addEventListener('keyup', (e) => keyHandler(e, false));

    function draw() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#222222';
        ctx.setLineDash([8, 12]);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(8, leftY, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - 8 - paddleWidth, rightY, paddleWidth, paddleHeight);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '18px Space Mono';
        ctx.fillStyle = '#444444';
        ctx.fillText(leftScore, canvas.width/2 - 35, 30);
        ctx.fillText(rightScore, canvas.width/2 + 25, 30);

        if (wPressed && leftY > 0) leftY -= 5;
        if (sPressed && leftY < canvas.height - paddleHeight) leftY += 5;
        if (upPressed && rightY > 0) rightY -= 5;
        if (downPressed && rightY < canvas.height - paddleHeight) rightY += 5;

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }

        if (ballX - ballSize < 8 + paddleWidth &&
            ballX + ballSize > 8 &&
            ballY > leftY &&
            ballY < leftY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballX = 8 + paddleWidth + ballSize;
        }

        if (ballX + ballSize > canvas.width - 8 - paddleWidth &&
            ballX - ballSize < canvas.width - 8 &&
            ballY > rightY &&
            ballY < rightY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballX = canvas.width - 8 - paddleWidth - ballSize;
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

        pongAnimations[id] = requestAnimationFrame(draw);

        function showquote() {
            const quotes = [
                "The best way to predict the future is to invent it. - Alan Kay",
                "Life is 10% what happens to us and 90% how we react to it. - Charles R. Swindoll",
                "Code is like humor. When you have to explain it, it’s bad. - Cory House",
                "Simplicity is the soul of efficiency. - Austin Freeman",
                "In order to be irreplaceable, one must always be different. - Coco Chanel",
                "The only way to do great work is to love what you do. - Steve Jobs",
                "The best revenge is massive success. - Frank Sinatra",
                "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
                "The best way to get started is to quit talking and begin doing. - Walt Disney",
            ]
            const q =quotes[Math.floor(Math.random()*quotes.length)];
            const el = document.getElementbyID('quote');
            if (el) el.textContent ='💬 ' + q;

        } 
        showquote();
        
    }

    if (pongAnimations[id]) cancelAnimationFrame(pongAnimations[id]);
    draw();
}
