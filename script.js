"use strict";

let button, row;
const CHAR_LIMIT = 15;
const LARGE_NUM = 1000000000000000;

const buttons = [
    [
        ['√', {className: ['btn', 'sp-operator'], id: ''}],
        ['x²', {className: ['btn', 'sp-operator'], id: ''}],
        ['C', {className: ['btn', 'control'], id: 'clear'}],
        ['D', {className: ['btn', 'control'], id: 'delete'}]
    ],
    [
        ['7', {className: ['btn', 'number'],id: '7'}],
        ['8', {className: ['btn', 'number'],id: '8'}],
        ['9', {className: ['btn', 'number'], id: '9'}],
        ['÷', {className: ['btn', 'operator'], id: ''}]
    ],
    [
        ['4', {className: ['btn', 'number'], id: '4'}],
        ['5', {className: ['btn', 'number'], id: '5'}],
        ['6', {className: ['btn', 'number'], id: '6'}],
        ['×', {className: ['btn', 'operator'], id: ''}]
    ],
    [
        ['1', {className: ['btn', 'number'], id: '1'}],
        ['2', {className: ['btn', 'number'], id: '2'}],
        ['3', {className: ['btn', 'number'], id: '3'}],
        ['−', {className: ['btn', 'operator'], id: ''}]
    ],
    [
        ['.', {className: ['btn', 'number'], id: ''}],
        ['0', {className: ['btn', 'number'], id: '0'}],
        ['=', {className: ['btn'], id: 'equal'}],
        ['+', {className: ['btn', 'operator'], id: ''}]
    ]
]


// create calculator class
class Calculator {
    constructor(inputLabel, equationDisplay) {
        this.input = inputLabel;
        this.equationDis = equationDisplay;
        this.mathOperations = {
            ['+']: (x, y) => Number(x) + Number(y),
            ['−']: (x, y) => Number(x) - Number(y),
            ['×']: (x, y) => Number(x) * Number(y),
            ['÷']: (x, y) => Number(x) / Number(y),
        };

        this.spOperations = {
            ['√']: (n) => Math.sqrt(n),
            ['x²']: (n) => n**2,
        };

        this.clearAll();
    }

    clearAll() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operator = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    equal() {
        if (this.previousOperand && this.operator && this.currentOperand) {

            let current = this.currentOperand;
            this.currentOperand = this.mathOperations[this.operator](this.previousOperand, this.currentOperand);
            this.updateDisplay(current);
        }
    }

    appendNumber(number) {
        if (this.currentOperand.toString().includes('.') && number === '.') return;
        if (this.currentOperand === '0') this.currentOperand = '';

        if (this.currentOperand.toString().length <= CHAR_LIMIT) {
            this.currentOperand += number;
            this.updateDisplay();
        }
    }

    chooseOperator(operator) {
        if (this.currentOperand && !this.operator) {
            this.operator = operator;
            this.previousOperand = this.currentOperand;
            this.currentOperand = '';

        } else if (!this.currentOperand && this.operator) {
            this.operator = operator;

        } else {
            this.previousOperand = this.mathOperations[this.operator](this.previousOperand, this.currentOperand);

            this.operator = operator;
            this.currentOperand = '';
        }
        this.updateDisplay();
    }

    chooseSpOperator(operator) {
        if (operator === '√') {
            this.previousOperand = `${operator} ${this.currentOperand}`;
        } else { this.previousOperand = `${this.currentOperand}²`; }

        this.currentOperand = this.spOperations[operator](this.currentOperand);
        this.updateDisplay(null, true);
    }

    updateDisplay(current = null, sp = null) {
        this.input.innerHTML = formatNumber(this.currentOperand);
        this.equationDis.innerHTML = this.previousOperand ? `${this.previousOperand} ${this.operator}` : '';

        if (current) {
            this.equationDis.innerHTML = `${this.previousOperand} ${this.operator} ${current} =`;
            this.previousOperand = '';
            this.operator = undefined;

        } else if (sp) {
            this.equationDis.innerHTML = this.previousOperand;

        } else if (this.operator && this.previousOperand) {
            this.equationDis.innerHTML = `${this.previousOperand} ${this.operator}`;
        }
    }
}

// Number formater function
function formatNumber(number) {
    let decimalPlaces;

    if (number.toString().indexOf('.') >= CHAR_LIMIT) {
        return Math.round(parseFloat(number));

    } else if (number.toString().includes('e') && number.toString().length > CHAR_LIMIT) {
        decimalPlaces = CHAR_LIMIT - 5;
        return number.toExponential(decimalPlaces);

    } else if (!number.toString().includes('.') && number.toString().length > CHAR_LIMIT) {
        decimalPlaces = CHAR_LIMIT - 5;
        return number.toExponential(decimalPlaces);

    } else if (number.toString().length > CHAR_LIMIT) {
        decimalPlaces = CHAR_LIMIT - 1 - number.toString().indexOf('.');
        return Math.round(Math.pow(10, decimalPlaces) * parseFloat(number)) / Math.pow(10, decimalPlaces);
    }
    return number;
}

// select html elements
const buttonsDiv = document.querySelector('.buttons');
const equationDisplay = document.getElementById('equation-display');
const input = document.getElementById('display');

// create calculator object
const calculator = new Calculator(input, equationDisplay);

// Create all buttons:
for (let btnRow of buttons) {
    row = document.createElement('div');
    row.classList.add('row');

    for (let [btnText, btnArr] of btnRow) {
        button = document.createElement('button');
        button.classList.add(...btnArr['className']);
        btnArr['id'] ? button.id = btnArr['id'] : '';
        button.innerHTML = btnText;

        row.appendChild(button);
    }
    buttonsDiv.appendChild(row);
}


// select all buttons:
const clearBtn = document.getElementById('clear');
const deleteBtn = document.getElementById('delete');
const equalBtn = document.getElementById('equal');

const numberBtns = document.querySelectorAll('.number');
const operatorBtns = document.querySelectorAll('.operator');
const spOperationsBtns = document.querySelectorAll('.sp-operator');


// Add Event Listener into Number buttons:
numberBtns.forEach(function (button) {
    button.addEventListener('click', function () {
        calculator.appendNumber(this.innerHTML);
    });
});


// Add event listener into operator buttons:
operatorBtns.forEach((button) => {
    button.addEventListener('click', () => {
        calculator.chooseOperator(button.innerHTML);
    })
})


// Add Event Listener in special operators:
spOperationsBtns.forEach((button) => {
    button.addEventListener('click', () => calculator.chooseSpOperator(button.innerHTML));
})


// Add event listever into equal button:
equalBtn.addEventListener('click', () => calculator.equal());

// Add Event Listener in clear button:
clearBtn.addEventListener('click', () => calculator.clearAll());

// Add Event Listener in delete button:
deleteBtn.addEventListener('click', () => calculator.delete());

// Add event listever into the document:
document.addEventListener('keypress', function (event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
        document.getElementById(event.key).click();
    }
})

