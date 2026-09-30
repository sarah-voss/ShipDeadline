
import * as calculatorRender from "../renderers/calculator-render.js";
import * as state from "../state.js";

import { getCalculatorScenario, isLoadTypeFullyUnavailable } from "../logic/scenarios.js";
import { SCENARIO_RENDERERS, IMPLEMENTED_SCENARIOS } from "../shipment/config.js";
import { getDestinationArea, getCountryFieldStatus } from '../logic/geography-rules.js';
import { saveCalculatorState } from "../storage.js";
import { initRouteController } from "./route-controller.js";
import { renderSummaryFromState } from "./summary-overview-controller.js";
import { initFullRoadController } from "./shipment-step/full-road-controller.js";
import { renderResultStep } from "./result-controller.js";




export function initCalculatorController({ calculatorRoot, elements, pageOverlay }) {

    // init sub-controllers
    const { resetCalculatorForm } = initRouteController({
        elements,
        pageOverlay,
        onRouteChange: handleCalculatorChange
    });

    initFullRoadController({
        elements,
        onFullRoadChange: handleCalculatorChange
    });


    // destructure imported values
    const { tabButtons,
        calculatorBody,
        locations,
        calculatorNextButton,
        calculatorPreviousButtons,
        calculatorSteps,
        startNewButton,
    } = elements;


    // ==========================================
    //  ===  CALCULATOR FORM ===
    // ==========================================

    // SAVE CALCULATOR STATE
    function saveCurrentState() {
        saveCalculatorState(state.calculatorState);
    }

    // GET CURRENT SCENARIO
    function getCurrentScenario() {
        const departureCountryCode = state.getSelectedCountryCode('departure');
        const destinationCountryCode = state.getSelectedCountryCode('destination');

        if (!destinationCountryCode) return null;
        if (getCountryFieldStatus('departure', departureCountryCode) === 'error') return null;

        return getCalculatorScenario({
            loadType: state.getLoadType(),
            destinationArea: getDestinationArea(destinationCountryCode),
        });
    }


    // SYNC NEXT BUTTON
    function syncNextButton() {
        const currentStep = state.getCurrentStep();
        const isCurrentStepValid = state.getStepValidity(currentStep);

        if (isCurrentStepValid) {
            calculatorRender.enableNextButton(calculatorNextButton);
        } else {
            calculatorRender.disableNextButton(calculatorNextButton);
        }
    }

    // SYNC CALCULATOR UI FROM STATE
    function syncCalculatorUiFromState() {
        const scenario = getCurrentScenario();
        renderSummaryFromState({ elements, scenario });
        syncNextButton();
        saveCurrentState();
    }

    function handleCalculatorChange() {
        state.setResultAsStale();
        syncCalculatorUiFromState();
    }


    // RENDER CALCULATOR FROM STATE
    function renderCalculatorFromState() {
        const currentStep = state.getCurrentStep();
        const scenario = getCurrentScenario();
        const loadType = state.getLoadType();

        if (isLoadTypeFullyUnavailable(loadType)) {
            calculatorRender.renderCalculatorStep(calculatorSteps, 'shipment', calculatorRoot);
            calculatorRender.renderComingSoonMode(calculatorSteps.shipment);
            calculatorRender.hidePreviousButtons(calculatorPreviousButtons);
            calculatorRender.disableNextButton(calculatorNextButton);
            return;
        }

        calculatorRender.renderCalculatorStep(calculatorSteps, currentStep, calculatorRoot);
        syncCalculatorUiFromState();


        if (currentStep !== 'route') {
            calculatorRender.renderPreviousButtons(calculatorPreviousButtons)
        } else {
            calculatorRender.hidePreviousButtons(calculatorPreviousButtons);
        }

        if (currentStep === 'shipment') {
            // scenario can be null if route state is missing/corrupted (e.g. restored from stale storage)
            if (!scenario) {
                calculatorRender.renderComingSoonMode(calculatorSteps.shipment);
                state.setStepValidity('shipment', false);
                syncNextButton();
                return;
            }

            const renderMode = SCENARIO_RENDERERS[scenario];
            renderMode(
                calculatorSteps.shipment,
                state.calculatorState.shipmentDetails.fullRoad.vehicles,
                scenario
            );

            if (!IMPLEMENTED_SCENARIOS.includes(scenario)) {
                state.setStepValidity('shipment', false);
                syncNextButton();
            }
        }

        if (currentStep === 'result') {
            renderResultStep({ elements });

            if (!state.hasResultBeenShown()) {
                calculatorRender.showResultLoading(calculatorRoot);
                elements.loadingElement.addEventListener('animationend', () => {
                    calculatorRender.hideResultLoading(calculatorRoot);
                    state.setResultAsShown();
                    saveCurrentState();
                }, { once: true });
            }
        }
    }

    // START NEW CALCULATION 
    function startNewCalculation() {
        resetCalculatorForm();
        renderCalculatorFromState();
    }

    // INIT
    calculatorRender.renderLoadTypeTabs({
        loadType: state.getLoadType(),
        elements,
        calculatorRoot
    });
    renderCalculatorFromState();


    // ==========================================
    //  === EVENT LISTENERS CALCULATOR FORM ===
    // ==========================================

    // EVENT LISTENERS TAB BUTTONS
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const loadType = button.dataset.loadType;

            state.setLoadType(loadType);
            state.setCurrentStep('route');

            calculatorRender.renderLoadTypeTabs({
                loadType,
                elements,
                calculatorRoot
            });
            calculatorRender.switchMode({
                calculatorBody
            })

            startNewCalculation();
        })
    });





    // ----- NEXT BUTTON -----
    calculatorNextButton.addEventListener('click', () => {
        const currentStep = state.getCurrentStep();

        if (currentStep === 'route') {
            state.setCurrentStep('shipment');
            calculatorSteps.shipment.classList.add('step-enter-next');
            calculatorSteps.shipment.classList.remove('step-enter-back');
            renderCalculatorFromState();
        }

        if (currentStep === 'shipment') {
            state.setCurrentStep('result');
            renderCalculatorFromState();
        }

    })


    // ----- PREVIOUS BUTTON -----
    calculatorPreviousButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = state.getCurrentStep();

            if (currentStep === 'shipment') {
                state.setCurrentStep('route');
                calculatorSteps.route.classList.add('step-enter-back');
                renderCalculatorFromState();
            }

            if (currentStep === 'result') {
                state.setCurrentStep('shipment');
                calculatorSteps.shipment.classList.remove('step-enter-next');
                calculatorSteps.shipment.classList.add('step-enter-back');
                renderCalculatorFromState();
            }
        })
    })


    // EDIT ALL SUMMARY BUTTON 
    elements.summaryCard.editAllButton.addEventListener('click', () => {
        state.setCurrentStep('route');
        renderCalculatorFromState();
        calculatorRender.focusFirstRouteField(locations.departure.country.input);
    })

    // START NEW BUTTON
    startNewButton.addEventListener('click', () => {
        state.setCurrentStep('route');
        startNewCalculation();
    })

}
