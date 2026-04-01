// ==================== ELEMENT REFERENCES ====================
const htmlCode = document.getElementById('html-code');
const cssCode = document.getElementById('css-code');
const jsCode = document.getElementById('js-code');
const output = document.getElementById('output');
const clearAllBtn = document.getElementById('clearAll');
const downloadBtn = document.getElementById('downloadBtn');
const undoBtn = document.getElementById('undoBtn');
const toast = document.getElementById('toast');
const statusBadge = document.getElementById('status');
const htmlCount = document.getElementById('html-count');
const cssCount = document.getElementById('css-count');
const jsCount = document.getElementById('js-count');

// ==================== STATE MANAGEMENT ====================
let history = [];
let historyStep = 0;
const MAX_HISTORY = 50;

// ==================== AUTO-SAVE TO LOCALSTORAGE ====================
const STORAGE_KEYS = {
    HTML: 'procode_html',
    CSS: 'procode_css',
    JS: 'procode_js',
    HISTORY: 'procode_history',
    HISTORY_STEP: 'procode_history_step'
};

// Load from localStorage on page load
window.addEventListener('load', () => {
    console.log('Page loaded, initializing editor...');
    loadFromStorage();
    updateCharCount();
    saveToHistory();
    run();
    attachEventListeners();
});

function loadFromStorage() {
    const savedHtml = localStorage.getItem(STORAGE_KEYS.HTML);
    const savedCss = localStorage.getItem(STORAGE_KEYS.CSS);
    const savedJs = localStorage.getItem(STORAGE_KEYS.JS);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const savedHistoryStep = localStorage.getItem(STORAGE_KEYS.HISTORY_STEP);

    if (savedHtml) htmlCode.value = savedHtml;
    if (savedCss) cssCode.value = savedCss;
    if (savedJs) jsCode.value = savedJs;
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        historyStep = savedHistoryStep ? parseInt(savedHistoryStep) : history.length - 1;
    }
    updateUndoButton();
}

function saveToStorage() {
    localStorage.setItem(STORAGE_KEYS.HTML, htmlCode.value);
    localStorage.setItem(STORAGE_KEYS.CSS, cssCode.value);
    localStorage.setItem(STORAGE_KEYS.JS, jsCode.value);
}

function saveToHistory() {
    const currentState = {
        html: htmlCode.value,
        css: cssCode.value,
        js: jsCode.value
    };

    // Remove any history after current step
    history = history.slice(0, historyStep + 1);
    
    // Add new state
    history.push(currentState);
    historyStep = history.length - 1;

    // Limit history size
    if (history.length > MAX_HISTORY) {
        history.shift();
        historyStep--;
    }

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    localStorage.setItem(STORAGE_KEYS.HISTORY_STEP, historyStep);
    updateUndoButton();
}

// ==================== RUN CODE ====================
function run() {
    try {
        const html = htmlCode.value;
        const css = cssCode.value;
        const js = jsCode.value;

        const doc = output.contentDocument || output.contentWindow.document;
        
        // Create complete HTML document
        const completeHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Output</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            padding: 20px;
        }
        ${css}
    </style>
</head>
<body>
    <div id="app-root">
        ${html}
    </div>
    <script>
        (function() {
            try {
                ${js}
            } catch(e) {
                console.error('JavaScript Error:', e.message);
            }
        })();
    </script>
</body>
</html>
        `;
        
        doc.open();
        doc.write(completeHTML);
        doc.close();

        // Update status
        setStatus('Ready', 'success');
    } catch (error) {
        setStatus('Error in code', 'error');
        console.error('Code execution error:', error);
    }
}

// ==================== UPDATE CHARACTER COUNT ====================
function updateCharCount() {
    htmlCount.textContent = htmlCode.value.length + ' chars';
    cssCount.textContent = cssCode.value.length + ' chars';
    jsCount.textContent = jsCode.value.length + ' chars';
}

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
    htmlCode.addEventListener('input', () => {
        updateCharCount();
        saveToStorage();
        run();
        clearTimeout(historyDebounce);
        historyDebounce = setTimeout(saveToHistory, 1000);
    });

    cssCode.addEventListener('input', () => {
        updateCharCount();
        saveToStorage();
        run();
        clearTimeout(historyDebounce);
        historyDebounce = setTimeout(saveToHistory, 1000);
    });

    jsCode.addEventListener('input', () => {
        updateCharCount();
        saveToStorage();
        run();
        clearTimeout(historyDebounce);
        historyDebounce = setTimeout(saveToHistory, 1000);
    });

    clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all code? This action cannot be undone.')) {
            htmlCode.value = '';
            cssCode.value = '';
            jsCode.value = '';
            saveToHistory();
            updateCharCount();
            run();
            showToast('All code cleared', 'success');
        }
    });

    downloadBtn.addEventListener('click', downloadCode);
    undoBtn.addEventListener('click', undo);

    // ==================== KEYBOARD SHORTCUTS ====================
    document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+L: Clear All
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyL') {
            e.preventDefault();
            clearAllBtn.click();
        }

        // Ctrl+S: Download
        if (e.ctrlKey && e.code === 'KeyS') {
            e.preventDefault();
            downloadBtn.click();
        }

        // Ctrl+Z: Undo
        if (e.ctrlKey && e.code === 'KeyZ') {
            e.preventDefault();
            undo();
        }

        // Tab in textarea: Insert tab instead of focus change
        if (e.code === 'Tab' && e.target.classList.contains('editor-textarea')) {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 1;
            
            // Trigger input event to update display
            textarea.dispatchEvent(new Event('input'));
        }
    });
}

// Debounce variable
let historyDebounce;

// ==================== DOWNLOAD CODE ====================
function downloadCode() {
    const html = htmlCode.value;
    const css = cssCode.value;
    const js = jsCode.value;

    const completeCode = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <style>
${css.split('\n').map(line => '        ' + line).join('\n')}
    </style>
</head>
<body>
${html.split('\n').map(line => '    ' + line).join('\n')}
    <script>
${js.split('\n').map(line => '        ' + line).join('\n')}
    <\/script>
</body>
</html>
    `;

    const blob = new Blob([completeCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Code downloaded as index.html', 'success');
}

// ==================== UNDO FUNCTIONALITY ====================
function undo() {
    if (historyStep > 0) {
        historyStep--;
        const state = history[historyStep];
        htmlCode.value = state.html;
        cssCode.value = state.css;
        jsCode.value = state.js;
        updateCharCount();
        run();
        updateUndoButton();
        localStorage.setItem(STORAGE_KEYS.HISTORY_STEP, historyStep);
        showToast('Code reverted', 'success');
    }
}

function updateUndoButton() {
    undoBtn.disabled = historyStep <= 0;
    undoBtn.style.opacity = historyStep <= 0 ? '0.5' : '1';
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== STATUS INDICATOR ====================
function setStatus(message, type = 'success') {
    statusBadge.textContent = message;
    statusBadge.className = `status-badge ${type === 'error' ? 'error' : ''}`;
}

// ==================== HELPER FUNCTION ====================
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}