import { LOAD_TYPE_DESCRIPTIONS, SCENARIO_LABELS } from "../labels.js";

export function renderLoadTypeTabs({ calculatorRoot, loadType, elements }) {
    const { tabButtons, modeDescriptionTitle, modeDescriptionText } = elements;
    tabButtons.forEach(button => {
        button.classList.remove('calculator__tab--active');
        if (button.dataset.loadType === loadType) {
            button.classList.add('calculator__tab--active');
        }
    });

    modeDescriptionTitle.textContent = LOAD_TYPE_DESCRIPTIONS[loadType]?.title;
    modeDescriptionText.textContent = LOAD_TYPE_DESCRIPTIONS[loadType]?.text;

    calculatorRoot.classList.remove('calculator--full-load', 'calculator--partial-load');
    calculatorRoot.classList.add(`calculator--${loadType}`);
}

// Plays the transition only: the load type itself is switched by the controller
export function switchMode({ calculatorBody }) {
    calculatorBody.classList.add('is-switching');

    setTimeout(() => {
        calculatorBody.classList.remove('is-switching');
    }, 180);
}


export function renderFieldState(field, status) {
    field.classList.remove('validated', 'error');

    if (status === 'valid') {
        field.classList.add('validated');
    }

    if (status === 'error') {
        field.classList.add('error');
    }

}


export function enableNextButton(button) {
    button.disabled = false;
}

export function disableNextButton(button) {
    button.disabled = true;
}

export function renderPreviousButtons(buttonList) {
    buttonList.forEach(button => {
        button.disabled = false;
        button.classList.add('is-visible');
    });
}

export function hidePreviousButtons(buttonList) {
    buttonList.forEach(button => {
        button.disabled = true;
        button.classList.remove('is-visible');
    })
}

export function renderCalculatorStep(calculatorSteps, stepToShow, calculatorRoot) {
    Object.entries(calculatorSteps).forEach(([stepName, step]) => {
        step.hidden = stepName !== stepToShow;
        if (stepName === 'result') {
            calculatorRoot.classList.toggle('calculator--result', stepName === stepToShow);
        }
    });
}

// Direction 'next' slides the step in from the right, 'back' from the left
export function renderStepEnter(step, direction) {
    step.classList.toggle('step-enter-next', direction === 'next');
    step.classList.toggle('step-enter-back', direction === 'back');
}

export function focusFirstRouteField(input) {
    input.focus();
}

// The vehicles parameter is unused here, but kept so the signature matches the
// (container, vehicles, scenario) call every SCENARIO_RENDERERS entry receives
export function renderComingSoonMode(container, vehicles, scenario) {
    const title = document.createElement('h2');
    const message = document.createElement('p');

    title.classList.add('coming-soon__title');
    title.textContent = `${SCENARIO_LABELS[scenario] ?? 'This shipment mode'} is not available yet`;

    message.classList.add('coming-soon__text');
    message.textContent = 'This mode is on the roadmap. For now the calculator supports full load road shipments within continental Europe only.';

    container.replaceChildren(title, message);
}

export function showResultLoading(calculatorRoot) {
    calculatorRoot.classList.add('is-loading');
}

export function hideResultLoading(calculatorRoot) {
    calculatorRoot.classList.remove('is-loading');
}