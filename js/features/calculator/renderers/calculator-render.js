// render calculator tabs
export function renderCalculator({ calculatorRoot, mode, elements }) {
    const { tabButtons, modeDescriptionTitle, modeDescriptionText } = elements;
    tabButtons.forEach(button => {
        button.classList.remove('calculator__tab--active');
        if (button.dataset.modeTrigger === mode) {
            button.classList.add('calculator__tab--active');
        }
    });
    const descriptionTitles = {
        'full-load': 'Dedicated shipment',
        'partial-load': 'Partial capacity'
    };

    const descriptionTexts = {
        'full-load': 'Exclusive capacity, direct routing',
        'partial-load': 'Based on shipment size'
    }

    modeDescriptionTitle.textContent = descriptionTitles[mode];
    modeDescriptionText.textContent = descriptionTexts[mode];

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
        if (stepName === 'result') {
            step.classList.toggle('calculator--result', stepName === stepToShow);
        }
    });
}

// focus first input
export function focusFirstRouteField(input) {
    input.focus();
}

const SCENARIO_LABELS = {
    'full-sea': 'Sea freight (FCL)',
    'partial-road': 'Partial load - road (LTL)',
    'partial-air': 'Partial load - air',
}


// vehicles is unused here but kept so this matches the (container, vehicles, scenario)
// signature every MODE_RENDERERS entry is called with in calculator-controller.js
export function renderComingSoonMode(container, vehicles, scenario) {
    const title = document.createElement('h2');
    const message = document.createElement('p');

    title.classList.add('coming-soon__title');
    title.textContent = `${SCENARIO_LABELS[scenario] ?? 'This shipment mode'} is not available yet`;

    message.classList.add('coming-soon__text');
    message.textContent = 'This mode is on the roadmap. For now the calculator supports full load road shipments within continental Europe only.';

    container.replaceChildren(title, message);
}