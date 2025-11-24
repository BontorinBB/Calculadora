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
    // Limitar o tamanho do display
    if (currentInput.length >= 20) return;
    
    const lastChar = currentInput.slice(-1);
    
    // Prevenir múltiplos operadores em sequência
    if ('+-*/'.includes(value) && '+-*/'.includes(lastChar)) {
        // Substituir o último operador pelo novo
        currentInput = currentInput.slice(0, -1) + value;
    } else {
        currentInput += value;
    }
    
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
        // Substituir × por * para cálculo
        let expression = currentInput.replace(/×/g, '*');
        
        // Validação básica de segurança
        if (!/^[0-9+\-*/.()]+$/.test(expression)) {
            throw new Error('Expressão inválida');
        }
        
        // Verificar parênteses balanceados
        let parenthesesCount = 0;
        for (let char of expression) {
            if (char === '(') parenthesesCount++;
            if (char === ')') parenthesesCount--;
            if (parenthesesCount < 0) throw new Error('Parênteses desbalanceados');
        }
        if (parenthesesCount !== 0) throw new Error('Parênteses desbalanceados');
        
        // Avaliar a expressão de forma segura
        let result;
        
        // Usar Function constructor como alternativa mais segura ao eval
        try {
            result = Function('"use strict"; return (' + expression + ')')();
        } catch (e) {
            throw new Error('Erro no cálculo');
        }
        
        // Verificar se o resultado é válido
        if (typeof result !== 'number' || !isFinite(result)) {
            throw new Error('Resultado inválido');
        }
        
        // Arredondar para evitar problemas de ponto flutuante
        result = Math.round(result * 100000000) / 100000000;
        
        // Salvar no histórico
        const calculation = `${currentInput} = ${result}`;
        history.push(calculation);
        
        // Manter apenas os últimos 50 cálculos
        if (history.length > 50) {
            history = history.slice(-50);
        }
        
        localStorage.setItem('calculatorHistory', JSON.stringify(history));
        
        // Atualizar display
        currentInput = result.toString();
        resultElement.value = currentInput;
        updateHistory();
        
    } catch (error) {
        showError();
    }
}

function showError() {
    resultElement.value = 'Erro';
    currentInput = '';
    setTimeout(() => {
        resultElement.value = '';
    }, 1000);
}

function clearHistory() {
    history = [];
    localStorage.removeItem('calculatorHistory');
    updateHistory();
}

// Suporte ao teclado
document.addEventListener('keydown', (e) => {
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
        e.preventDefault(); // Prevenir o menu de contexto no Firefox
        appendToDisplay('/');
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === '(') {
        appendToDisplay('(');
    } else if (key === ')') {
        appendToDisplay(')');
    }
});

// Inicializar
updateHistory();
