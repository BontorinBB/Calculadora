const resultElement = document.getElementById('result');
const historyListElement = document.getElementById('historyList');

let currentInput = '';
let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];

function updateHistory() {
    historyListElement.innerHTML = '';
    history.slice(-10).reverse().forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = item;
        historyListElement.appendChild(historyItem);
    });
}

function appendToDisplay(value) {
    if (currentInput.length >= 20) return;
    
    // Prevent multiple operators in sequence
    const lastChar = currentInput.slice(-1);
    if ('+-*/'.includes(value) && '+-*/'.includes(lastChar)) {
        return;
    }
    
    currentInput += value;
    resultElement.value = currentInput;
}

function clearDisplay() {
    currentInput = '';
    resultElement.value = '';
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    resultElement.value = currentInput;
}

function calculate() {
    if (!currentInput) return;
    
    try {
        // Replace × with * for evaluation
        let expression = currentInput.replace(/×/g, '*');
        
        // Basic validation
        if (/[^0-9+\-*/.()]/.test(expression)) {
            throw new Error('Caractere inválido');
        }
        
        // Evaluate safely
        let result = eval(expression);
        
        // Check for division by zero
        if (!isFinite(result)) {
            throw new Error('Divisão por zero');
        }
        
        // Round to avoid floating point issues
        result = Math.round(result * 100000000) / 100000000;
        
        const calculation = `${currentInput} = ${result}`;
        history.push(calculation);
        localStorage.setItem('calculatorHistory', JSON.stringify(history));
        
        currentInput = result.toString();
        resultElement.value = currentInput;
        updateHistory();
        
    } catch (error) {
        resultElement.value = 'Erro';
        currentInput = '';
        setTimeout(() => {
            resultElement.value = '';
        }, 1000);
    }
}

function clearHistory() {
    history = [];
    localStorage.removeItem('calculatorHistory');
    updateHistory();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if ('0123456789'.includes(key)) {
        appendToDisplay(key);
    } else if ('+-*/'.includes(key)) {
        appendToDisplay(key === '*' ? '×' : key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === '.') {
        appendToDisplay('.');
    }
});

// Initialize
updateHistory();
