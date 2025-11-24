let display = document.getElementById('display');
let currentNumber = '0';
let operator = '';
let previousNumber = '';

function pressNumber(num) {
    if (currentNumber === '0') {
        currentNumber = num.toString();
    } else {
        currentNumber += num.toString();
    }
    display.value = currentNumber;
}

function pressOperator(op) {
    operator = op;
    previousNumber = currentNumber;
    currentNumber = '0';
}

function calculateResult() {
    let result;
    let prev = parseFloat(previousNumber);
    let current = parseFloat(currentNumber);
    
    switch(operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentNumber = result.toString();
    display.value = currentNumber;
    operator = '';
    previousNumber = '';
}

function clearAll() {
    currentNumber = '0';
    operator = '';
    previousNumber = '';
    display.value = currentNumber;
}

function pressDot() {
    if (!currentNumber.includes('.')) {
        currentNumber += '.';
        display.value = currentNumber;
    }
}

// Inicializar
display.value = currentNumber;
