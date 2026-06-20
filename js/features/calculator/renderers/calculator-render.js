// render calculator tabs
export function renderCalculator({ calculatorRoot, mode, elements }) {
    const { tabButtons, descriptionElement } = elements;
    tabButtons.forEach(button => {
        button.classList.remove('calculator__tab--active');
        if (button.dataset.modeTrigger === mode) {
            button.classList.add('calculator__tab--active');
        }
    });
    const descriptions = {
        'full-load': 'Dedicated shipment\n→ exclusive capacity, direct routing',
        'partial-load': 'Partial capacity\n→ based on shipment size'
    };
    descriptionElement.textContent = descriptions[mode];

    calculatorRoot.classList.remove('calculator--full-load', 'calculator--partial-load');
    calculatorRoot.classList.add(`calculator--${mode}`);
}

export function switchMode({ calculatorBody, mode }) {
    calculatorBody.classList.add('is-switching');

    setTimeout(() => {
        calculatorBody.classList.remove('is-switching');
    }, 180);
}


export function renderFieldState(field, status) {
    field.classList.remove('validated', 'error', 'idle');

    if (status === 'valid') {
        field.classList.add('validated');
    }

    if (status === 'error') {
        field.classList.add('error');
    }

    if (status === 'idle') {
        field.classList.add('idle');
    }
}


// VALIDATE NEXT BUTTON
export function validateNextButton(button) {
    button.disabled = false;
    button.classList.remove('disabled');
}

// disable next button
export function disableNextButton(button) {
    button.disabled = true;
    button.classList.add('disabled');
}

// Display Previous button
export function renderPreviousButton(button) {
    button.disabled = false;
    button.classList.add('is-visible');
}

// hide previous Button
export function hidePreviousButton(button) {
    button.disabled = true;
    button.classList.remove('is-visible');
}

// RENDER / HIDE STEPS
export function renderCalculatorStep(calculatorSteps, stepToShow) {
    Object.entries(calculatorSteps).forEach(([stepName, step]) => {
        step.hidden = stepName !== stepToShow;
    });
}

// focus first input
export function focusFirstRouteField(input) {
    input.focus();
}