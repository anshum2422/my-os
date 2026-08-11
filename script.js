function updateClock() {
    const now = new Date();
    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString();
    }
}
setInterval(updateClock, 1000);
updateClock();

function getRealWeather() {
    const apiKey = 'b87623ea974f7d9dbdbc4bff0d249480';
    const city = 'Dehradun';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temp = Math.round(data.main.temp);
            const description = data.weather[0].description;
            document.getElementById('weather').textContent = `${temp}°C ${description}`;
        })
        .catch(() => {
            document.getElementById('weather').textContent = 'Weather unavailable';
        });
}
getRealWeather();

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
    } else if (type === 'music') {
        title = '🎵 Music Player';
        bodyHTML = `
            <div style="text-align:center; padding:10px;">
                <input id="music-url" type="text" placeholder="Paste audio URL..." style="width:100%; padding:8px; margin-bottom:10px; background:#0a0a0a; color:#fff; border:1px solid #333; border-radius:4px;">
                <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
                    <button onclick="playMusic()" style="padding:8px 16px; background:#222; color:#fff; border:1px solid #333; border-radius:4px; cursor:pointer;">▶ Play</button>
                    <button onclick="pauseMusic()" style="padding:8px 16px; background:#222; color:#fff; border:1px solid #333; border-radius:4px; cursor:pointer;">⏸ Pause</button>
                    <button onclick="stopMusic()" style="padding:8px 16px; background:#222; color:#fff; border:1px solid #333; border-radius:4px; cursor:pointer;">⏹ Stop</button>
                </div>
                <div id="music-status" style="margin-top:10px; color:#888;">Enter a URL and press Play</div>
            </div>
        `;
    } else if (type === 'settings') {
        title = '⚙️ Settings';
        bodyHTML = `
            <div style="padding:10px;">
                <div style="margin-bottom:15px;">
                    <label style="color:#888;">Theme</label><br>
                    <button onclick="setTheme('dark')" style="padding:6px 12px; margin:4px; background:#222; color:#fff; border:1px solid #333; border-radius:4px; cursor:pointer;">Dark</button>
                    <button onclick="setTheme('light')" style="padding:6px 12px; margin:4px; background:#eee; color:#000; border:1px solid #333; border-radius:4px; cursor:pointer;">Light</button>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="color:#888;">Font Size</label><br>
                    <button onclick="setFontSize('small')" style="padding:6px 12px; margin:4px; background:#222; color:#fff; border:1px solid #333; border-radius:4px; cursor:pointer;">Small</button>
                    <button onclick="setFontSize('medium')" style="padding:6px 12px; margin:4px; background:#222; color:#fff; border:1px solid #333; border-radius:4px; cursor:pointer;">Medium</button>
                    <button onclick="setFontSize('large')" style="padding:6px 12px; margin:4px; background:#222; color:#fff; border:1px solid #333; border-radius:4px; cursor:pointer;">Large</button>
                </div>
                <div style="margin-top:15px; border-top:1px solid #222; padding-top:15px;">
                    <p style="color:#444; font-size:0.8rem;">Settings saved locally</p>
                </div>
            </div>
        `;
    } else if (type === 'about') {
        title = 'ℹ️ About';
        bodyHTML = `
            <p style="color:#aaaaaa; line-height:1.8;">
                <strong style="color:#ffffff;">My OS</strong><br>
                Built by @anshum_2422<br><br>
                Features:<br>
                • Live clock<br>
                • Real weather API<br>
                • Google search<br>
                • Notes with save<br>
                • Calculator<br>
                • Timer<br>
                • Todo list<br>
                • Ping Pong<br>
                • Music Player<br>
                • Settings (theme + font)<br><br>
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
        <div class="resize-handle"></div>
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

let resizeData = null;

document.addEventListener('mousedown', function(e) {
    const handle = e.target.closest('.resize-handle');
    if (handle) {
        const win = handle.closest('.window');
        if (win) {
            resizeData = {
                element: win,
                startX: e.clientX,
                startY: e.clientY,
                startWidth: win.offsetWidth,
                startHeight: win.offsetHeight
            };
            e.preventDefault();
        }
    }
});

document.addEventListener('mousemove', function(e) {
    if (resizeData) {
        const dx = e.clientX - resizeData.startX;
        const dy = e.clientY - resizeData.startY;
        const newWidth = Math.max(300, resizeData.startWidth + dx);
        const newHeight = Math.max(200, resizeData.startHeight + dy);
        resizeData.element.style.width = newWidth + 'px';
        resizeData.element.style.height = newHeight + 'px';
        resizeData.element.style.minWidth = '300px';
        resizeData.element.style.minHeight = '200px';
    }
});

document.addEventListener('mouseup', function() {
    if (resizeData) {
        resizeData = null;
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

let audioPlayer = null;

function playMusic() {
    const urlInput = document.getElementById('music-url');
    const status = document.getElementById('music-status');

    if (!status) {
        console.error('music-status element not found');
        return;
    }

    if (!urlInput || !urlInput.value.trim()) {
        status.textContent = '❌ Please enter a URL';
        return;
    }

    const url = urlInput.value.trim();

    if (!url.startsWith('https://') && !url.startsWith('http://')) {
        status.textContent = '❌ Invalid URL (use https://)';
        return;
    }

    try {
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer = null;
        }

        audioPlayer = new Audio(url);
        audioPlayer.play()
            .then(() => {
                status.textContent = '🎵 Playing...';
            })
            .catch((err) => {
                status.textContent = '❌ Cannot play this URL';
                console.error('Audio playback error:', err);
            });

        audioPlayer.onerror = function() {
            status.textContent = '❌ Error loading audio';
        };

        audioPlayer.onended = function() {
            status.textContent = '⏹ Track ended';
        };

    } catch (err) {
        status.textContent = '❌ Error: ' + err.message;
        console.error('Audio error:', err);
    }
}

function pauseMusic() {
    const status = document.getElementById('music-status');
    if (audioPlayer && status) {
        audioPlayer.pause();
        status.textContent = '⏸ Paused';
    }
}

function stopMusic() {
    const status = document.getElementById('music-status');
    if (audioPlayer && status) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        status.textContent = '⏹ Stopped';
    }
}

function setTheme(theme) {
    const os = document.getElementById('os');
    if (theme === 'light') {
        os.style.background = '#ffffff';
        os.style.color = '#000000';
        document.querySelectorAll('.window').forEach(w => {
            w.style.background = '#ffffff';
            w.style.color = '#000000';
        });
        document.querySelectorAll('.window-header').forEach(h => {
            h.style.background = '#eeeeee';
            h.style.borderBottom = '1px solid #dddddd';
        });
        document.querySelectorAll('.window-title').forEach(t => {
            t.style.color = '#000000';
        });
        document.querySelectorAll('.window-body button').forEach(b => {
            b.style.color = '#000000';
            b.style.border = '1px solid #cccccc';
        });
        document.querySelectorAll('.window-body input, .window-body textarea').forEach(i => {
            i.style.background = '#f5f5f5';
            i.style.color = '#000000';
            i.style.border = '1px solid #cccccc';
        });
    } else {
        os.style.background = '#0a0a0a';
        os.style.color = '#ffffff';
        document.querySelectorAll('.window').forEach(w => {
            w.style.background = '#0a0a0a';
            w.style.color = '#ffffff';
        });
        document.querySelectorAll('.window-header').forEach(h => {
            h.style.background = '#111111';
            h.style.borderBottom = '1px solid #222222';
        });
        document.querySelectorAll('.window-title').forEach(t => {
            t.style.color = '#ffffff';
        });
        document.querySelectorAll('.window-body button').forEach(b => {
            b.style.color = '#ffffff';
            b.style.border = '1px solid #333333';
        });
        document.querySelectorAll('.window-body input, .window-body textarea').forEach(i => {
            i.style.background = '#000000';
            i.style.color = '#ffffff';
            i.style.border = '1px solid #2a2a2a';
        });
    }
    localStorage.setItem('os-theme', theme);
}

function setFontSize(size) {
    const os = document.getElementById('os');
    if (size === 'small') {
        os.style.fontSize = '12px';
    } else if (size === 'large') {
        os.style.fontSize = '20px';
    } else {
        os.style.fontSize = '16px';
    }
    localStorage.setItem('os-fontsize', size);
}

function loadSettings() {
    const theme = localStorage.getItem('os-theme');
    const fontSize = localStorage.getItem('os-fontsize');
    if (theme) setTheme(theme);
    if (fontSize) setFontSize(fontSize);
}

loadSettings();

function showQuote() {
    const quotes = [
        "Code is poetry.",
        "Keep building.",
        "Small steps count.",
        "You got this.",
        "Progress over perfection.",
        "Make it work, then make it better.",
        "Every expert was once a beginner.",
        "Done is better than perfect.",
        "The best time to start was yesterday. The next best is now.",
        "Fall seven times, stand up eight."
    ];
    const random = Math.floor(Math.random() * quotes.length);
    const quoteEl = document.getElementById('quote');
    if (quoteEl) {
        quoteEl.textContent = '💬 ' + quotes[random];
    }
}

showQuote();

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
    }

    if (pongAnimations[id]) cancelAnimationFrame(pongAnimations[id]);
    draw();
}
