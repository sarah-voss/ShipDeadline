
import * as calculatorRender from "../../renderers/calculator-render.js";

import * as state from "../../state.js";

import { getCalculatorScenario } from "../../logic/scenarios.js";
import { MODE_RENDERERS, MAX_FULL_ROAD_VEHICLES } from "../../shipment/config.js";
import { getDestinationArea, getCountryFieldStatus } from '../../logic/geography-rules.js';
import { saveCalculatorState } from "../../storage.js";



export function initFullRoadController({ elements }) {

    const { 
        calculatorSteps,
        calculatorNextButton
     } = elements;
    
       // STEP 2: MODE FULL ROAD

       calculatorSteps.shipment.addEventListener('change', (e) => {
        const select = e.target.closest('[data-vehicle-select]');
        const vehicleContainer = e.target.closest('[data-vehicle-container]');
        if (!select) return;

        const value = select.value;
        const vehicleId = Number(select.dataset.vehicleId);
        const vehicles = state.calculatorState.shipmentDetails.fullRoad.vehicles;
        const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);

        state.setFullRoadVehicleType(vehicleIndex, value);

        const fieldStatus = value ? 'valid' : 'idle';
        calculatorRender.renderFieldState(vehicleContainer, fieldStatus);

        const isComplete = state.isFullRoadComplete();

        if (isComplete) {
            calculatorRender.validateNextButton(calculatorNextButton);
        } else {
            calculatorRender.disableNextButton(calculatorNextButton);
        }
       })


    // add Vehicle
       calculatorSteps.shipment.addEventListener('click', (e) => {
        const addButton = e.target.closest('[data-add-vehicle]');

        if (!addButton) return;

        const vehicles = state.calculatorState.shipmentDetails.fullRoad.vehicles;

        if (vehicles.length >= MAX_FULL_ROAD_VEHICLES) {
            // render warning
            return;
        }

        state.addFullRoadVehicle();
        saveCalculatorState(state.calculatorState);
        
        const selectedCountry = state.getSelectedLocation('destination', 'country');
        const scenario = getCalculatorScenario({
        loadType: state.getLoadType(),
        destinationArea: getDestinationArea(selectedCountry),
        });

        const renderMode = MODE_RENDERERS[scenario];
        renderMode(calculatorSteps.shipment, vehicles);

        calculatorRender.disableNextButton(calculatorNextButton);
       })

      

      // remove Vehicle
       calculatorSteps.shipment.addEventListener('click', (e) => {
        const removeButton = e.target.closest('[data-remove-vehicle]');

        if (!removeButton) return;

        state.removeFullRoadVehicle(Number(removeButton.dataset.vehicleId));
        saveCalculatorState(state.calculatorState);

        const vehicles = state.calculatorState.shipmentDetails.fullRoad.vehicles;

        const selectedCountry = state.getSelectedLocation('destination', 'country');
        const scenario = getCalculatorScenario({
        loadType: state.getLoadType(),
        destinationArea: getDestinationArea(selectedCountry),
        });

        const renderMode = MODE_RENDERERS[scenario];
        renderMode(calculatorSteps.shipment, vehicles);

        calculatorRender.disableNextButton(calculatorNextButton);
       })


}