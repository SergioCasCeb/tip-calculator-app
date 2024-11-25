const calculator = document.getElementById('calculator');
const amountBillInput = document.getElementById('amount-bill');
const billInputError = document.getElementById('bill-error-msg');
const tipOptions = document.querySelectorAll('.tip-option');
const customTipInput = document.getElementById('custom-tip');
const amountPeopleInput = document.getElementById('amount-people');
const amountPeopleError = document.getElementById('people-error-msg');

const tipAmount = document.getElementById('tip-amount');
const tipTotal = document.getElementById('tip-total');
const resetButton = document.getElementById('reset-btn');


// Reset the calculator to its default values when loading the page
window.onload = function () {
    resetCalculator();
};


/***************************************************/
/* INITIALIZING THE CALCULATOR WHEN A TIP IS GIVEN */
/***************************************************/

/**
 * Initialize the calculator if the user selects one of the default tip options
 */
tipOptions.forEach(option => {
    option.addEventListener('click', () => {
        customTipInput.value = '';

        if (checkIfValid()) {
            updateValues();
            resetButton.disabled = false;
        } else {
            option.checked = false;
        }
    })
});

/**
 * Initialize the calculator if the user inputs a custom tip value
 */
customTipInput.addEventListener('input', () => {
    tipOptions.forEach(option => {
        option.checked = false;
    });

    if (checkIfValid()) {
        updateValues();
        resetButton.disabled = false;
    }
});

/**
 * Uncheck the radio buttons if the user clicks on the custom tip input
 */
customTipInput.addEventListener('click', () => {
    tipOptions.forEach(option => {
        option.checked = false;
    });
});

/***********************************/
/* CALCULATING AND UPDATING VALUES */
/***********************************/

/**
 * Calculate the tip per person and the total per person
 * @param {number} totalBill - the total bill amount
 * @param {number} amountPeople - the number of people to split the bill
 * @param {number} tipPercentage - the tip percentage
 * @returns {Array} - the tip per person and the total per person
 */
function calculateTip(totalBill, amountPeople, tipPercentage) {

    const tipPerPerson = Math.round(((totalBill * (tipPercentage / 100)) / amountPeople) * 100) / 100;
    const totalPerPerson = Math.round(((totalBill / amountPeople) + tipPerPerson) * 100) / 100;

    return [tipPerPerson, totalPerPerson];
}

/**
 * Get the tip value from the selected option of the custom input
 * @returns {number} tipValue - The tip value
 */
function getTipValue() {
    let tipValue = 0;

    if (customTipInput.value !== '' && Number(customTipInput.value) > 0) {
        tipValue = Number(customTipInput.value);
    } else {
        tipOptions.forEach(option => {
            if (option.checked) {
                tipValue = Number(option.value);
            }
        });
    }

    return tipValue;
}

/**
 * Update the tip amount and total per person values
 */
function updateValues() {
    const totalBill = Number(amountBillInput.value);
    const amountPeople = Number(amountPeopleInput.value);
    const tipPercentage = getTipValue();
    

    const [tipAmountValue, totalValue] = calculateTip(totalBill, amountPeople, tipPercentage);

    tipAmount.textContent = tipAmountValue;
    tipTotal.textContent = totalValue;
}

/*********************/
/* CHECKING VALIDITY */
/*********************/

/**
 * Checking if the input values are valid or not
 * @returns {boolean} isValid - If the input values are valid
 */
function checkIfValid() {
    let isValid = false;

    if (isBillAmountValid() && isPeopleValid()) {
        isValid = true;
        hideAllErrors();
    }
    else {
        isValid = false;
    }

    return isValid;
}

/**
 * Check if the people input is valid, and hiding and showing the error message accordingly
 * @returns {boolean} isPeopleValid - If the people input is valid
 */
function isPeopleValid() {
    let isPeopleValid = false;

    if (amountPeopleInput.value === '' || Number(amountPeopleInput.value) <= 0 || Number(amountPeopleInput.value) % 1 !== 0) {
        isPeopleValid = false;
        showPeopleErrorMessage();
    } else {
        isPeopleValid = true;
        hidePeopleErrorMessage();
    }

    return isPeopleValid;
}

/**
 * Check if the bil amount input is valid, and hiding and showing the error message accordingly
 * @returns {boolean} isBillAmountValid - If he bill amount input is valid
 */
function isBillAmountValid() {
    let isBillAmountValid = false;

    if (amountBillInput.value === '' || Number(amountBillInput.value) <= 0) {
        isBillAmountValid = false;
        showBillErrorMessage();
    } else {
        isBillAmountValid = true;
        hideBillErrorMessage();
    }

    return isBillAmountValid;
}

/*************************************/
/* HIDING AND SHOWING ERROR MESSAGES */
/*************************************/

/**
 * Hide all the error messages
 */
function hideAllErrors() {
    hideBillErrorMessage();
    hidePeopleErrorMessage();
}

/**
 * Check if the input values are valid, hide the error messages
 */
amountBillInput.addEventListener('input', () => {
    isBillAmountValid();
    resetResults();
});

/**
 * Show the bill amount input error message
 */
function showBillErrorMessage() {
    billInputError.classList.add('show');
    billInputError.textContent = 'Can\'t be zero';
    amountBillInput.classList.add('invalid');
}

/**
 * Hide only the bill error message
 */
function hideBillErrorMessage() {
    billInputError.classList.remove('show');
    amountBillInput.classList.remove('invalid');
}


/**
 * Check if the input values are valid, hide the error messages
 */
amountPeopleInput.addEventListener('input', () => {
    isPeopleValid();
    resetResults();
});

/**
 * Show the bill amount input error message
 */
function showPeopleErrorMessage() {

    if (Number(amountPeopleInput.value) % 1) {
        amountPeopleError.classList.add('show');
        amountPeopleError.textContent = 'No decimals';
        amountPeopleInput.classList.add('invalid');
    }
    else {
        amountPeopleError.classList.add('show');
        amountPeopleError.textContent = 'Can\'t be zero';
        amountPeopleInput.classList.add('invalid');
    }
}

/**
 * Hide only the people error message
 */
function hidePeopleErrorMessage() {
    amountPeopleError.classList.remove('show');
    amountPeopleInput.classList.remove('invalid');
}


/**Hiding the error message whenever the user clicks somewhere on the page 
*that is not the tip options and the respective input field is empty
*/
document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('tip') && amountBillInput.value === '') {
        hideBillErrorMessage();
    }
    if (!e.target.classList.contains('tip') && amountPeopleInput.value === '') {
        hidePeopleErrorMessage();
    }
});


/********************/
/* RESET CALCULATOR */
/********************/


/**
 * Reset the calculator to its default values
 */
function resetCalculator() {
    amountBillInput.value = '';
    amountPeopleInput.value = '';
    customTipInput.value = '';
    tipOptions.forEach(option => {
        option.checked = false;
    });

    tipAmount.textContent = '0.00';
    tipTotal.textContent = '0.00';

    resetButton.disabled = true;
}

/**
 * Reset the results to their default values as well as the tip options
 */
function resetResults() {
    customTipInput.value = '';
    tipOptions.forEach(option => {
        option.checked = false;
    });
    tipAmount.textContent = '0.00';
    tipTotal.textContent = '0.00';
    resetButton.disabled = true;
}

/**
 * Prevent the the reset default values and implementing the resetCalculator function
 */
calculator.addEventListener('reset', (e) => {
    e.preventDefault();
    resetCalculator();
})




