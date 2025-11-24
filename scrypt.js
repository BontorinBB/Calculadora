let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

function updateDisplay() {
    display.value = currentInput;
}

function appendToDisplay(value) {
    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = value;
        shouldResetDisplay = false;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    updateDisplay();
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    try {
        // Substituir × por * para o cálculo
        let expression = currentInput.replace(/×/g, '*');
        
        // Verificar se a expressão é válida
        if (!isValidExpression(expression)) {
            throw new Error('Expressão inválida');
        }
        
        // Calcular o resultado
        let result = eval(expression);
        
        // Verificar se o resultado é um número válido
        if (typeof result !== 'number' || !isFinite(result)) {
            throw new Error('Resultado inválido');
        }
        
        // Arredondar para evitar números muito longos
        result = Math.round(result * 100000000) / 100000000;
        
        currentInput = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
        
    } catch (error) {
        currentInput = 'Erro';
        updateDisplay();
        setTimeout(() => {
            currentInput = '0';
            updateDisplay();
        }, 1000);
    }
}

function isValidExpression(expr) {
    // Permitir apenas números, operadores e ponto decimal
    return /^[0-9+\-*/.()]+$/.test(expr);
}

// Suporte ao teclado
document.addEventListener('keydown', function(e) {
    e.preventDefault();
    
    const key = e.key;
    
    if ('0123456789'.includes(key)) {
        appendToDisplay(key);
    } else if (key === '+') {
        appendToDisplay('+');
    } else if (key === '-') {
        appendToDisplay('-');
    } else if (key === '*') {
        appendToDisplay('×');
    } else if (key === '/') {
        appendToDisplay('/');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearAll();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === '.') {
        appendToDisplay('.');
    }
});

// Inicializar
updateDisplay();
